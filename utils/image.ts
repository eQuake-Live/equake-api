export const getPixelFromImageData = (
  imageData: ImageData,
  x: number,
  y: number,
): [number, number, number, number] => {
  const { width, data } = imageData
  const index = (y * width + x) * 4
  const r = data[index]
  const g = data[index + 1]
  const b = data[index + 2]
  const a = data[index + 3]

  return [r, g, b, a]
}
