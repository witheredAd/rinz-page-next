import { readdirSync, statSync } from 'fs'
import path from 'path'

const pwd = process.cwd()
const noteDir = `${pwd}/src/notes/`

export default function myPlugin() {
  const virtualModuleId = 'virtual:note-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const noteMenu: string[] = []
        readdirSync(noteDir)
          .map(filename => ({
            name: filename,
            time: statSync(
              path.join(noteDir, filename)
            ).mtime.getTime()
          }))
          .sort(function(a, b) {
            return b.time - a.time;
          })
          .map(item => item.name)
          .forEach(filename => {
            if (filename.endsWith('.mdx') || filename.endsWith('.md')) {
              noteMenu.push(`{
                path: '${filename}',
                component: () => import('@/notes/${filename}'),
              }`)
            }
          })
        return (`
          export const noteMenu = [
            ${noteMenu.join(',')}
          ]
        `)
      }
    },
  }
}