import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({
  gfm: true,
  breaks: false,
})

interface MarkdownPreviewProps {
  markdown: string
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    if (!markdown) return ''
    return marked.parse(markdown) as string
  }, [markdown])

  return (
    <div
      className="react-free-editor-markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
