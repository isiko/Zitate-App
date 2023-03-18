import Layout from '@/components/layout'
import Quote from '@/components/quote'
import { getQuote } from '@/lib/dbHelper'
import { useState } from 'react'

const lineTemplate = {
    authorName: "",
    line: "",
}

export async function getServerSideProps(context) {
    const { quoteID } = context.params;

    if (!quoteID) {
        return { props: {}}
    }

    const quote = await getQuote(quoteID);

    if (!quote) {
        return { props: {}}
    }

    for (const line of quote.lines) {
        line.authorName = line.author ? line.author.name : line.authorAlias;
    }

    return {
        props: {
            quote: JSON.stringify(quote),
        }
    }
}

function handleSubmit(e) {
        e.preventDefault();
}

export default function QuotePage({ quote }) {
    if (quote){
        quote = JSON.parse(quote);
    }

    const [ data, setData ] = useState(quote ? quote.lines : [lineTemplate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let lines = data.slice(0);
        if (lines.length === 0) {
            alert("You need to add at least one line");
            return;
        }

        for (const line of lines) {
            if (!line.authorName || !line.line) {
                alert("You need to fill out all fields");
                return;
            }

            if (!line.author) {
                line.authorAlias = line.authorName;
            }
            line.authorName = undefined;
        }

        quote = {
            id: quote ? quote.id : undefined,
            //date: quote ? quote.date : new Date(), // Removed for now, maybe add later
            lines: lines,
        }

        console.log(quote);

        fetch('/api/quote', {
            method: 'POST',
            body: JSON.stringify(quote),
        }).then((res) => {
            if (res.status === 200) {
                window.location.href = "/";
            } else {
                alert("Something went wrong");
            }
        });
    }

    return (
        <Layout>
            <h1>{ quote ? "Edit Quote" : "Add Quote" }</h1>
            <form onSubmit={handleSubmit}>
                {
                    data.map((line, index) => {
                        return (
                            <div className="input-group mb-3" key={index}>
                                <input type="text" className="form-control" required placeholder="Name" onChange={(e) => {
                                    let lines = data.slice(0);
                                    lines[index].authorName = e.target.value;
                                    setData(lines);
                                }} defaultValue={line.authorName}/>
                                <span className="input-group-text">:</span>
                                <input type="text" className="form-control" required placeholder="Quote" onChange={(e) => {
                                    let lines = data.slice(0);
                                    lines[index].line = e.target.value;
                                    setData(lines);
                                }} defaultValue={line.line}/>
                                <button type="button" className="btn btn-danger" onClick={()=>{setData(data.filter((_, i)=>i!==index))}}>Delete</button>
                            </div>
                        )
                    })
                }
                <div className="input-group mb-3">
                    <button type="button" className="btn btn-primary w-100" onClick={()=>{
                        let lines = data.slice(0);
                        lines.push(lineTemplate)
                        setData(lines)
                    }}>Add Line</button>
                </div>
                <button type="submit" className="btn btn-success w-100" >Submit</button>
            </form>
        </Layout>
    )
}
