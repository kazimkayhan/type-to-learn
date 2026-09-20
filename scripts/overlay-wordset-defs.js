/**
 * Overlay Wordset English definitions onto English dictionary JSON files.
 * Phrases and missing headwords keep the existing (CEDICT) English gloss.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const CACHE = path.join(__dirname, '.cache')
const DICT_DIR = path.join(ROOT, 'public', 'dicts')
const POS = {
  noun: 'n.',
  verb: 'v.',
  adjective: 'adj.',
  adverb: 'adv.',
  preposition: 'prep.',
  conjunction: 'conj.',
  pronoun: 'pron.',
  interjection: 'int.',
}

function loadWordset() {
  const map = new Map()
  for (const file of fs.readdirSync(CACHE).filter((f) => f.startsWith('wordset-') && f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(CACHE, file), 'utf8'))
    for (const [word, entry] of Object.entries(data)) {
      const defs = meaningsToTrans(entry)
      if (defs.length) map.set(word.toLowerCase(), defs)
    }
  }
  return map
}

function meaningsToTrans(entry) {
  if (!entry || !Array.isArray(entry.meanings)) return []
  const rank = { verb: 0, adjective: 1, adverb: 2, noun: 3 }
  const meanings = [...entry.meanings].sort(
    (a, b) => (rank[a.speech_part] ?? 9) - (rank[b.speech_part] ?? 9),
  )
  const seen = new Set()
  const out = []
  for (const meaning of meanings) {
    const def = String(meaning.def || '')
      .replace(/\s+/g, ' ')
      .trim()
    if (!def) continue
    const key = def.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const pos = POS[meaning.speech_part] || ''
    out.push(pos ? `${pos} ${def}` : def)
    if (out.length >= 3) break
  }
  return out
}

function lookup(name, map, tried = new Set()) {
  const n = String(name || '')
    .toLowerCase()
    .trim()
  if (!n || tried.has(n)) return null
  tried.add(n)
  if (map.has(n)) return map.get(n)
  if (n.includes(' ') || /[^a-z'-]/.test(n)) return null
  if (n.endsWith("'s")) return lookup(n.slice(0, -2), map, tried)
  if (n.endsWith('ies') && n.length > 5) return lookup(`${n.slice(0, -3)}y`, map, tried)
  if (n.endsWith('ing') && n.length > 6) {
    return lookup(n.slice(0, -3), map, tried) || lookup(`${n.slice(0, -3)}e`, map, tried)
  }
  if (n.endsWith('ed') && n.length > 5) {
    return lookup(n.slice(0, -2), map, tried) || lookup(n.slice(0, -1), map, tried)
  }
  if (n.endsWith('es') && n.length > 5) return lookup(n.slice(0, -2), map, tried)
  if (n.endsWith('s') && n.length > 4) return lookup(n.slice(0, -1), map, tried)
  return null
}

function polish(trans) {
  return trans.map((item) =>
    typeof item === 'string' ? item.replace(/\bto to\b/g, 'to').replace(/\s+/g, ' ').trim() : item,
  )
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
  console.log('Loading Wordset...')
  const wordset = loadWordset()
  console.log('Wordset entries:', wordset.size)
  for (const sample of ['cancel', 'explosive', 'discourage', 'resemble', 'govern']) {
    console.log(' ', sample, '=>', lookup(sample, wordset))
  }

  let overlayed = 0
  let kept = 0
  let filesChanged = 0
  for (const file of englishDictFiles()) {
    const fp = path.join(DICT_DIR, file)
    if (!fs.existsSync(fp)) continue
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'))
    if (!Array.isArray(data)) continue
    let changed = false
    for (const word of data) {
      const defs = lookup(word.name, wordset)
      if (defs) {
        if (JSON.stringify(word.trans) !== JSON.stringify(defs)) {
          word.trans = defs
          changed = true
        }
        overlayed++
      } else {
        const next = polish(Array.isArray(word.trans) ? word.trans : [])
        if (JSON.stringify(next) !== JSON.stringify(word.trans)) {
          word.trans = next
          changed = true
        }
        kept++
      }
    }
    if (changed) {
      fs.writeFileSync(fp, JSON.stringify(data, null, 4) + '\n')
      filesChanged++
      console.log('updated', file)
    }
  }
  console.log(JSON.stringify({ filesChanged, overlayed, kept }, null, 2))
}

main()
