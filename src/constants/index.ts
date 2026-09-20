export const SITE = {
  name: 'Type to Learn',
  author: 'Kazim Kayhan',
  github: 'https://github.com/kazimkayhan/type-to-learn',
  website: 'https://kazimjan.com',
  email: 'email4kazim@gmail.com',
  url: 'https://kazimkayhan.github.io/type-to-learn/',
  avatar: 'https://avatars.githubusercontent.com/u/70243719?v=4',
  dictGuide: 'https://github.com/kazimkayhan/type-to-learn/blob/master/docs/toBuildDict.md',
} as const

export const EXPLICIT_SPACE = '␣'

export const CHAPTER_LENGTH = 20

export const DISMISS_START_CARD_DATE_KEY = 'dismissStartCardDate'

export const DONATE_DATE = 'donateDate'

export const CONFETTI_DEFAULTS = {
  colors: ['#5D8C7B', '#F2D091', '#F2A679', '#D9695F', '#8C4646'],
  shapes: ['square'],
  ticks: 500,
} as confetti.Options

export const defaultFontSizeConfig = {
  foreignFont: 48,
  translateFont: 18,
}
