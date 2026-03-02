
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

async function main() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    const user = await prisma.user.findUnique({
        where: { email: 'saazidaid@gmail.com' }
    })
    console.log('USER_DATA_START')
    console.log(JSON.stringify(user, null, 2))
    console.log('USER_DATA_END')

    await prisma.$disconnect()
    await pool.end()
}

main().catch(e => console.error(e))
