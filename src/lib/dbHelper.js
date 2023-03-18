import { PrismaClient } from '@prisma/client';

// Docs -> https://www.prisma.io/docs/concepts/components/prisma-client
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

//TODO: Sometimes prisma complains about not enough fiels provided and marks the "id" field as optional, this should be fixed some time
async function getQuote(id) {
    return await prisma.quote.findUnique({
        where: { id: id },
        ...quoteQuery,
    });
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

async function deleteQuote(id) {
    return await prisma.quote.delete({
        where: { id: id },
    });
}

module.exports = {
    getQuotes,
    getQuote,
    createQuote,
    deleteQuote,
}
