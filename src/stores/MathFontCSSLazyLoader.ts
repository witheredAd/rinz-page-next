import { defineStore } from "pinia";

export const useMathFontCSS = defineStore('mathfont-css', () => {
  const appendLink = (href: string) => {
    const linkLabel = document.createElement('link')
    Object.assign(linkLabel, {
        rel: 'stylesheet',
        href,
    } as Partial<HTMLLinkElement>)
    document.head.appendChild(linkLabel)
  }
  appendLink('/assets/fonts/mathfonts.css')
  appendLink('/assets/mathyml.css')
  return {}
})