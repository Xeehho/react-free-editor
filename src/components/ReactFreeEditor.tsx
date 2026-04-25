import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import { Markdown } from 'tiptap-markdown'
import { createCustomBlockExtension, Video } from '../extensions'
import { CustomBlocksContext } from './CustomBlocksProvider'
import Toolbar from './Toolbar'
import type { EditorMode, ReactFreeEditorProps } from '../types'

export default function ReactFreeEditor({
  initialContent = '',
  onChange,
  onMarkdownChange,
  placeholder = '开始输入内容...',
  height = 500,
  mode: controlledMode,
  onModeChange,
  uploadProps,
  customBlocks = [],
  readOnly = false,
  className = '',
  style,
}: ReactFreeEditorProps) {
  const [internalMode, setInternalMode] = useState<EditorMode>('wysiwyg')
  const mode = controlledMode ?? internalMode

  const handleModeChange = useCallback(
    (newMode: EditorMode) => {
      if (onModeChange) {
        onModeChange(newMode)
      } else {
        setInternalMode(newMode)
      }
    },
    [onModeChange],
  )

  const customBlockExtension = useMemo(() => createCustomBlockExtension(customBlocks), [customBlocks])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Highlight,
      Video,
      customBlockExtension,
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor: ed }: { editor: any }) => {
      const html = ed.getHTML()
      onChange?.(html)
      if (mode === 'markdown') {
        const md = (ed.storage as any).markdown?.getMarkdown?.() || ''
        onMarkdownChange?.(md)
      }
    },
  })

  useEffect(() => {
    if (editor && readOnly !== editor.isEditable) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  const isMarkdown = mode === 'markdown'

  return (
    <CustomBlocksContext.Provider value={customBlocks}>
      <div
        className={`react-free-editor ${isMarkdown ? 'react-free-editor--markdown' : 'react-free-editor--wysiwyg'} ${className}`}
        style={{ height, ...style }}
      >
        <Toolbar
          editor={editor}
          mode={mode}
          onModeChange={handleModeChange}
          uploadProps={uploadProps}
          customBlocks={customBlocks}
        />
        <div className="react-free-editor-content">
          {isMarkdown ? (
            <div className="react-free-editor-markdown-wrapper">
              <EditorContent editor={editor} />
            </div>
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>
    </CustomBlocksContext.Provider>
  )
}
