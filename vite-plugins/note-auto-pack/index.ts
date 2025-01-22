import { readdirSync, statSync } from 'fs'
import path from 'path'

const pwd = process.cwd()
const noteDir = `${pwd}/src/notes/`

type TNotePackPluginConfig = {
  notesPerPage?: number
};

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
  let noteRoutes: string = ""

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
      noteRoutes = noteFileSorted
        .map(filename => `{
          path: '${filename}',
          component: () => import('@/notes/${filename}'),
        }`)
        .join(',')
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
      console.log(noteRoutes)
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const noteMenu: string[] = []

        return (`
          export const noteMenu = [
            ${noteMenus.join(',')}
          ]
          export const noteRoutes = [
            ${noteRoutes}
          ]
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