/**
 * 警報取得
 * @module
 */
import { getMap, getSimilarCodes, WarningCode } from './map.ts'
import { codeToWarningName } from './map.ts'
import { getAreaCodes } from './area.ts'

interface Area {
  /**
   * 気象庁の提供する場所の識別コード
   */
  code: string
  /**
   * 場所の名前
   */
  name: string
}

type Warnings = {
  [K in `${WarningCode}`]: {
    name: string
    areas: Area[]
  }
}

interface Result {
  reportDatetime: string
  /**
   * 現在出ている警報一覧
   */
  warnings: Warnings
}

export class KeihoService {
  constructor() {}
  async getKeiho(): Promise<Result> {
    const map = await getMap()
    const warningCodes: `${WarningCode}`[] = Object.values(WarningCode)
      // @ts-expect-error わかんない
      .filter((code): code is `${WarningCode}` => !Number.isNaN(parseInt(code)))

    const warnings: Record<`${WarningCode}`, Set<string>> = Object.fromEntries(
      warningCodes.map((code) => [code, new Set<string>()] as const) as [
        `${WarningCode}`,
        Set<string>,
      ][],
    ) as Record<`${WarningCode}`, Set<string>>

    for (const report of map.toReversed()) {
      for (const areaType of report.areaTypes) {
        for (const area of areaType.areas) {
          for (const warning of area.warnings) {
            if (warning.status === '発表警報・注意報はなし') {
              continue
            }
            for (const targetCode of getSimilarCodes(warning.code)) {
              switch (warning.status) {
                case '発表':
                case '継続':
                  warnings[targetCode].add(area.code)
                  break
                case '解除':
                  warnings[targetCode].delete(area.code)
              }
            }
          }
        }
      }
    }

    const areaCodes = await this.getAreaCodes()

    const resultWarnings: Warnings = Object.fromEntries(
      Object.entries(warnings)
        .map((
          [code, areas],
        ) => [code, {
          name: codeToWarningName(code as `${WarningCode}`),
          areas: [...areas].map((code) => ({
            name: areaCodes[code],
            code,
          })).filter(area => area.name),
        }]),
    ) as Warnings

    return {
      reportDatetime: map[0].reportDatetime,
      warnings: resultWarnings,
    }
  }

  getAreaCodes() {
    return getAreaCodes()
  }
}
