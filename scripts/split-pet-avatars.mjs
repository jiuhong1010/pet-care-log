import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { deflateSync, inflateSync } from 'node:zlib'

const sourcePath = new URL('../src/assets/generated/pet-avatar-sprite-v2.png', import.meta.url)
const outputDir = new URL('../src/assets/generated/pet-avatars-v3/', import.meta.url)
const names = [
  'orange-cat',
  'silver-cat',
  'black-cat',
  'golden-retriever',
  'shiba-inu',
  'white-poodle',
  'lop-rabbit',
  'hamster',
  'green-parrot',
  'turtle',
]

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
}

function decodePng(buffer) {
  const signature = buffer.subarray(0, 8).toString('hex')
  if (signature !== '89504e470d0a1a0a') throw new Error('Unsupported PNG signature')

  let width = 0
  let height = 0
  const idat = []
  for (let offset = 8; offset < buffer.length; ) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii')
    const data = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      if (data[8] !== 8 || data[9] !== 6 || data[12] !== 0) {
        throw new Error('Expected 8-bit, non-interlaced RGBA PNG')
      }
    } else if (type === 'IDAT') {
      idat.push(data)
    }
    offset += length + 12
  }

  const bytesPerPixel = 4
  const rowLength = width * bytesPerPixel
  const raw = inflateSync(Buffer.concat(idat))
  const pixels = Buffer.alloc(width * height * bytesPerPixel)

  let rawOffset = 0
  for (let y = 0; y < height; y += 1) {
    const filter = raw[rawOffset]
    rawOffset += 1
    const rowOffset = y * rowLength
    const previousOffset = (y - 1) * rowLength
    for (let x = 0; x < rowLength; x += 1) {
      const value = raw[rawOffset + x]
      const left = x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0
      const up = y > 0 ? pixels[previousOffset + x] : 0
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[previousOffset + x - bytesPerPixel] : 0
      let decoded = value
      if (filter === 1) decoded = value + left
      else if (filter === 2) decoded = value + up
      else if (filter === 3) decoded = value + Math.floor((left + up) / 2)
      else if (filter === 4) decoded = value + paeth(left, up, upLeft)
      else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}`)
      pixels[rowOffset + x] = decoded & 0xff
    }
    rawOffset += rowLength
  }

  return { width, height, pixels }
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type)
  const chunk = Buffer.alloc(data.length + 12)
  chunk.writeUInt32BE(data.length, 0)
  typeBuffer.copy(chunk, 4)
  data.copy(chunk, 8)
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), data.length + 8)
  return chunk
}

function encodePng(width, height, pixels) {
  const signature = Buffer.from('89504e470d0a1a0a', 'hex')
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const scanlines = Buffer.alloc(height * (width * 4 + 1))
  for (let y = 0; y < height; y += 1) {
    const destination = y * (width * 4 + 1)
    scanlines[destination] = 0
    pixels.copy(scanlines, destination + 1, y * width * 4, (y + 1) * width * 4)
  }
  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(scanlines, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

function findLargestComponent(image, bounds) {
  const { width, height, pixels } = image
  const alphaThreshold = 24
  const regionWidth = bounds.maxX - bounds.minX + 1
  const regionHeight = bounds.maxY - bounds.minY + 1
  const visited = new Uint8Array(regionWidth * regionHeight)
  const queue = new Int32Array(regionWidth * regionHeight)
  let best = null

  for (let localStart = 0; localStart < visited.length; localStart += 1) {
    const startX = bounds.minX + (localStart % regionWidth)
    const startY = bounds.minY + Math.floor(localStart / regionWidth)
    const start = startY * width + startX
    if (visited[localStart] || pixels[start * 4 + 3] <= alphaThreshold) continue
    let head = 0
    let tail = 0
    let count = 0
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0
    queue[tail++] = localStart
    visited[localStart] = 1

    while (head < tail) {
      const localIndex = queue[head++]
      const x = bounds.minX + (localIndex % regionWidth)
      const y = bounds.minY + Math.floor(localIndex / regionWidth)
      count += 1
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)

      for (let dy = -1; dy <= 1; dy += 1) {
        const ny = y + dy
        if (ny < bounds.minY || ny > bounds.maxY || ny < 0 || ny >= height) continue
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue
          const nx = x + dx
          if (nx < bounds.minX || nx > bounds.maxX || nx < 0 || nx >= width) continue
          const neighborLocal = (ny - bounds.minY) * regionWidth + (nx - bounds.minX)
          const neighbor = ny * width + nx
          if (!visited[neighborLocal] && pixels[neighbor * 4 + 3] > alphaThreshold) {
            visited[neighborLocal] = 1
            queue[tail++] = neighborLocal
          }
        }
      }
    }

    if (!best || count > best.count) {
      const mask = new Uint8Array(width * height)
      for (let index = 0; index < tail; index += 1) {
        const localIndex = queue[index]
        const x = bounds.minX + (localIndex % regionWidth)
        const y = bounds.minY + Math.floor(localIndex / regionWidth)
        mask[y * width + x] = 1
      }
      best = { count, minX, minY, maxX, maxY, mask }
    }
  }

  if (!best || best.count < 2500) throw new Error('No pet component found in expected region')
  return best
}

function findPetComponents(image) {
  const cellWidth = image.width / 5
  const cellHeight = image.height / 2
  const horizontalExpansion = 24
  const pets = []
  for (let index = 0; index < names.length; index += 1) {
    const column = index % 5
    const row = Math.floor(index / 5)
    pets.push(
      findLargestComponent(image, {
        minX: Math.max(0, column * cellWidth - horizontalExpansion),
        maxX: Math.min(image.width - 1, (column + 1) * cellWidth - 1 + horizontalExpansion),
        minY: row * cellHeight,
        maxY: (row + 1) * cellHeight - 1,
      }),
    )
  }
  return pets
}

function renderPet(image, component) {
  const canvasSize = 256
  const targetHeight = 210
  const baseline = 231
  const sourceWidth = component.maxX - component.minX + 1
  const sourceHeight = component.maxY - component.minY + 1
  const scale = targetHeight / sourceHeight
  const targetWidth = Math.round(sourceWidth * scale)
  const targetTop = baseline - targetHeight
  const targetLeft = Math.round((canvasSize - targetWidth) / 2)
  const output = Buffer.alloc(canvasSize * canvasSize * 4)

  for (let y = 0; y < targetHeight; y += 1) {
    const sourceY = component.minY + (y + 0.5) / scale - 0.5
    const y0 = Math.max(component.minY, Math.floor(sourceY))
    const y1 = Math.min(component.maxY, y0 + 1)
    const fy = sourceY - Math.floor(sourceY)
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = component.minX + (x + 0.5) / scale - 0.5
      const x0 = Math.max(component.minX, Math.floor(sourceX))
      const x1 = Math.min(component.maxX, x0 + 1)
      const fx = sourceX - Math.floor(sourceX)
      const samples = [
        [x0, y0, (1 - fx) * (1 - fy)],
        [x1, y0, fx * (1 - fy)],
        [x0, y1, (1 - fx) * fy],
        [x1, y1, fx * fy],
      ]
      let alpha = 0
      let red = 0
      let green = 0
      let blue = 0
      for (const [sx, sy, weight] of samples) {
        const sourceIndex = sy * image.width + sx
        if (!component.mask[sourceIndex]) continue
        const offset = sourceIndex * 4
        const normalizedAlpha = image.pixels[offset + 3] / 255
        const weightedAlpha = normalizedAlpha * weight
        alpha += weightedAlpha
        red += image.pixels[offset] * weightedAlpha
        green += image.pixels[offset + 1] * weightedAlpha
        blue += image.pixels[offset + 2] * weightedAlpha
      }
      const destinationX = targetLeft + x
      const destinationY = targetTop + y
      if (destinationX < 0 || destinationX >= canvasSize || destinationY < 0 || destinationY >= canvasSize) continue
      const destination = (destinationY * canvasSize + destinationX) * 4
      if (alpha > 0) {
        output[destination] = Math.round(red / alpha)
        output[destination + 1] = Math.round(green / alpha)
        output[destination + 2] = Math.round(blue / alpha)
        output[destination + 3] = Math.round(Math.min(1, alpha) * 255)
      }
    }
  }

  return { output, sourceWidth, sourceHeight, targetWidth, targetHeight }
}

const image = decodePng(readFileSync(sourcePath))
const pets = findPetComponents(image)
mkdirSync(outputDir, { recursive: true })

pets.forEach((component, index) => {
  const rendered = renderPet(image, component)
  const outputPath = join(outputDir.pathname, `${names[index]}.png`)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, encodePng(256, 256, rendered.output))
  console.log(
    `${names[index]}: source ${rendered.sourceWidth}x${rendered.sourceHeight}, ` +
      `target ${rendered.targetWidth}x${rendered.targetHeight}`,
  )
})
