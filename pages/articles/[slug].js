import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import Image from 'next/image'



let client = require('contentful').createClient({
    space: process.env.NEXT_CONTENTFUL_SPACE_ID,
    accessToken: process.env.NEXT_CONTENTFUL_ACCESS_TOKEN
  })

export async function getStaticPaths() {
    let data = await client.getEntries({
        content_type: 'article'
    })

    const paths = data.items.map(article => ({
        params: { slug: article.fields.slug}
    }))

    return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
    let data= await client.getEntries({
        //selectionner les articles => selectionner l'article avec le slug {params}
        'content_type': 'article',
        'fields.slug': params.slug
    })

    return { 
        props: {
            article : data.items[0]
        },
        revalidate: 1
    }
}


export default function Article({ article }) {
    if (!article) return <div>404</div>

    const date = article.fields.date.substring(0,10)

    return (
        <div>
            <h1>{article.fields.title}</h1>
            <h3>{date}</h3>
            <div>
                {documentToReactComponents(article.fields.content, {
                        renderNode: {
                            [BLOCKS.EMBEDDED_ASSET]: (node,) => (
                                <Image 
                                    src={'https:' + node.data.target.fields.file.url}
                                    width={node.data.target.fields.file.details.image.width}
                                    height={node.data.target.fields.file.details.image.height}
                                />
                            ),
                        }, 
                    })}
            </div>
        </div>
    )
}
