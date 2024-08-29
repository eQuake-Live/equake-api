export enum WarningCode {
  '解除' = '00',
  '暴風雪警報' = '02',
  '大雨警報' = '03',
  '洪水警報' = '04',
  '暴風警報' = '05',
  '大雪警報' = '06',
  '波浪警報' = '07',
  '高潮警報' = '08',
  '大雨注意報' = '10',
  '大雪注意報' = '12',
  '風雪注意報' = '13',
  '雷注意報' = '14',
  '強風注意報' = '15',
  '波浪注意報' = '16',
  '融雪注意報' = '17',
  '洪水注意報' = '18',
  '高潮注意報' = '19',
  '濃霧注意報' = '20',
  '乾燥注意報' = '21',
  'なだれ注意報' = '22',
  '低温注意報' = '23',
  '霜注意報' = '24',
  '着氷注意報' = '25',
  '着雪注意報' = '26',
  'その他の注意報' = '27',
  '暴風雪特別警報' = '32',
  '大雨特別警報' = '33',
  '暴風特別警報' = '35',
  '大雪特別警報' = '36',
  '波浪特別警報' = '37',
  '高潮特別警報' = '38',
}

export const codeToWarningName = (code: `${WarningCode}`): string => {
  for (const [key, value] of Object.entries(WarningCode)) {
    if (value === code) {
      return key
    }
  }
  return ''
}

type Warning = {
  status: '発表警報・注意報はなし'
} | {
  /**
   * 警報コード
   */
  code: `${WarningCode}`

  status: '発表' | '解除' | '継続'
}

interface Area {
  /**
   * 気象庁の場所コード
   */
  code: string

  warnings: Warning[]
}
interface AreaType {
  areas: Area[]
}
interface Report {
  reportDatetime: string
  areaTypes: AreaType[]
}
type Map = Report[]

export const getMap = async (): Promise<Map> => {
  const map: Map = await fetch(
    'https://www.jma.go.jp/bosai/warning/data/warning/map.json',
  ).then((res) => res.json())

  return map
}

// 似ている
export const getSimilarCodes = (code: `${WarningCode}`): `${WarningCode}`[] => {
  if (code[0] === '0' || code[0] === '1' || code[0] === '3') {
    const codes = Object.values(WarningCode)
    // 警報、注意報、特別警報
    return [
      `0${code[1]}`,
      `1${code[1]}`,
      `3${code[1]}`,
    ].filter(code => codes.includes(code as WarningCode)) as `${WarningCode}`[]
  }
  return [code]
}