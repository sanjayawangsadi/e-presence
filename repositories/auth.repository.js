const { PrismaClient } = require('@prisma/client')

const authenticate = async (email) => {
    const prisma = new PrismaClient()
    const user = await prisma.users.findUnique({
        where: {
            email: email
        },
        include: {
            supervisor: {
                select: {
                    name: true,
                    npp: true
                }
            }
        }
    })

    return user;
}

const storeAccessToken = async (data) => {
    const prisma = new PrismaClient()
    const access_token = await prisma.access_tokens.create({
        data: data
    })

    return access_token
}

const checkAccessToken = async (token) => {
    const prisma = new PrismaClient()
    const access_token = await prisma.access_tokens.findFirst({
        where: {
            access_token: token
        }
    })

    return access_token;
}

const deactivateAccessToken = async (tokenId) => {
    const prisma = new PrismaClient()
    const access_token = await prisma.access_tokens.update({
        where: {
            id: tokenId
        },
        data: {
            active: false
        }
    })

    return access_token;
}


module.exports = {
    authenticate,
    storeAccessToken,
    checkAccessToken,
    deactivateAccessToken
}