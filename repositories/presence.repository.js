const { PrismaClient } = require('@prisma/client')

const employees = async (npp) => {
    const prisma = new PrismaClient()
    const employees = await prisma.users.findMany({
        where: {
            supervisor_npp: npp
        },
        select: {
            id: true,
            name: true,
            npp: true
        }
    })

    return employees;
}

const presences = async (id) => {
    const prisma = new PrismaClient()
    const presences = await prisma.epresences.findMany({
        where: {
            user_id: id
        },
        include: {
            employee: {
                select: {
                    name: true
                }
            }
        }
    })

    return presences;
}

const storePresence = async (data) => {
    const prisma = new PrismaClient()
    const presences = await prisma.epresences.create({
        data: data
    })

    return presences;
}

const updateStatus = async (id, status) => {
    const prisma = new PrismaClient()
    const presences = await prisma.epresences.update({
        where: {
            id: id
        },
        data: {
            is_approve: status
        },
    })

    return presences;
}

const Latestpresences = async (id) => {
    const prisma = new PrismaClient()
    const presences = await prisma.epresences.findMany({
        where: {
            user_id: id
        },
        orderBy: {
            time: 'desc'
        },
        take: 2,
        include: {
            employee: {
                select: {
                    name: true
                }
            }
        }
    })

    return presences;
}

module.exports = {
    employees,
    presences,
    storePresence,
    updateStatus,
    Latestpresences
}