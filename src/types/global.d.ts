declare module '*.scss' {
  const content: string
  export default content
}

declare module 'tiptap-markdown' {
  import { Extension } from '@tiptap/core'
  export const Markdown: Extension
}
