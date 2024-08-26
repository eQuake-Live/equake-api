/**
 * Real time sindo
 * @module
 */
import { getImage } from './get-image.ts'
import { parseSindo, Sindo } from './parse-sindo.ts'

interface CachedImages {
  sindo?: {
    image: Uint8Array
    time: number
    data: Sindo[]
  }
}

export class RealTimeSindo {
  constructor() {
    this.#cached = {}
  }

  #cached: CachedImages

  async getSindo(): Promise<Sindo[]> {
    const now = new Date().getTime()
    if (this.#cached.sindo && this.#cached.sindo.time + 1000 > now) {
      return this.#cached.sindo.data
    }
    const image = await getImage()
    if (!image) {
      return []
    }
    this.#cached.sindo = {
      image,
      time: now,
      data: await parseSindo(image),
    }
    return this.#cached.sindo.data
  }
}
