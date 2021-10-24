import PostPreview from '../components/post-preview'

export default function Posts({ posts }) {
  return (
    <section>
      <h2 className="mb-8 text-2xl md:text-4xl font-bold tracking-tighter leading-tight">
        Gönderiler
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-8 md:gap-y-16">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}