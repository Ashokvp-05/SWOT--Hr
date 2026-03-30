import { PrismaClient, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
declare const process: any;

async function main() {
    console.log('--- 🎧 SEEDING SUPPORT NODE ---')
    
    // 1. Get Default Company
    const company = await prisma.company.findFirst({
        where: { subdomain: 'default' }
    })
    
    if (!company) {
        console.log('❌ Company "default" not found. Run main seed first.')
        return
    }

    // 2. Ensure SUPPORT_ADMIN role exists
    let supportRole = await prisma.role.findFirst({
        where: { name: 'SUPPORT_ADMIN', companyId: company.id }
    })
    
    if (!supportRole) {
        supportRole = await prisma.role.create({
            data: {
                name: 'SUPPORT_ADMIN',
                permissions: {
                    manage_tickets: true,
                    view_all_tickets: true,
                    assign_tickets: true,
                    resolve_tickets: true,
                    system_monitoring: true
                },
                companyId: company.id
            }
        })
        console.log('✅ Role Created: SUPPORT_ADMIN')
    }

    // 3. Create Support Admin Credentials
    const hashedPassword = await bcrypt.hash('Support@Secure2026', 10)
    
    const supportUser = await prisma.user.upsert({
        where: { email: 'support@hr-central.com' },
        update: {
            password: hashedPassword,
            roleId: supportRole.id,
            companyId: company.id,
            status: UserStatus.ACTIVE
        },
        create: {
            email: 'support@hr-central.com',
            name: 'Alex Rivera', // Support Manager Name
            password: hashedPassword,
            roleId: supportRole.id,
            companyId: company.id,
            status: UserStatus.ACTIVE,
            timezone: 'Asia/Kolkata'
        }
    })
    
    console.log(`✅ Support User Synchronized: ${supportUser.email}`)
    console.log('🔑 Credential Manifest: Support@Secure2026')

    // 4. Create some Mock Tickets
    const employee = await prisma.user.findFirst({
        where: { email: 'employee@hrms.com' }
    })

    if (employee) {
        console.log('📝 Seeding Mock Tickets...')
        await prisma.ticket.createMany({
            data: [
                {
                    title: 'Login failures on mobile node',
                    description: 'Unable to authenticate using the mobile app on Android 14. Returning status 401.',
                    priority: 'HIGH',
                    category: 'BUG',
                    status: 'OPEN',
                    userId: employee.id,
                    companyId: company.id,
                    token: 'ISS-1001'
                },
                {
                    title: 'Payroll discrepancy for March cycle',
                    description: 'The HRA component seems miscalculated across the whole department.',
                    priority: 'CRITICAL',
                    category: 'PAYROLL',
                    status: 'IN_PROGRESS',
                    userId: employee.id,
                    companyId: company.id,
                    assignedToId: supportUser.id,
                    token: 'ISS-1002'
                }
            ]
        })
    }

    console.log('--- 🎧 SYNC COMPLETE ---')
}

main()
    .catch((e) => {
        console.error('❌ Sync Failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
