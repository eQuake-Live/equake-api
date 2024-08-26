/**
 * Real time sindo
 * @module
 */
import { getImage } from './get-image.ts'
import { parseSindo, Sindo } from './parse-sindo.ts'

interface CachedImages {
  sindo?: {
    time: number
    data: SindoData
  }
}

interface SindoData {
  sindo: Sindo[]
  usedTime: string
}

export class RealTimeSindo {
  constructor() {
    this.#cached = {}
  }

  #cached: CachedImages

  async getSindo(): Promise<SindoData | null> {
    const now = new Date().getTime()
    if (this.#cached.sindo && this.#cached.sindo.time + 1000 > now) {
      return this.#cached.sindo.data
    }
    const gotImage = await getImage()
    if (!gotImage) {
      return null
    }
    const data: SindoData = {
      usedTime: gotImage.usedTime.toString(),
      sindo: await parseSindo(gotImage.image)
    }
    this.#cached.sindo = {
      time: now,
      data
    }
    return data
  }
}
