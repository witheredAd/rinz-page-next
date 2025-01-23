import { readdirSync, statSync } from 'fs'
import path from 'path'
import { readSync } from 'to-vfile'
import { matter } from 'vfile-matter'

const pwd = process.cwd()
const noteDir = `${pwd}/src/notes/`

type TNotePackPluginConfig = {
  notesPerPage?: number
};
type TNoteMetadata = {
  path: string,
  meta: {
    title?: string,
    desc?: string,
  }
}

const range = (start: number, end: number) => {
  return [...Array(end - start).keys()].map((item) => item + start)
}

export default function NotePackPlugin(
  props : TNotePackPluginConfig = {}
) {
  const virtualModuleId = 'virtual:note-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  let numOfPages = 1
  const noteMenus: string[] = []
  let noteMetadata: TNoteMetadata[] = []

  return {
    name: 'rollup-plugin-rinz-note-pack',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      } else if (id.startsWith(virtualModuleId)) {
        return '\0' + id;
      }
    },
    buildStart() {
      const noteFileSorted = readdirSync(noteDir)
        .filter((filename) => 
          filename.endsWith('.mdx') || filename.endsWith('.md'))
        .map(filename => ({
          name: filename,
          time: statSync(
            path.join(noteDir, filename)
          ).mtime.getTime()
        }))
        .sort(function (a, b) {
          return b.time - a.time;
        })
        .map(item => item.name)
      
      noteMetadata = noteFileSorted
        .map(filename => {
          const vfile = readSync(`${noteDir}${filename}`)
          matter(vfile)
          return {
            path: filename,
            meta: vfile.data.matter ?? {},
          }
        })
      
      const notesPerPage = props.notesPerPage ?? noteFileSorted.length
      for (const i of range(0, 
        Math.ceil(noteFileSorted.length / notesPerPage)
      )) {
        const noteMenu = noteFileSorted
          .slice(i*notesPerPage, (i + 1)*notesPerPage)
          .map(filename => `{
              path: '${filename}',
              component: () => import('@/notes/${filename}'),
            }`
          )
          .join(',')
        noteMenus.push(`[${noteMenu}]`)
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        console.log(`export const noteMetadata = ${JSON.stringify(noteMetadata)}`)
        return (`
          export const noteMetadata = ${JSON.stringify(noteMetadata)}
        `)
      } else if (id.startsWith('\0' + virtualModuleId)) {
        const subModuleId = new RegExp(`^\0${virtualModuleId}/(.*?)$`).exec(id)?.[1]
        if (! subModuleId) {
          return ;
        }
        const pageId = /^page(\d+)$/.exec(subModuleId)?.[1]
        return `
          export default ${noteMenus[Number(pageId)]};
        `
      }
    },
  }
}