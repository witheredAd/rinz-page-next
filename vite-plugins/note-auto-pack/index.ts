import { readdirSync, statSync } from 'fs'
import path from 'path'
import { readSync } from 'to-vfile'
import { matter } from 'vfile-matter'
import moment from 'moment'

const pwd = process.cwd()
const noteDir = `${pwd}/src/notes/`

type TNoteMetadata = {
  path: string,
  meta: {
    title?: string,
    desc?: string,
    date?: string,
    specTag?: string,
  }
}

type TNoteMap = {
  [key: string]: TNoteMetadata[]
}

export default function NotePackPlugin() {
  const virtualModuleId = 'virtual:note-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let noteMap: TNoteMap = {}

  return {
    name: 'rollup-plugin-rinz-note-pack',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    buildStart() {
      const newNoteMap: TNoteMap = {}
      const subDirs = readdirSync(noteDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

      for (const dir of subDirs) {
        const subDirPath = path.join(noteDir, dir)
        const notesInDir = readdirSync(subDirPath)
          .filter(filename => filename.endsWith('.mdx') || filename.endsWith('.md'))
          .map(filename => ({
            name: filename,
            time: statSync(path.join(subDirPath, filename)).mtime.getTime(),
          }))
          .sort((a, b) => b.time - a.time)
          .map(file => {
            const relativePath = path.join(dir, file.name)
            const vfile = readSync(path.join(noteDir, relativePath))
            matter(vfile)
            const vfileMatterData = vfile.data.matter as TNoteMetadata['meta']
            if (!vfileMatterData.title) {
              vfileMatterData.title = file.name.replace(/\.(mdx|md)?$/, '')
            }
            if (!vfileMatterData.desc) {
              vfileMatterData.desc =  // 读取前 100 个字符作为描述
                vfile.toString()
                  .replace(/\r?\n/g, ' ')
                  .slice(0, 100)
            }
            if (!vfileMatterData.date) {
              vfileMatterData.date = moment(file.time).format('YYYY/MM/DD')
            }
            return {
              path: relativePath,
              meta: vfileMatterData,
            }
          })
        newNoteMap[dir] = notesInDir
      }
      noteMap = newNoteMap
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return (`
          export const noteMap = ${JSON.stringify(noteMap)}
        `)
      }
    },
  }
}