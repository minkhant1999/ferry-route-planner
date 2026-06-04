import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff'])
const INPUT_DIR = process.argv[2] ?? 'public/images'
const OUTPUT_DIR = process.argv[3] ?? 'public/images/optimized'
const MAX_WIDTH = 1920

async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectImages(fullPath)))
      continue
    }
    if (IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }

  return files
}

async function optimizeImage(inputPath) {
  const relativePath = inputPath.replace(`${INPUT_DIR}/`, '')
  const outputPath = join(OUTPUT_DIR, relativePath.replace(/\.[^.]+$/, '.webp'))

  await sharp(inputPath)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outputPath)

  const [inputStats, outputStats] = await Promise.all([stat(inputPath), stat(outputPath)])
  const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1)

  console.log(`Optimized ${relativePath} -> ${outputPath} (${savings}% smaller)`)
}

async function main() {
  try {
    await stat(INPUT_DIR)
  } catch {
    console.log(`No images directory at "${INPUT_DIR}". Skipping optimization.`)
    return
  }

  const images = await collectImages(INPUT_DIR)
  if (images.length === 0) {
    console.log(`No images found in "${INPUT_DIR}".`)
    return
  }

  await Promise.all(images.map(optimizeImage))
  console.log(`Optimized ${images.length} image(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
