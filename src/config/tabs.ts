type TTabConfig = {
  url: string,
  title: string,
}[]

export const tabConfig: TTabConfig = [
  {
    url: '/',
    title: '首页 Home',
  },
  {
    url: '/note',
    title: '笔记 Note',
  },
  {
    url: '/project',
    title: '项目 Proj',
  },
  {
    url: '/work',
    title: '作品 Work'
  }
]