import { NodeViewWrapper } from '@tiptap/react'
import { useContext } from 'react'
import { CustomBlocksContext } from './CustomBlocksProvider'

interface CustomBlockViewProps {
  node: any
  updateAttributes: (attrs: Record<string, any>) => void
}

export default function CustomBlockView({ node, updateAttributes }: CustomBlockViewProps) {
  const items = useContext(CustomBlocksContext)
  const blockKey = node.attrs.blockKey
  const blockData = node.attrs.blockData || {}
  const item = items.find((i: any) => i.key === blockKey)

  if (!item) {
    return (
      <NodeViewWrapper>
        <div style={{ padding: 8, border: '1px dashed #ccc', borderRadius: 4, color: '#999' }}>
          Unknown custom block: {blockKey}
        </div>
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper>
      <div className="react-free-editor-custom-block" data-custom-block={blockKey}>
        {item.render({ node, updateAttributes: (attrs: Record<string, any>) => updateAttributes({ blockData: { ...blockData, ...attrs } }) })}
      </div>
    </NodeViewWrapper>
  )
}
