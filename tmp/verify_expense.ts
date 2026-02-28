
import { PrismaClient, Role, ExpenseStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Verification Script Started ---')

    // 1. Get a founder
    const founder = await prisma.user.findFirst({
        where: { role: Role.FOUNDER }
    })

    if (!founder) {
        console.error('No founder found for testing')
        return
    }

    // 2. Propose an expense
    const expense = await prisma.expense.create({
        data: {
            title: 'Verification Test Expense',
            amountBDT: 1000,
            status: 'PENDING',
            proposedById: founder.id
        }
    })
    console.log('Proposed expense:', expense.id, 'Status:', expense.status)

    // 3. Approve it
    await prisma.expenseApproval.create({
        data: {
            expenseId: expense.id,
            userId: founder.id,
            status: 'APPROVED'
        }
    })
    console.log('First approval recorded')

    // 4. Check status (should still be PENDING if there are other founders)
    const founders = await prisma.user.findMany({
        where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER] } }
    })
    console.log('Total founders/co-founders:', founders.length)

    const updatedExpense = await prisma.expense.findUnique({
        where: { id: expense.id }
    })

    // Note: The logic in the API route does the consensus check. 
    // In this script, I'm just verifying that the data structure works.
    console.log('Updated expense status:', updatedExpense?.status)

    // 5. Cleanup
    await prisma.expense.delete({ where: { id: expense.id } })
    console.log('Test expense cleaned up')

    console.log('--- Verification Script Completed ---')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
