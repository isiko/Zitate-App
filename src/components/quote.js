import Link from 'next/link'
import { useSession } from "next-auth/react"


export default function Quote({ quote, focused }) {
    const { data: session } = useSession()

    return (
        <div className="p-3 m-2 rounded bg-secondary text-white">
            <ul>
            {
                quote.lines.map((line) => {
                    return (
                        <li key={line.id}>
                        <p>{ line.author ? line.author.name : line.authorAlias}: {line.line}</p>
                        <p></p>
                        </li>
                    )
                })
            }
            </ul>
            <p>Posted by: {quote.creator.name}</p>
            <div>
                { !focused ? <Link href={`/${quote.id}`} className="btn btn-info">Show</Link> : null }
                {
                    session && session.user.email === quote.creator.email ? null :
                        <>
                            <Link href={`/edit/${quote.id}`} className="btn btn-warning">Edit</Link>
                            <button type="button" className="btn btn-danger" onClick={() => 
                                fetch(`/api/quote`, {
                                    method: 'DELETE',
                                    body: JSON.stringify({ id: quote.id }),
                                })
                            }>Delete</button>
                        </>
                }
            </div>
        </div>
    )
}
