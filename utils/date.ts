/**
 * Date to yyyymmdd
 */
export const yyyymmdd = (date: Date): string =>
  `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${
    date.getDate().toString().padStart(2, '0')
  }`

/**
 * Date to hhmmss
 */
export const hhmmss = (date: Date): string =>
  `${date.getHours().toString().padStart(2, '0')}${
    date.getMinutes().toString().padStart(2, '0')
  }${date.getSeconds().toString().padStart(2, '0')}`

const getJSTOptions: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
}
const jstFormatter = new Intl.DateTimeFormat('en-US', getJSTOptions)

/**
 * Get JST
 */
export const getJST = (): Date => new Date(jstFormatter.format(new Date()))
