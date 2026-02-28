
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const founders = await prisma.user.findMany({
        where: {
            role: {
                in: ['FOUNDER', 'CO_FOUNDER']
            }
        }
    })
    console.log('Founders:', founders.map(f => ({ email: f.email, role: f.role })))

    const expensesCount = await prisma.expense.count()
    console.log('Expenses count:', expensesCount)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
