import Head from 'next/head'

import Layout from '../components/layout'
import Container from '../components/container'
import Header from '../components/header'
import Posts from '../components/posts'
import { getAllPosts } from '../lib/api'

export default function Index({ allPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>akalp.co | Hasan Akalp</title>
        </Head>
        <Container>
          <Header />
          <Posts posts={allPosts} />
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}