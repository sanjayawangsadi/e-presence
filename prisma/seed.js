const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const { DateTime } = require("luxon");

const main = async () => {
    const password = 'password';
    const saltRounds = 12

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        const users = await prisma.users.createMany({
            data: [
                {
                    name: 'Ananda Bayu',
                    email: 'bayu@email.com',
                    npp: '12345',
                    supervisor_npp: '11111',
                    password: hash
                },
                {
                    name: 'Supervisor',
                    email: 'spv@email.com',
                    npp: '11111',
                    password: hash
                }
            ]
        })

        const presences = await prisma.epresences.createMany({
            data: [
                {
                    user_id: 1,
                    type: 'IN',
                    is_approve: true,
                    time: new Date('2020-10-16 08:00:00').toISOString()
                },
                {
                    user_id: 1,
                    type: 'OUT',
                    is_approve: false,
                    time: new Date('2020-10-16 17:00:00').toISOString()
                }
            ]
        })

        console.log({ presences, users })
    });

}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })