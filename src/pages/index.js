import Link from 'next/link'
import Layout from '@/components/layout'
import { getQuotes } from '@/lib/dbHelper'
import Quote from '@/components/quote'
import { authOptions } from './api/auth/[...nextauth]';
import { getServerSession } from "next-auth/next"

export async function getServerSideProps(context) {
    const session = await getServerSession(context.req, context.res, authOptions)
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
