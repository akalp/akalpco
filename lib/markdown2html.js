import remark from 'remark'
import html from 'remark-html'

export default async function markdown2html(markdown) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}