declare module "virtual:note-config" {
  type TMenuItem = {
    path: string,
    component: () => Promise<typeof import("*.mdx")>,
  }
  export const noteRoutes: TMenuItem[];
}

declare module "virtual:note-config/page*" {
  export const value: number;
}