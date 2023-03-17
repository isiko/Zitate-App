import { useSession } from "next-auth/react"


export default function Quote({ quote }) {
    const session = useSession();

    return (
    <div class="p-3 m-2 rounded bg-secondary text-white">
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
            <button type="button" class="btn btn-danger" onClick={() => 
                fetch(`/api/quote`, {
                    method: 'DELETE',
                    body: JSON.stringify({ id: quote.id }),
                })
            }>Delete</button>
        </div>
    )
}
