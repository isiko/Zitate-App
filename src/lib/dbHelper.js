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
};

async function getQuotes(queries) {
    let query = {
        select: quoteQuery,
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

async function getQuote(id) {
    const data = await prisma.quote.findMany({
        where: { id: id },
        take: 1,
        select: quoteQuery,
    })

    return data[0];
}

async function updateQuote(id, date, lines) {
    let lineIds = lines.filter((line) => line.id).map((line) => line.id);
    await prisma.quoteLine.deleteMany({
        where: {
            NOT: {
                id: {
                    in: lineIds,
                }
            }
        }
    });
    await prisma.quote.update({
        where: { id: id },
        data: {
            date: date,
            lines: {
                create: lines.filter((line) => !line.id).map((line) => {
                    return {
                        line: line.line,
                        authorAlias: line.authorAlias,
                        author: line.author ? {
                            connect: { 
                                id: line.author,
                            }
                        } : undefined,
                    }
                })
            }
        }
    });
    await prisma.quote.update({
        where: { id: id },
        data: {
            date: date,
            lines: {
                update: lines.filter((line) => line.id).map((line) => {
                    return {
                        where: { id: line.id },
                        data: {
                            line: line.line,
                            authorAlias: line.authorAlias,
                            author: line.author ? {
                                connect: { 
                                    id: line.author,
                                }
                            } : undefined,
                        },
                    }
                })
            }
        }
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
    updateQuote,
    deleteQuote,
}
