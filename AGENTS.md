# react-free-editor

基于 [Tiptap](https://tiptap.dev/) 构建的 React 富文本编辑器，支持 Markdown 模式、媒体上传和自定义内容块。

## 特性

- **所见即所得 / Markdown 双模式** — 一键切换编辑模式，Markdown 模式下工具栏操作自动转换为 Markdown 格式符号，并支持实时预览
- **图片 & 视频上传** — 基于 Ant Design Upload 组件，可自定义上传接口和请求配置
- **自定义内容块** — 通过配置插入自定义 DOM 内容，支持多个自定义块，块内可交互编辑属性
- **完整的工具栏** — 撤销/重做、加粗/斜体/下划线/删除线、标题级别、有序/无序列表、引用、代码块、文本对齐、链接、分割线等
- **TypeScript 支持** — 完整的类型定义
- **开箱即用** — 样式内置，无需额外引入 CSS

## 安装

```bash
npm install react-free-editor
```

### Peer Dependencies

确保你的项目已安装以下依赖：

```bash
npm install react react-dom antd @ant-design/icons
```

| 依赖 | 版本要求 |
|------|---------|
| react | >= 18.0.0 |
| react-dom | >= 18.0.0 |
| antd | >= 5.0.0 |
| @ant-design/icons | >= 5.0.0 |

## 快速开始

```tsx
import { ReactFreeEditor } from 'react-free-editor'
import 'react-free-editor/dist/styles.css'

function App() {
  return (
    <ReactFreeEditor
      initialContent="<p>Hello World</p>"
      onChange={(html) => console.log(html)}
      height={500}
    />
  )
}
```

## API

### ReactFreeEditor Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialContent` | `string` | `''` | 初始内容（HTML 格式） |
| `onChange` | `(html: string) => void` | - | 内容变化回调，返回 HTML |
| `onMarkdownChange` | `(markdown: string) => void` | - | Markdown 模式下内容变化回调，返回 Markdown 文本 |
| `placeholder` | `string` | `'开始输入内容...'` | 占位文本 |
| `height` | `number \| string` | `500` | 编辑器高度 |
| `mode` | `'wysiwyg' \| 'markdown'` | `'wysiwyg'` | 编辑模式（受控） |
| `onModeChange` | `(mode: EditorMode) => void` | - | 模式切换回调 |
| `uploadProps` | `UploadProps` | - | antd Upload 组件的 Props，用于配置图片/视频上传 |
| `customBlocks` | `CustomBlockItem[]` | `[]` | 自定义内容块配置 |
| `readOnly` | `boolean` | `false` | 是否只读 |
| `className` | `string` | `''` | 自定义类名 |
| `style` | `React.CSSProperties` | - | 自定义行内样式 |

### CustomBlockItem

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | ✅ | 自定义块的唯一标识 |
| `label` | `string` | ✅ | 在工具栏下拉菜单中显示的名称 |
| `icon` | `ReactNode` | - | 在工具栏下拉菜单中显示的图标 |
| `render` | `(props: { node: any; updateAttributes: (attrs: Record<string, any>) => void }) => ReactNode` | ✅ | 自定义块的渲染函数 |
| `toHTML` | `(attrs: Record<string, any>) => string` | ✅ | 将自定义块转换为 HTML 字符串 |
| `defaultAttrs` | `Record<string, any>` | - | 自定义块的默认属性 |

## 使用示例

### 基础用法

```tsx
import { ReactFreeEditor } from 'react-free-editor'
import 'react-free-editor/dist/styles.css'

function App() {
  return (
    <ReactFreeEditor
      initialContent="<p>欢迎使用 <strong>React Free Editor</strong>！</p>"
      onChange={(html) => console.log(html)}
    />
  )
}
```

### 配置图片/视频上传

使用 antd 的 Upload 组件配置上传接口，上传完成后自动将 URL 插入编辑器：

```tsx
import { ReactFreeEditor } from 'react-free-editor'
import 'react-free-editor/dist/styles.css'

function App() {
  return (
    <ReactFreeEditor
      uploadProps={{
        action: 'https://your-api.com/upload',
        headers: {
          authorization: 'Bearer your-token',
        },
        // 上传接口需返回 { url: string } 或 { data: { url: string } }
      }}
    />
  )
}
```

如果需要自定义上传逻辑，可以使用 `customRequest`：

```tsx
<ReactFreeEditor
  uploadProps={{
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('https://your-api.com/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        onSuccess(data)
      } catch (err) {
        onError(err)
      }
    },
  }}
/>
```

### 自定义内容块

通过 `customBlocks` 配置多个自定义内容块，点击工具栏中的自定义按钮即可插入：

```tsx
import { ReactFreeEditor } from 'react-free-editor'
import type { CustomBlockItem } from 'react-free-editor'
import { TagOutlined } from '@ant-design/icons'
import 'react-free-editor/dist/styles.css'

const customBlocks: CustomBlockItem[] = [
  {
    key: 'info-card',
    label: '信息卡片',
    icon: <TagOutlined />,
    defaultAttrs: { title: '提示', content: '这是一条提示信息' },
    render: ({ node, updateAttributes }) => {
      const data = node.attrs.blockData || {}
      return (
        <div style={{
          padding: '12px 16px',
          background: '#f0f7ff',
          border: '1px solid #91caff',
          borderRadius: 6,
        }}>
          <div style={{ fontWeight: 600, color: '#1677ff' }}>{data.title}</div>
          <div>{data.content}</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input
              value={data.title || ''}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              placeholder="标题"
            />
            <input
              value={data.content || ''}
              onChange={(e) => updateAttributes({ content: e.target.value })}
              placeholder="内容"
            />
          </div>
        </div>
      )
    },
    toHTML: (attrs) =>
      `<div class="info-card"><strong>${attrs.title}</strong><p>${attrs.content}</p></div>`,
  },
  {
    key: 'warning-box',
    label: '警告框',
    defaultAttrs: { message: '请注意此操作不可逆' },
    render: ({ node, updateAttributes }) => {
      const data = node.attrs.blockData || {}
      return (
        <div style={{
          padding: '12px 16px',
          background: '#fff7e6',
          border: '1px solid #ffd591',
          borderRadius: 6,
        }}>
          ⚠️ {data.message}
          <input
            value={data.message || ''}
            onChange={(e) => updateAttributes({ message: e.target.value })}
            style={{ marginLeft: 8 }}
          />
        </div>
      )
    },
    toHTML: (attrs) =>
      `<div class="warning-box">⚠️ ${attrs.message}</div>`,
  },
]

function App() {
  return (
    <ReactFreeEditor
      customBlocks={customBlocks}
      onChange={(html) => console.log(html)}
    />
  )
}
```

### 受控模式切换

```tsx
import { useState } from 'react'
import { ReactFreeEditor } from 'react-free-editor'
import type { EditorMode } from 'react-free-editor'
import 'react-free-editor/dist/styles.css'

function App() {
  const [mode, setMode] = useState<EditorMode>('wysiwyg')

  return (
    <ReactFreeEditor
      mode={mode}
      onModeChange={setMode)}
    />
  )
}
```

### 获取 Markdown 内容

```tsx
import { ReactFreeEditor } from 'react-free-editor'
import 'react-free-editor/dist/styles.css'

function App() {
  return (
    <ReactFreeEditor
      onMarkdownChange={(markdown) => {
        console.log('Markdown 输出:', markdown)
      }}
    />
  )
}
```

## 工具栏功能

| 功能 | 说明 |
|------|------|
| 撤销 / 重做 | 撤销和重做编辑操作 |
| 加粗 / 斜体 / 下划线 / 删除线 | 文本格式化 |
| 标题级别 | 正文、标题1、标题2、标题3 |
| 有序列表 / 无序列表 | 列表 |
| 引用 | 引用块 |
| 代码块 | 代码块 |
| 文本对齐 | 左对齐、居中、右对齐、两端对齐 |
| 插入图片 | 通过 antd Upload 上传图片 |
| 插入视频 | 通过 antd Upload 上传视频 |
| 插入链接 | 弹窗输入链接地址 |
| 分割线 | 插入水平分割线 |
| 自定义内容 | 下拉选择插入自定义内容块 |
| 模式切换 | WYSIWYG / Markdown 模式切换 |
| Markdown 预览 | Markdown 模式下实时预览渲染效果 |

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 监听模式构建
npm run build:watch

# 运行示例项目
cd example
npm install
npm run dev
```

## 发布到 npm

```bash
npm run build
npm publish
```

## License

MIT
