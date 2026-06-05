import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Markdown } from 'tiptap-markdown'
import { createCustomBlockExtension, Video } from '../extensions'
import { CustomBlocksContext } from './CustomBlocksProvider'
import Toolbar from './Toolbar'
import MarkdownPreview from './MarkdownPreview'
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
  const [markdownText, setMarkdownText] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const markdownTextRef = useRef('')
  const isInternalSwitch = useRef(false)
  const lastMode = useRef<EditorMode>(mode)

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
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Video,
      customBlockExtension,
      Markdown.configure({
        html: true,
        tightLists: true,
        bulletListMarker: '-',
        linkify: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor: ed }: { editor: any }) => {
      if (isInternalSwitch.current) return
      const html = ed.getHTML()
      onChange?.(html)
      const md = (ed.storage as any).markdown?.getMarkdown?.() || ''
      onMarkdownChange?.(md)
    },
  })

  useEffect(() => {
    if (editor && readOnly !== editor.isEditable) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  useEffect(() => {
    if (!editor) return
    if (lastMode.current === mode) return

    isInternalSwitch.current = true

    if (mode === 'markdown') {
      const md = (editor.storage as any).markdown?.getMarkdown?.() || ''
      setMarkdownText(md)
      markdownTextRef.current = md
    } else {
      const currentMd = markdownTextRef.current
      if (currentMd.trim()) {
        editor.commands.setContent(currentMd)
      }
      const html = editor.getHTML()
      onChange?.(html)
      const md = (editor.storage as any).markdown?.getMarkdown?.() || ''
      onMarkdownChange?.(md)
    }

    lastMode.current = mode

    requestAnimationFrame(() => {
      isInternalSwitch.current = false
    })
  }, [editor, mode])

  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setMarkdownText(value)
      markdownTextRef.current = value
      onMarkdownChange?.(value)
    },
    [onMarkdownChange],
  )

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
          showPreview={showPreview}
          onPreviewToggle={() => setShowPreview(!showPreview)}
        />
        <div className="react-free-editor-content">
          {isMarkdown ? (
            <div className="react-free-editor-markdown-split">
              <div className="react-free-editor-markdown-editor">
                <textarea
                  className="react-free-editor-markdown-textarea"
                  value={markdownText}
                  onChange={handleMarkdownChange}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  spellCheck={false}
                />
              </div>
              {showPreview && (
                <>
                  <div className="react-free-editor-markdown-split-divider" />
                  <div className="react-free-editor-markdown-preview-pane">
                    <MarkdownPreview markdown={markdownText} />
                  </div>
                </>
              )}
            </div>
          ) : (
            <EditorContent editor={editor} />
          )}
        </div>
      </div>
    </CustomBlocksContext.Provider>
  )
}
