declare module "virtual:note-config" {
  type TNoteMetadata = {
    path: string,
    meta: {
      title?: string,
      desc?: string,
    }
  }
  export const noteMetadata: TNoteMetadata[];
}

declare module "virtual:note-config/page*" {
  export const value: number;
}