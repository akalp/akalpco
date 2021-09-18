import Layout from "../components/layout"
import Container from "../components/container"
import Header from "../components/header"
import Image from 'next/image'

export default function About() {
  return (
    <Layout>
      <Container>
        <Header />

        <div className="max-w-xs md:max-w-sm mx-auto mb-8">
          <Image
            src='/assets/author/hasan.jpg'
            alt="Hasan's profile photo"
            className='shadow-sm rounded-full'
            layout="responsive"
            width={360}
            height={360}
          />
        </div>

        <h1 className="text-2xl md:text-4xl mb-8 text-bold text-center">
          {/* Hi, I'm Hasan */}
          Merhaba, ben Hasan
        </h1>

        <p className="max-w-6xl mx-auto text-md md:text-xl">
          {/* I am a Software Engineer addicted to coffee and burgers. */}
          {/* I started writing code when I was 12 years old, so I am passionate about my job. */}
          {/* I have recently been interested in machine learning and web development. */}
          Kahve ve hamburger bağımlısı bir yazılım geliştiriciyim. Aktif olarak ASELSAN A.Ş.&apos;de çalışıyorum. 12 yaşımdan beri kod yazıyorum ve bu sebeple de işime tutkuyla bağlıyım. Son zamanlarda web geliştirme ve makine öğrenimi ile ilgileniyorum.
        </p>

        <p className="max-w-6xl mx-auto text-md md:text-xl mt-6">
          {/* I listen to all kinds of music (especially Hip-Hop) and, I love theater. */}
          {/* I play role-playing, strategy, and action games in my spare time. The Witcher 3: Wild Hunt and Divinity: Original Sin II are my favorites. */}
          {/* In my opinion, I do wonders in the kitchen. By the way, did I say everyone loves my San Sebastian cheesecake? */}
          Biraz kendimden bahsetmek gerekirse, her türden müziği dinlerim fakat Hip-Hop benim favorim. Sahne sanatlarını severim. Boş zamanlarımda rol yapma, strateji ve aksiyon türünde oyunlar oynamayı severim. En sevdiklerim: The Witcher 3: Wild Hunt, Divinity: Original Sin II ve Hades. Ayrıca, mutfakta zaman geçirmeyi çok severim. Bu arada herkesin San Sebastian Cheesecake'ime bayıldığını söylemiş miydim?
        </p>

      </Container>
    </Layout>
  )
}