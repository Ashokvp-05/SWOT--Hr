import { PrismaClient, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
declare const process: any;

async function main() {
    console.log('--- 🛡️ SEEDING AUDITOR NODE ---')
    
    // 1. Ensure AUDITOR role exists in System Roles
    let auditorRole = await (prisma.role as any).findFirst({
        where: { name: 'AUDITOR' }
    })
    
    if (!auditorRole) {
        auditorRole = await (prisma.role as any).create({
            data: {
                name: 'AUDITOR',
                permissions: { read: true, audit: true }
            }
        })
        console.log('✅ Role Created: AUDITOR')
    } else {
        console.log('✅ Role Verified: AUDITOR')
    }

    // 2. Create high-fidelity Auditor Credentials
    const hashedPassword = await bcrypt.hash('Audit@Secure2026', 10)
    
    const auditorUser = await prisma.user.upsert({
        where: { email: 'auditor@hr-central.com' },
        update: {
            password: hashedPassword,
            roleId: auditorRole.id,
            status: UserStatus.ACTIVE
        },
        create: {
            email: 'auditor@hr-central.com',
            name: 'Vikram Malhotra', // Auditor Name from documentation
            password: hashedPassword,
            roleId: auditorRole.id,
            status: UserStatus.ACTIVE,
            timezone: 'Asia/Kolkata'
        }
    })
    
    console.log(`✅ Auditor Synchronized: ${auditorUser.email}`)
    console.log('🔑 Credential Manifest: Audit@Secure2026')
    console.log('--- 🛡️ SYNC COMPLETE ---')
}

main()
    .catch((e) => {
        console.error('❌ Sync Failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
