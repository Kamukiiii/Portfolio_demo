import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 引入代码高亮样式
const md = new MarkdownIt({
  html: true,        // 允许在 MD 中写 HTML
  linkify: true,     // 自动将 URL 转为链接
  typographer: true,
  highlight: function (str, lang) {
    // 关键步骤：实现代码高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch { }
    }
    return ''; // 使用默认的转义
  }
});
export function useMarkdown() {
  const render = (text: string) => md.render(text);
  return { render };
}
