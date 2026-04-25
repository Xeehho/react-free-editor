import { useMemo } from 'react'

interface MarkdownPreviewProps {
  markdown: string
}

export default function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const html = useMemo(() => {
    return simpleMarkdownToHtml(markdown)
  }, [markdown])

  return (
    <div
      className="react-free-editor-markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function simpleMarkdownToHtml(md: string): string {
  let html = md

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>')
  html = html.replace(/`(.+?)`/g, '<code>$1</code>')

  html = html.replace(/^\> (.+)$/gm, '<blockquote>$1</blockquote>')

  html = html.replace(/^---$/gm, '<hr />')

  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.+)$/gm, '<li>$1. $2</li>')

  html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')

  html = html.replace(/\n\n/g, '</p><p>')
  html = '<p>' + html + '</p>'
  html = html.replace(/<p><(h[1-3]|blockquote|hr|li)/g, '<$1')
  html = html.replace(/<\/(h[1-3]|blockquote|li)><\/p>/g, '</$1>')
  html = html.replace(/<p><hr \/><\/p>/g, '<hr />')

  return html
}
