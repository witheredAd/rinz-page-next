export default function remarkSimpleNotation() {
  return (tree: any) => {
    // ~~text~~ → <del>
    apply(tree, '~~', (children) => ({
      type: 'delete',
      children,
    }))

    // ==text== → <mark>
    apply(tree, '==', (children) => ({
      type: 'mdxJsxTextElement',
      name: 'mark',
      attributes: [],
      children,
    }))
  }
}

/** Apply inline notation delimited by `char` repeated twice (e.g. ~~ or ==) */
function apply(
  tree: any,
  delim: string,
  createNode: (children: any[]) => any,
) {
  const regex = new RegExp(`${escapeRegex(delim)}(.+?)${escapeRegex(delim)}`, 'g')

  // Pass 1: single text node
  walk(tree, regex, (text) => createNode([{ type: 'text', value: text }]))

  // Pass 2: cross-sibling
  resolveCrossSibling(tree, delim, createNode)
}

function resolveCrossSibling(
  parent: { children?: any[] },
  delim: string,
  createNode: (children: any[]) => any,
) {
  if (!parent.children) return

  const children = parent.children
  let i = children.length - 1
  while (i >= 0) {
    const child = children[i]
    if (child.type === 'text' && child.value.startsWith(delim)) {
      for (let j = i - 1; j >= 0; j--) {
        const prev = children[j]
        if (prev.type === 'text' && prev.value.endsWith(delim)) {
          const prevText = prev.value.slice(0, -delim.length)
          const childText = child.value.slice(delim.length)

          const newNodes: any[] = []
          if (prevText) {
            newNodes.push({ type: 'text', value: prevText })
          }

          const innerChildren: any[] = []
          for (let k = j + 1; k < i; k++) {
            innerChildren.push(children[k])
          }
          if (childText) {
            innerChildren.push({ type: 'text', value: childText })
          }

          newNodes.push(createNode(innerChildren))
          children.splice(j, i - j + 1, ...newNodes)
          i = j
          break
        }
      }
    }
    i--
  }

  for (const child of children) {
    if (child.children) resolveCrossSibling(child, delim, createNode)
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function walk(
  parent: { children?: any[] },
  regex: RegExp,
  createNode: (text: string) => any,
) {
  if (!parent.children) return
  for (let i = parent.children.length - 1; i >= 0; i--) {
    const child = parent.children[i]
    if (child.type === 'text') {
      const matches = Array.from(child.value.matchAll(regex))
      if (matches.length > 0) {
        const newNodes: any[] = []
        let lastIndex = 0
        for (const match of matches) {
          if (match.index! > lastIndex) {
            newNodes.push({ type: 'text', value: child.value.slice(lastIndex, match.index) })
          }
          newNodes.push(createNode(match[1]))
          lastIndex = match.index! + match[0].length
        }
        if (lastIndex < child.value.length) {
          newNodes.push({ type: 'text', value: child.value.slice(lastIndex) })
        }
        parent.children.splice(i, 1, ...newNodes)
      }
    }
    if (child.children) {
      walk(child, regex, createNode)
    }
  }
}
