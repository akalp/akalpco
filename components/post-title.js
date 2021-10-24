export default function PostTitle({ children }) {
  return (
    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-10">
      {children}
    </h1>
  )
}