import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import VideoView from '../components/VideoView'

export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      controls: {
        default: true,
      },
      poster: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'video' }]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['video', mergeAttributes(HTMLAttributes, { controls: 'controls' })]
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoView)
  },

  addCommands() {
    return {
      setVideo:
        (attrs: { src: string; width?: string; poster?: string }) =>
        ({ commands }: { commands: any }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    } as any
  },
})
