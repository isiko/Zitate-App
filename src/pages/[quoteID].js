import Layout from '@/components/layout'
import Quote from '@/components/quote'
import { getQuote } from '@/lib/dbHelper'

export async function getServerSideProps(context) {
    const { quoteID } = context.params;
    const quote = await getQuote(quoteID);

    return {
        props: {
            quote: JSON.stringify(quote),
        }
    }
}

export default function QuotePage({ quote }) {
    return (
        <Layout>
            <Quote quote={JSON.parse(quote)} />
        </Layout>
    )
}
