// import Avatar from '../components/avatar'
import DateFormatter from '../components/date-formatter'
import CoverImage from './cover-image.js'
import PostTitle from '../components/post-title'
import cn from 'classnames'

export default function PostHeader({ title, coverImage, date, author }) {
  return (
    <div className="max-w-5xl mx-auto">
      <PostTitle>{title}</PostTitle>

      {/* <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
      </div> */}

      {coverImage && (<div className="mb-4 md:mb-8 sm:mx-0">
        <CoverImage title={title} src={coverImage} height={620} width={1240} />
      </div>)}

      {/* <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div> */}
      <div className={cn("flex", { "justify-end": coverImage })}>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </div>
  )
}