import type { ReactNode } from 'react'
import type { UploadProps } from 'antd'

export type EditorMode = 'wysiwyg' | 'markdown'

export interface CustomBlockItem {
  key: string
  label: string
  icon?: ReactNode
  render: (props: { node: any; updateAttributes: (attrs: Record<string, any>) => void }) => ReactNode
  toHTML: (attrs: Record<string, any>) => string
  defaultAttrs?: Record<string, any>
}

export interface ReactFreeEditorProps {
  initialContent?: string
  onChange?: (html: string) => void
  onMarkdownChange?: (markdown: string) => void
  placeholder?: string
  height?: number | string
  mode?: EditorMode
  onModeChange?: (mode: EditorMode) => void
  uploadProps?: UploadProps
  customBlocks?: CustomBlockItem[]
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
}

export interface ToolbarProps {
  editor: any
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  uploadProps?: UploadProps
  customBlocks?: CustomBlockItem[]
  showPreview: boolean
  onPreviewToggle: () => void
}
