import { createCanvas, loadImage } from '@josefabio/deno-canvas'
import positions from 'https://raw.githubusercontent.com/eQuake-Live/kmoni-positions/main/positions.json' with {
  type: 'json',
}
import { getPixelFromImageData } from '../../utils/image.ts'
import { rgbToHSL } from '@omega/color'

const MIN_SINDO_H = 240

const CHINAI_KISHODAI = {
  n: 45.415,
  e: 141.666,

  x: 266,
  y: 21,
}
const AMAMI_KANSOKU: typeof CHINAI_KISHODAI = {
  n: 26.8717,
  e: 128.2656,

  x: 117,
  y: 130,
}
export interface Sindo {
  /**
   * 東経
   */
  E: number
  /**
   * 北緯
   */
  N: number

  /**
   * 震度
   */
  sindo: number
}
const PIXEL_BY_POS = 24.4821092279

export const parseSindo = async (image: Uint8Array): Promise<Sindo[]> => {
  const loadedImage = await loadImage(image)
  const canvas = createCanvas(loadedImage.width(), loadedImage.height())
  const ctx = canvas.getContext('2d')
  ctx.drawImage(loadedImage, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const { width, height } = canvas

  const result: Sindo[] = []

  positions.sort((a, b) => a[1] - b[1])

  for (const [x, y] of positions) {
    const [r, g, b] = getPixelFromImageData(imageData as ImageData, x, y)
    if (r + g + b === 0) {
      continue
    }
    const [h] = rgbToHSL([r, g, b])

    const sindo = (1 - (h / MIN_SINDO_H)) * 10 - 3

    // 沖縄は別世界らしいです
    const BASE_POS = (166 > x && 198 > y) ? AMAMI_KANSOKU : CHINAI_KISHODAI

    const n = BASE_POS.n - ((y - BASE_POS.y) / PIXEL_BY_POS)
    const e = BASE_POS.e - ((x - BASE_POS.x) / PIXEL_BY_POS)

    result.push({
      sindo,
      N: n,
      E: e,
    })
  }
  return result
}
