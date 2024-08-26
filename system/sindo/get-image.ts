import { getJST, hhmmss, yyyymmdd } from '../../utils/date.ts'

/**
 * Get kmoni image
 *
 * 誤差を想定し、常に最新の画像を取得できるようにする
 */
export const getImage = async (): Promise<null | Uint8Array> => {
  const now = getJST().getTime()

  const times: Date[] = []
  for (let i = -3; i < 1; i++) {
    times.push(new Date(now + i * 1000))
  }

  const urls = times.map((time) =>
    `http://www.kmoni.bosai.go.jp/data/map_img/RealTimeImg/jma_s/${
      yyyymmdd(time)
    }/${yyyymmdd(time)}${hhmmss(time)}.jma_s.gif`
  )

  const latestResponse = (await Promise.all(urls.map(async (url) => {
    return await fetch(url)
  }))).filter((res) => res.ok).at(-1)

  if (!latestResponse) {
    return null
  }
  return new Uint8Array(await latestResponse.arrayBuffer())
}
