# eQuake-API

強震モニタから情報を抽出する API サーバーです。

## 環境

- Deno | https://deno.com がインストールされていること

## コマンド

- 開発モード: `deno task dev`
- スタート: `deno task start`

## ドキュメント

### GET `/sindo`

リアルタイムの深度を取得します。 結果:

```ts
interface Sindo {
  /**
   * 北緯
   */
  N: number
  /**
   * 東経
   */
  S: number

  /**
   * 計測震度 (min: -3, max: 7)
   */
  sindo: number
}
interface Result {
  sindo: Sindo[]
  usedTime: string
}
```
