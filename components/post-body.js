export default function PostBody({ content }) {
  return (
    <div className="max-w-5xl mx-auto">
      <article
        className="prose lg:prose-xl dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}