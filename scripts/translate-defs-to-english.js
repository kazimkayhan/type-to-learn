/**
 * Convert Chinese `trans` glosses in English dictionaries to English definitions
 * using CC-CEDICT (scripts/.cache/cedict.txt).
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const CEDICT_PATH = path.join(__dirname, '.cache', 'cedict.txt')
const DICT_DIR = path.join(ROOT, 'public', 'dicts')
const HAS_CJK = /[\u3400-\u9FFF]/
const SKIP_CHARS = new Set('的地得了着过们吗呢吧啊呀嘛么之其把被将给'.split(''))
const SKIP_WORDS = new Set(['起来', '下来', '出来', '上来', '上去', '下去', '过来', '过去', '进去', '住'])
const POS_RE = /^(n|v|vt|vi|adj|adv|prep|conj|pron|art|num|int|abbr|aux|pl|det|interj|modal|attrib|pred|link-v|aux\.v)\.\s*/i
const CN_POS = [
  ['不及物动词', 'vi.'],
  ['及物动词', 'vt.'],
  ['助动词', 'aux.'],
  ['形容词', 'adj.'],
  ['副词', 'adv.'],
  ['介词', 'prep.'],
  ['连词', 'conj.'],
  ['代词', 'pron.'],
  ['数词', 'num.'],
  ['量词', 'meas.'],
  ['叹词', 'int.'],
  ['冠词', 'art.'],
  ['名词', 'n.'],
  ['动词', 'v.'],
]

function isWeakDef(def) {
  const l = def.toLowerCase()
  return (
    /^surname\b/.test(l) ||
    l.includes('abbr. for') ||
    l.includes('kangxi radical') ||
    l.startsWith('variant of') ||
    l.startsWith('old variant') ||
    l.startsWith('japanese variant') ||
    l.startsWith('see also') ||
    l.startsWith('see ') ||
    l.includes('sentence-final particle') ||
    l.includes('(archaic)') ||
    l.startsWith('used in ')
  )
}

function isSoftWeakDef(def) {
  const l = def.toLowerCase()
  return l.includes('(literary)') || l.includes('(bound form)') || /\bparticle\b/.test(l)
}

function loadCedict() {
  const raw = new Map()
  let maxLen = 1
  const text = fs.readFileSync(CEDICT_PATH, 'utf8')
  for (const line of text.split(/\n/)) {
    if (!line || line.startsWith('#')) continue
    const m = line.match(/^(\S+)\s+(\S+)\s+\[[^\]]*]\s+\/(.+)\/\s*$/)
    if (!m) continue
    const [, trad, simp, defsRaw] = m
    const defs = defsRaw.split('/').map((d) => d.trim()).filter(Boolean)
    for (const key of [simp, trad]) {
      if (!HAS_CJK.test(key)) continue
      if (!raw.has(key)) raw.set(key, [])
      raw.get(key).push(...defs)
      if (key.length > maxLen) maxLen = key.length
    }
  }

  const map = new Map()
  const soft = new Set()
  for (const [key, defs] of raw) {
    const meaning = pickMeaning(defs)
    if (!meaning) continue
    map.set(key, meaning)
    const usable = defs.filter((d) => !isWeakDef(d))
    if (usable.length && usable.every(isSoftWeakDef)) soft.add(key)
  }
  return { map, soft, maxLen }
}

function pickMeaning(defs) {
  const strong = []
  const soft = []
  for (const def of defs) {
    if (isWeakDef(def)) continue
    const cleaned = def
      .replace(/^\((?:literary|bound form)\)\s*/i, '')
      .replace(/\s*\(.*?bound form.*?\)/gi, '')
      .replace(/\s*CL:[^/]*/g, '')
      .replace(/\s*\|\s*/g, ', ')
      .replace(/\s+/g, ' ')
      .trim()
    if (!cleaned) continue
    const first = cleaned.split(';')[0].trim()
    if (!first) continue
    if (isSoftWeakDef(def)) soft.push(first)
    else strong.push(first)
  }
  return strong[0] || soft[0] || ''
}

function stripCnPos(s) {
  let pos = ''
  let rest = s.trim()
  const latin = rest.match(POS_RE)
  if (latin) {
    pos = latin[0].trim()
    if (!pos.endsWith('.')) pos += '.'
    rest = rest.slice(latin[0].length)
  } else {
    for (const [cn, en] of CN_POS) {
      if (rest.startsWith(cn)) {
        pos = en
        rest = rest.slice(cn.length).replace(/^[:：\s]+/, '')
        break
      }
    }
  }
  return { pos, rest: rest.trim() }
}

function longestMatch(s, i, dict) {
  const max = Math.min(dict.maxLen, s.length - i)
  for (let len = max; len >= 1; len--) {
    const sub = s.slice(i, i + len)
    if (!dict.map.has(sub)) continue
    if (len === 1 && dict.soft.has(sub)) {
      const next = longestContent(s, i + 1, dict)
      if (next && next.length >= 2) continue
    }
    return sub
  }
  return ''
}

function longestContent(s, i, dict) {
  while (i < s.length && !HAS_CJK.test(s[i])) i++
  if (i >= s.length) return ''
  const max = Math.min(dict.maxLen, s.length - i)
  for (let len = max; len >= 2; len--) {
    const sub = s.slice(i, i + len)
    if (dict.map.has(sub) && !dict.soft.has(sub)) return sub
  }
  return ''
}

function translateText(raw, dict) {
  if (!raw || typeof raw !== 'string') return raw
  const trimmed = raw.replace(/\s+/g, ' ').trim()
  if (!trimmed) return trimmed
  if (!HAS_CJK.test(trimmed)) return trimmed

  const { pos, rest } = stripCnPos(trimmed)
  const chunks = rest
    .split(/[；;，,、\/|]+/)
    .map((c) => c.trim())
    .filter(Boolean)
  const parts = []
  const seen = new Set()
  for (const chunk of chunks) {
    const translated = translateChunk(chunk, dict)
    if (!translated) continue
    const key = translated.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    parts.push(translated)
  }
  const joined = parts.join(', ')
  if (!joined) return pos || trimmed
  return pos ? `${pos} ${joined}` : joined
}

function translateChunk(chunk, dict) {
  let s = chunk
    .replace(/[…]+/g, ' ')
    .replace(/\.{3,}/g, ' ')
    .replace(/[【\[]/g, ' (')
    .replace(/[】\]]/g, ') ')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/\s+/g, ' ')
    .trim()

  if (/[的地]$/.test(s) && s.length > 1) {
    const stem = translateChunk(s.slice(0, -1), dict)
    if (stem && !HAS_CJK.test(stem)) return stem
  }

  const out = []
  let i = 0
  let hadContent = false
  while (i < s.length) {
    const ch = s[i]
    if (/\s/.test(ch) || '()'.includes(ch)) {
      i++
      continue
    }
    if (/[A-Za-z]/.test(ch)) {
      let j = i + 1
      while (j < s.length && /[A-Za-z0-9.'-]/.test(s[j])) j++
      out.push(s.slice(i, j))
      hadContent = true
      i = j
      continue
    }
    if (/[0-9]/.test(ch)) {
      let j = i + 1
      while (j < s.length && /[0-9.]/.test(s[j])) j++
      out.push(s.slice(i, j))
      i = j
      continue
    }
    if (!HAS_CJK.test(ch)) {
      i++
      continue
    }

    const matched = longestMatch(s, i, dict)
    if (!matched) {
      i++
      continue
    }
    if (SKIP_WORDS.has(matched) && hadContent) {
      i += matched.length
      continue
    }
    if (matched.length === 1 && SKIP_CHARS.has(matched)) {
      i += matched.length
      continue
    }

    out.push(dict.map.get(matched))
    hadContent = true
    i += matched.length
  }

  return out.join(' ').replace(/\s+/g, ' ').trim()
}

function stripLeftoverCjk(s) {
  if (typeof s !== 'string') return s
  if (!HAS_CJK.test(s)) return s
  const cleaned = s
    .replace(/[\u3400-\u9FFF]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s([,;:])/g, '$1')
    .trim()
  return cleaned
}

function englishDictFiles() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'resources', 'dictionary.ts'), 'utf8')
  const files = []
  for (const block of src.split('{').slice(1)) {
    const url = block.match(/url:\s*'([^']+)'/)
    const cat = block.match(/languageCategory:\s*'([^']+)'/)
    if (url && cat && cat[1] === 'en') files.push(path.basename(url[1]))
  }
  return [...new Set(files)]
}

function main() {
  if (!fs.existsSync(CEDICT_PATH)) {
    console.error('Missing', CEDICT_PATH)
    process.exit(1)
  }
  console.log('Loading CEDICT...')
  const dict = loadCedict()
  console.log('CEDICT entries:', dict.map.size, 'maxLen', dict.maxLen)

  const preview = [
    '取消， 撤销； 删去',
    '爆炸的； 极易引起争论的',
    '炸药',
    '众多的',
    '居支配地位， 占优势',
    '把…隐藏起来， 掩盖， 隐瞒',
    'n. 传记',
    'adj. 年老的；…岁的',
    '统治，治理，支配',
  ]
  for (const p of preview) console.log(' ', p, '=>', translateText(p, dict))

  const files = englishDictFiles()
  let changedFiles = 0
  let changedWords = 0
  let leftover = 0
  const cache = new Map()

  for (const file of files) {
    const fp = path.join(DICT_DIR, file)
    if (!fs.existsSync(fp)) {
      console.warn('missing', file)
      continue
    }
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
    if (!Array.isArray(data)) continue
    let fileChanged = false
    for (const word of data) {
      const trans = Array.isArray(word.trans) ? word.trans : word.trans == null ? [] : [word.trans]
      const next = trans
        .map((item) => {
          if (typeof item !== 'string') return item
          if (cache.has(item)) {
            const cached = cache.get(item)
            return cached || String(word.name || '')
          }
          let translated = stripLeftoverCjk(translateText(item, dict))
          cache.set(item, translated)
          return translated || String(word.name || '')
        })
        .filter((item, idx, arr) => typeof item !== 'string' || arr.findIndex((x) => x === item) === idx)
      if (next.some((item) => typeof item === 'string' && HAS_CJK.test(item))) leftover++
      if (JSON.stringify(next) !== JSON.stringify(trans)) {
        word.trans = next
        fileChanged = true
        changedWords++
      }
    }
    if (fileChanged) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 4) + '\n')
      changedFiles++
      console.log('updated', file)
    }
  }

  console.log(JSON.stringify({ changedFiles, changedWords, leftover, cached: cache.size }, null, 2))
}

main()
