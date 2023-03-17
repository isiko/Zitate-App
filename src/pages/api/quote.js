import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getQuotes, createQuote, deleteQuote } from '@/lib/dbHelper';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)

    if (req.method === 'GET') {
        const queries = req.query;
        getQuotes(queries)
            .then((quotes) => {
                res.status(200).json(quotes);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send();
            });
    } else if (req.method === 'POST') {
        if (!session) {
            res.status(401).send();
            return;
        }
        
        const { date, lines } = req.body;
        const creator = session.user.email;

        if (!lines || lines.length === 0) {
            res.status(400).send();
            return;
        }

        createQuote(date, lines, creator)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send();
            });
    } else if (req.method === 'DELETE') {
        // Check if User is logged in
        if (!session) {
            res.status(401).send();
            return;
        }

        // Get Data from Request
        const { id } = JSON.parse(req.body);
        const creatorEmail = session.user.email;

        // Check if an ID was provided
        if (!id) {
            res.status(400).send();
            return;
        }

        const quoteCreator = await prisma.quote.findUnique({
            where: { id: id },
            select: { creator: true },
        });

        // Check if Quote exists
        if (!quoteCreator) {
            res.status(404).send();
            return;
        }

        // Check if User is the creator of the Quote
        if (quoteCreator.creator.email !== creatorEmail) {
            res.status(403).send();
            return;
        }

        // Delete Quote
        deleteQuote(id)
            .then(() => {
                res.status(200).send();
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send();
            });
    } else {
        res.status(405).send();
    }
}
