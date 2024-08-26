import { getJST, hhmmss, yyyymmdd } from '../../utils/date.ts'

/**
 * Get kmoni image
 *
 * 誤差を想定し、常に最新の画像を取得できるようにする
 */
export const getImage = async (): Promise<null | {image: Uint8Array, usedTime: Date}> => {
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

  const latestResponse = (await Promise.all(urls.map(async (url, index): Promise<[Response, Date]> => {
    return [await fetch(url), times[index]]
  }))).filter(([res]) => res.ok).at(-1)

  if (!latestResponse) {
    return null
  }
  const [res, time] = latestResponse
  return {
    image: new Uint8Array(await res.arrayBuffer()),
    usedTime: time
  }
}
