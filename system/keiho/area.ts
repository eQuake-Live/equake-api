// 気象庁のエリアコード

interface Classns {
  [code: string]: {
    name: string
  }
}
interface APIResponse {
  offices: {
    [officeCode: string]: {
      /**
       * 都道府県名
       */
      name: string

      children: string[]
    }
  }
  class10s: Classns
  class15s: Classns
  class20s: Classns
}

interface AreaCodes {
  [code: string]: string
}
let cachedAreaCodes: AreaCodes | null = null

export const getAreaCodes = async (): Promise<AreaCodes> => {
  if (cachedAreaCodes) {
    return cachedAreaCodes
  }

  const json: APIResponse = await fetch('https://www.jma.go.jp/bosai/common/const/area.json').then((res) => res.json())
  
  const result: AreaCodes = {}
  const classnsMerged = {
    ...json.class10s,
    ...json.class15s,
    ...json.class20s,
  }
  for (const office of Object.values(json.offices)) {
    for (const code of office.children) {
      result[code] = office.name + classnsMerged[code].name
    }
  }

  cachedAreaCodes = result

  return result
}
