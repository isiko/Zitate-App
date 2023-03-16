import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getQuotes, createQuote } from '@/lib/dbHelper';

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
            .then((quote) => {
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
