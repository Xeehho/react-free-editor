import { forwardRef, useCallback, useState } from 'react'
import { Upload, Modal, Dropdown, Tooltip, Switch, Space } from 'antd'
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
  UndoOutlined,
  RedoOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  CodeOutlined,
  MinusOutlined,
  ReadOutlined,
  EyeOutlined,
  EditOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons'
import type { ToolbarProps } from '../types'
import MarkdownPreview from './MarkdownPreview'

const ToolBtn = forwardRef<HTMLButtonElement, {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  icon: React.ReactNode
  title: string
}>(({ onClick, active, disabled, icon, title }, ref) => (
  <Tooltip title={title}>
    <button
      ref={ref}
      type="button"
      className={`react-free-editor-toolbar-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  </Tooltip>
))

ToolBtn.displayName = 'ToolBtn'

function ToolbarVerticalDivider() {
  return <span className="react-free-editor-toolbar-divider" />
}

export default function Toolbar({ editor, mode, onModeChange, uploadProps, customBlocks }: ToolbarProps) {
  const [linkModalOpen, setLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const getMarkdown = useCallback(() => {
    if (!editor) return ''
    return (editor.storage as any).markdown?.getMarkdown?.() || ''
  }, [editor])

  if (!editor) return null

  const isMarkdown = mode === 'markdown'

  const handleImageUpload = (info: any) => {
    if (info.file.status === 'done' && info.file.response) {
      const url = info.file.response?.url || info.file.response?.data?.url
      if (url) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }
    uploadProps?.onChange?.(info)
  }

  const handleVideoUpload = (info: any) => {
    if (info.file.status === 'done' && info.file.response) {
      const url = info.file.response?.url || info.file.response?.data?.url
      if (url) {
        editor.chain().focus().setVideo({ src: url }).run()
      }
    }
  }

  const handleSetLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setLinkModalOpen(false)
    setLinkUrl('')
  }

  return (
    <div className="react-free-editor-toolbar">
      <div className="react-free-editor-toolbar-group">
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={<UndoOutlined />}
          title="撤销"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={<RedoOutlined />}
          title="重做"
        />
      </div>

      <ToolbarVerticalDivider />

      <div className="react-free-editor-toolbar-group">
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={<BoldOutlined />}
          title="加粗"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={<ItalicOutlined />}
          title="斜体"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          icon={<UnderlineOutlined />}
          title="下划线"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={<StrikethroughOutlined />}
          title="删除线"
        />
      </div>

      <ToolbarVerticalDivider />

      <div className="react-free-editor-toolbar-group">
        <select
          className="react-free-editor-toolbar-select"
          value={
            editor.isActive('heading', { level: 1 })
              ? '1'
              : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                  ? '3'
                  : '0'
          }
          onChange={(e) => {
            const val = e.target.value
            if (val === '0') {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: Number(val) as 1 | 2 | 3 }).run()
            }
          }}
        >
          <option value="0">正文</option>
          <option value="1">标题1</option>
          <option value="2">标题2</option>
          <option value="3">标题3</option>
        </select>
      </div>

      <ToolbarVerticalDivider />

      <div className="react-free-editor-toolbar-group">
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={<UnorderedListOutlined />}
          title="无序列表"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={<OrderedListOutlined />}
          title="有序列表"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={<ReadOutlined />}
          title="引用"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={<CodeOutlined />}
          title="代码块"
        />
      </div>

      <ToolbarVerticalDivider />

      <div className="react-free-editor-toolbar-group">
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          icon={<AlignLeftOutlined />}
          title="左对齐"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          icon={<AlignCenterOutlined />}
          title="居中"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          icon={<AlignRightOutlined />}
          title="右对齐"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          active={editor.isActive({ textAlign: 'justify' })}
          icon={<MenuOutlined />}
          title="两端对齐"
        />
      </div>

      <ToolbarVerticalDivider />

      <div className="react-free-editor-toolbar-group">
        <Upload
          accept="image/*"
          showUploadList={false}
          {...uploadProps}
          onChange={handleImageUpload}
        >
          <ToolBtn onClick={() => {}} icon={<PictureOutlined />} title="插入图片" />
        </Upload>

        <Upload
          accept="video/*"
          showUploadList={false}
          customRequest={uploadProps?.customRequest}
          action={uploadProps?.action}
          headers={uploadProps?.headers}
          data={uploadProps?.data}
          onChange={handleVideoUpload}
        >
          <ToolBtn onClick={() => {}} icon={<VideoCameraOutlined />} title="插入视频" />
        </Upload>

        <ToolBtn
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || ''
            setLinkUrl(previousUrl)
            setLinkModalOpen(true)
          }}
          active={editor.isActive('link')}
          icon={<LinkOutlined />}
          title="链接"
        />
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<MinusOutlined />}
          title="分割线"
        />
      </div>

      {customBlocks && customBlocks.length > 0 && (
        <>
          <ToolbarVerticalDivider />
          <div className="react-free-editor-toolbar-group">
            <Dropdown
              menu={{
                items: customBlocks.map((block) => ({
                  key: block.key,
                  label: block.label,
                  icon: block.icon,
                  onClick: () => {
                    editor.chain().focus().insertCustomBlock(block.key).run()
                  },
                })),
              }}
            >
              <ToolBtn onClick={() => {}} icon={<AppstoreAddOutlined />} title="自定义内容" />
            </Dropdown>
          </div>
        </>
      )}

      <div className="react-free-editor-toolbar-spacer" />

      <div className="react-free-editor-toolbar-group">
        <Space size={4} align="center">
          <EditOutlined style={{ color: !isMarkdown ? '#1677ff' : '#999', fontSize: 14 }} />
          <Switch
            size="small"
            checked={isMarkdown}
            onChange={(checked) => onModeChange(checked ? 'markdown' : 'wysiwyg')}
          />
          <CodeOutlined style={{ color: isMarkdown ? '#1677ff' : '#999', fontSize: 14 }} />
        </Space>

        {isMarkdown && (
          <ToolBtn
            onClick={() => setShowPreview(!showPreview)}
            active={showPreview}
            icon={<EyeOutlined />}
            title="预览"
          />
        )}
      </div>

      <Modal
        title="插入链接"
        open={linkModalOpen}
        onOk={handleSetLink}
        onCancel={() => {
          setLinkModalOpen(false)
          setLinkUrl('')
        }}
        okText="确定"
        cancelText="取消"
      >
        <input
          className="react-free-editor-link-input"
          type="url"
          placeholder="请输入链接地址"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSetLink()
          }}
        />
      </Modal>

      {isMarkdown && showPreview && (
        <div className="react-free-editor-markdown-preview-container">
          <MarkdownPreview markdown={getMarkdown()} />
        </div>
      )}
    </div>
  )
}
