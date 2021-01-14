import Head from 'next/head'
import Link from 'next/link'

let client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN
})

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: 'article'
  })
  
  return {
    props:{
      articles: data.items
    },
    revalidate: 1,
  }
}

export default function Home({ articles }) {

  return (
    <div>
      <Head>
        <title>Blog training</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ul>
          {articles.map(article => (
            <Link href={`/articles/${article.fields.slug}`}>
              <li key={article.fields.slug}>{article.fields.title}</li>
            </Link>
          ))}
        </ul>
      </main>
    </div>
  )
}
