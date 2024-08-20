declare module "virtual:note-config" {
  type TMenuItem = {
    path: string,
    component: () => Promise<typeof import("*.mdx")>,
  }
  export const noteMenu: TMenuItem[];
}