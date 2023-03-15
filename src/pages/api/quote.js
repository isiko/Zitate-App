import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

const userQuery = {
    select: {
        id: true,
        name: true,
        image: true,
    },
}

export default function handler(req, res) {
    if (req.method === 'GET') {
        const queries = req.query;
        const query = {
            select: {
                id: true,
                date: true,
                creator: userQuery,
                lines: {
                    select: {
                        id: true,
                        line: true,
                        author: userQuery,
                        authorAlias: true,
                    },
                },
            },
            where: {
                creator: queries.creator ? {
                    OR: [
                        { name: queries.creator },
                        { id: queries.creator },
                    ]
                } : undefined,
                date: queries.before || queries.after ? {
                    AND: [
                        queries.before ? { lte: queries.before } : undefined,
                        queries.after ? { gte: queries.after } : undefined,
                    ]
                } : undefined,
                lines: queries.author ? {
                    some: {
                        OR: [
                            { 
                                authorAlias: {
                                    in: queries.author
                                }, 
                            },
                            { 
                                author: {
                                    OR: [
                                        { id: {in: queries.author}, },
                                        { name: {in: queries.author}, }
                                    ]
                                }
                            }
                        ]
                    }
                } : undefined,
            },
        };
        prisma.quote.findMany(query).then((quotes) => {
            for (const quote of quotes) {
                for (const line of quote.lines) {
                    line.author = {
                        name: line.author ? line.author.name : line.authorAlias,
                        image: line.author ? line.author.image : undefined,
                    }
                    line.authorAlias = undefined;
                }
            }
            res.status(200).json(quotes);
        });
    } else if (req.method === 'POST') {
        res.status(200).json({ message: 'POST request' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
