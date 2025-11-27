import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic';
import { toText } from 'hast-util-to-text';
import { CompileDocArgs, NodeCompiler } from '@myriaddreamin/typst-ts-node-compiler';
import { SKIP, visitParents } from 'unist-util-visit-parents';

import type { Element, ElementContent, Root } from 'hast';
import type { VFile } from 'vfile';

/** @type {Readonly<Options>} */
const emptyOptions = {};
/** @type {ReadonlyArray<unknown>} */
const emptyClasses = [];



/**
 * Render elements with a `language-math` (or `math-display`, `math-inline`)
 * class with KaTeX.
 *
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeTypstContent(options?: {} | null) {
  const settings = options || emptyOptions;

  return async function (tree: Root, file: VFile) {
    const matches = [];
    visitParents(tree, 'element', (...args) => {
      matches.push(args);
    });
    
    const visitor = async function (element: Element, parents) {
      const classes = Array.isArray(element.properties.className)
        ? element.properties.className
        : emptyClasses;
      // This class can be generated from markdown with ` ```math `.
      const languageTypst = classes.includes('language-typst');
      
      // This class can be generated from markdown with ` ```math `.
      const languageMath = classes.includes('language-math');
      // This class is used by `remark-math` for flow math (block, `$$\nmath\n$$`).
      const mathDisplay = classes.includes('math-display');
      // This class is used by `remark-math` for text math (inline, `$math$`).
      const mathInline = classes.includes('math-inline');
      let displayMode = mathDisplay;
      const isMath = languageMath || mathDisplay || mathInline;

      // Any class is fine.
      if (!languageTypst && !languageMath && !mathDisplay && !mathInline) {
        return;
      }

      let parent = parents[parents.length - 1];
      let scope = element;

      // If this was generated with ` ```typst/math `, replace the `<pre>` and use
      // display(when math).
      if (
        element.tagName === 'code' &&
        parent &&
        (languageTypst || languageMath) &&
        parent.type === 'element' &&
        parent.tagName === 'pre'
      ) {
        scope = parent;
        parent = parents[parents.length - 2];
        if (languageMath) {
          displayMode = true;
        }
      }

      /* c8 ignore next -- verbose to test. */
      if (!parent) return;

      const value = toText(scope, { whitespace: 'pre' });
 
      let result: { html: string };

      try {
        result = await renderToHTMLString(value, { isMath, displayMode });
      } catch (error) {
        const cause = /** @type {Error} */ (error);
        file.message('Could not render content with typst', {
          ancestors: [...parents, element],
          cause,
          place: element.position,
          source: 'rehype-typst-content',
        });

        result = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: ['typst-error'],
              style: 'color:' + (settings.errorColor || '#cc0000'),
              title: String(error),
            },
            children: [{ type: 'text', value }],
          },
        ];
      }

      if ('html' in result) {
        const root = fromHtmlIsomorphic(result.html, { fragment: true });
        
        if (isMath && !displayMode) {
          // For inline math, we need to extract the content of the body.
          console.log(root.children[1])
          result = /** @type {Array<ElementContent>} */ (root.children[1].children[1].children);
        } else {
          result = /** @type {Array<ElementContent>} */ (root.children);
        }
      }

      const index = parent.children.indexOf(scope);
      parent.children.splice(index, 1, ...result);
      return SKIP;
    };
    const promises = matches.map(async args => {
      await visitor(...args);
    });
    await Promise.all(promises);
  };
}

let compilerIns: NodeCompiler;
type RenderOptions = { isMath: boolean; displayMode: boolean };
async function renderToHTMLString(code: string, { isMath, displayMode }: RenderOptions) {
  const $typst = (compilerIns ||= NodeCompiler.create());

  const mainFileContent = (() => {
    if (isMath) {
      if (displayMode) {
        return `
#import "/vite-plugins/rehype-typst-content/packages/mathyml/lib.typ" as mathyml
#import mathyml: to-mathml
#import mathyml.prelude:*

#show math.equation: to-mathml

$ ${code} $`;
      } else return `
#import "/vite-plugins/rehype-typst-content/packages/mathyml/lib.typ" as mathyml
#import mathyml: to-mathml
#import mathyml.prelude:*

#show math.equation: to-mathml

$${code}$`;
    } else return `
#import "/vite-plugins/rehype-typst-content/packages/mathyml/lib.typ" as mathyml
#import mathyml: to-mathml
#import mathyml.prelude:*

#show math.equation: to-mathml

${code}`;
  })();

  const res = renderToHTMLString_($typst, { mainFileContent });
  $typst.evictCache(10);
  return res;
}

async function renderMathYMLStyle() {
  const $typst = (compilerIns ||= NodeCompiler.create());
  const styleContent = `
#import "/vite-plugins/rehype-typst-content/packages/mathyml/lib.typ" as mathyml
#mathyml.stylesheets()`;
  const res = renderToHTMLString_($typst, { mainFileContent: styleContent });
  $typst.evictCache(10);
  return res;
}

async function renderToHTMLString_($typst: NodeCompiler, compileOptions: CompileDocArgs, resultType: 'body'|'hast' = 'body') {
  const docRes = $typst.compileHtml(compileOptions);
  if (!docRes.result) {
    console.log("Error compiling typst to HTML");
    docRes.printDiagnostics();
    return { html: "" };
  }
  const doc = docRes.result;
  const html = $typst.tryHtml(doc);
  if (!html.result) {
    html.printDiagnostics();
    return { html: `${html.takeDiagnostics()}` };
  }

  if (resultType === 'hast') {
    return html.result.hast();
  }

  const res = {
    html: html.result.body(),
  };

  return res;
}
