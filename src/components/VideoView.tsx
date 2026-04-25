import { NodeViewWrapper } from '@tiptap/react'

interface VideoViewProps {
  node: any
}

export default function VideoView({ node }: VideoViewProps) {
  const { src, width, controls, poster } = node.attrs

  return (
    <NodeViewWrapper>
      <div className="react-free-editor-video" style={{ width: width || '100%', margin: '8px 0' }}>
        <video
          src={src}
          controls={controls !== false}
          poster={poster || undefined}
          style={{ width: '100%', borderRadius: 4 }}
        />
      </div>
    </NodeViewWrapper>
  )
}
