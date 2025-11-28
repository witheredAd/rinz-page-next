declare module "virtual:note-config" {
  type TNoteMetadata = {
    path: string,
    meta: {
      title?: string,
      desc?: string,
      SpecTag?: string,
    }
  }

  type TNoteMap = {
    [key: string]: TNoteMetadata[]
  }

  export const noteMap: TNoteMap;
}