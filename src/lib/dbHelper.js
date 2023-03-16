import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userQuery = {
    select: {
        id: true,
        name: true,
        image: true,
    },
}
const quoteQuery = {
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
};

async function getQuotes(queries) {
    const query = quoteQuery;
    query.where = {
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
    }

    return await prisma.quote.findMany(query);
}

async function createQuote(date, lines, creator) {
    return await prisma.quote.create({
        data: {
            date: date,
            creator: {
                connect: { email: creator },
            },
            lines: {
                create: lines.map((line) => {
                    return {
                        line: line.line,
                        authorAlias: line.authorAlias,
                        author: line.author ? {
                            connect: { OR: [
                                { id: line.author, },
                                { name: line.author, }
                            ]},
                        } : undefined,
                    }
                })
            }
        }
    });
}

module.exports = {
    getQuotes,
    createQuote,
}
