/**
 * boardGeometry.ts
 * Pure geometry utilities for the Snake & Ladder board.
 */

export interface ContainRect {
  left:   number
  top:    number
  width:  number
  height: number
}

/**
 * Compute the actual rendered rect of an <img objectFit="contain">
 * inside a box of (boxW × boxH), given the image's natural dimensions.
 *
 * Returns the pixel offset and size of the image within the box,
 * accounting for letterboxing on either axis.
 */
export function getContainRect(
  boxW: number,
  boxH: number,
  natW: number,
  natH: number,
): ContainRect {
  const scale  = Math.min(boxW / natW, boxH / natH)
  const width  = natW * scale
  const height = natH * scale
  const left   = (boxW - width)  / 2
  const top    = (boxH - height) / 2
  return { left, top, width, height }
}
