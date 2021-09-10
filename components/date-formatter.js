import { parseISO, format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function DateFormatter({ dateString }) {
  const date = parseISO(dateString)
  return <time dateTime={dateString}>{format(date, 'LLLL	d, yyyy', { locale: tr })}</time>
}