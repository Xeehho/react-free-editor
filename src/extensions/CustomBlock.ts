import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import CustomBlockView from '../components/CustomBlockView'
import type { CustomBlockItem } from '../types'

export function createCustomBlockExtension(items: CustomBlockItem[]) {
  return Node.create({
    name: 'customBlock',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        blockKey: {
          default: null,
        },
        blockData: {
          default: {},
          parseHTML: (element: HTMLElement) => {
            try {
              return JSON.parse(element.getAttribute('data-block-data') || '{}')
            } catch {
              return {}
            }
          },
          renderHTML: (attributes: Record<string, any>) => {
            return {
              'data-block-data': JSON.stringify(attributes.blockData || {}),
            }
          },
        },
      }
    },

    parseHTML() {
      return [{ tag: 'div[data-custom-block]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-custom-block': '' })]
    },

    addNodeView() {
      return ReactNodeViewRenderer(CustomBlockView)
    },

    addCommands() {
      return {
        insertCustomBlock:
          (blockKey: string, attrs?: Record<string, any>) =>
          ({ commands }: { commands: any }) => {
            const item = items.find((i) => i.key === blockKey)
            return commands.insertContent({
              type: this.name,
              attrs: {
                blockKey,
                blockData: attrs || item?.defaultAttrs || {},
              },
            })
          },
      } as any
    },
  })
}
