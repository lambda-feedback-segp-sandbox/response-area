import { CanvasPath, Point } from 'react-sketch-canvas'

export const getInlineOffsetAndScale = (
  strokes: CanvasPath[],
  inlineCanvasWidth: number,
  inlineCanvasHeight: number,
): { scale: number; offset: Point } => {
  const coords = strokes.map(stroke => stroke.paths).flat()
  const x = coords.map(coord => coord.x)
  const y = coords.map(coord => coord.y)

  const lower = { x: Math.min(...x), y: Math.min(...y) }
  const upper = { x: Math.max(...x), y: Math.max(...y) }

  const boundingBoxWidth = upper.x - lower.x
  const boundingBoxHeight = upper.y - lower.y

  const widthScale = inlineCanvasWidth / boundingBoxWidth
  const heightScale = inlineCanvasHeight / boundingBoxHeight
  const minScale = Math.min(widthScale, heightScale, 1) * 0.75

  const heightGap =
    inlineCanvasHeight / minScale - inlineCanvasHeight / heightScale

  return {
    scale: minScale,
    offset: {
      x: lower.x - heightGap / 2,
      y: lower.y - heightGap / 2,
    },
  }
}

export const transformStrokes = (
  strokes: CanvasPath[],
  scale: number,
  bounds?: Point,
): CanvasPath[] => {
  return strokes.map(stroke => {
    return {
      ...stroke,
      strokeWidth: stroke?.strokeWidth * scale,
      paths: stroke.paths.map(({ x, y }) => {
        return {
          x: (x - (bounds?.x ?? 0)) * scale,
          y: (y - (bounds?.y ?? 0)) * scale,
        }
      }),
    }
  })
}

export const unTransformStrokes = (
  strokes: CanvasPath[],
  scale: number,
  bounds?: Point,
): CanvasPath[] => {
  return strokes.map(stroke => {
    return {
      ...stroke,
      strokeWidth: stroke?.strokeWidth / scale,
      paths: stroke.paths.map(({ x, y }) => {
        return {
          x: x / scale + (bounds?.x ?? 0),
          y: y / scale + (bounds?.y ?? 0),
        }
      }),
    }
  })
}
