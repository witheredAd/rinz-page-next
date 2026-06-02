import { existsSync, readdirSync } from 'fs'
import { extname, join } from 'path'

interface NoteInfo {
  folder: string
  file: string
}

interface Options {
  /** Path to public images directory. Default: 'public/images' (resolved from cwd) */
  publicImagesDir?: string
  /** Path to notes directory. Default: 'src/notes' (resolved from cwd) */
  notesDir?: string
  /** URL prefix for images. Default: '/images' */
  imageUrlPrefix?: string
  /** URL prefix for notes. Default: '/notes' */
  noteUrlPrefix?: string
}

export default function remarkWikiImage(options: Options = {}) {
  const cwd = process.cwd()
  const {
    publicImagesDir = join(cwd, 'public/images'),
    notesDir = join(cwd, 'src/notes'),
    imageUrlPrefix = '/images',
    noteUrlPrefix = '/notes',
  } = options

  // --- Build image set ---
  const imageFiles = new Set<string>()
  if (existsSync(publicImagesDir)) {
    for (const file of readdirSync(publicImagesDir)) {
      imageFiles.add(file)
    }
  }

  // --- Build note map ---
  // Priority: no-ext > .md > .mdx
  // Process lowest priority first so higher overwrites
  const noteMap = new Map<string, NoteInfo>()
  if (existsSync(notesDir)) {
    const subDirs = readdirSync(notesDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)

    for (const dir of subDirs) {
      const dirPath = join(notesDir, dir)
      let files: string[]
      try {
        files = readdirSync(dirPath)
      } catch {
        continue
      }

      files.filter(f => f.endsWith('.mdx')).forEach(file => {
        const noteName = file.slice(0, -4)
        noteMap.set(noteName, { folder: dir, file })
      })

      files.filter(f => f.endsWith('.md')).forEach(file => {
        const noteName = file.slice(0, -3)
        noteMap.set(noteName, { folder: dir, file })
      })

      files.forEach(file => {
        noteMap.set(file, { folder: dir, file })
      })
    }
  }

  // --- Transform ---
  return (tree: any) => {
    walk(tree)
  }

  function walk(parent: { children?: any[] }) {
    if (!parent.children) return
    // Walk right-to-left so splice indices remain valid
    for (let i = parent.children.length - 1; i >= 0; i--) {
      const child = parent.children[i]
      if (child.type === 'text') {
        const newNodes = processTextNode(child.value)
        if (newNodes) {
          parent.children.splice(i, 1, ...newNodes)
        }
      }
      if (child.children) {
        walk(child)
      }
    }
  }

  function processTextNode(value: string): any[] | null {
    const localRegex = /!\[\[([^\]]+)\]\]/g
    const matches = Array.from(value.matchAll(localRegex))
    if (matches.length === 0) return null

    const newNodes: any[] = []
    let lastIndex = 0

    for (const match of matches) {
      // Text before this match
      if (match.index! > lastIndex) {
        newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) })
      }

      const filename = match[1].trim()

      if (imageFiles.has(filename)) {
        newNodes.push({
          type: 'image',
          url: `${imageUrlPrefix}/${filename}`,
          title: null,
          alt: filename,
        })
      } else {
        const ext = extname(filename)
        const baseName = ext ? filename.slice(0, -ext.length) : filename
        const noteInfo = noteMap.get(baseName)

        if (noteInfo) {
          newNodes.push({
            type: 'link',
            url: `${noteUrlPrefix}/${noteInfo.folder}/${noteInfo.file}`,
            title: null,
            children: [{ type: 'text', value: noteInfo.file }],
          })
        } else {
          // Not found — keep original text
          newNodes.push({ type: 'text', value: match[0] })
        }
      }

      lastIndex = match.index! + match[0].length
    }

    // Remaining text after last match
    if (lastIndex < value.length) {
      newNodes.push({ type: 'text', value: value.slice(lastIndex) })
    }

    return newNodes
  }
}
