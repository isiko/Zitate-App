import Link from 'next/link'
import Layout from '@/components/layout'
import { getQuotes } from '@/lib/dbHelper'
import Quote from '@/components/quote'

export async function getServerSideProps(context) {
    const quotes = await getQuotes(context.query);
    const data = JSON.stringify(quotes);

    return {
        props: {
            quotes: data,
        }
    }
}

export default function Home({ quotes }) {
    const json = JSON.parse(quotes);
    return (
        <Layout>
        {
            json.map((quote) => <Quote key={quote.id} quote={quote} />)
        }
        </Layout>
    )
}
