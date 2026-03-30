import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Seeding specific user credentials as requested...');

    // 1. Ensure Default Company exists
    const company = await prisma.company.upsert({
        where: { subdomain: 'default' },
        update: {},
        create: {
            name: 'Default Company',
            subdomain: 'default',
            status: 'ACTIVE',
        },
    });

    // 2. Helper to ensure Roles exist
    async function ensureRole(name: string, permissions: any) {
        return await prisma.role.upsert({
            where: { name_companyId: { name, companyId: company.id } },
            update: { permissions },
            create: { name, companyId: company.id, permissions },
        });
    }

    const roles = {
        SUPER_ADMIN: await ensureRole('SUPER_ADMIN', { all: true }),
        HR_MANAGER: await ensureRole('HR_MANAGER', { 
            manage_employees: true, 
            manage_attendance: true, 
            approve_leave: true,
            manage_payroll: true,
            manage_recruitment: true,
            manage_performance: true,
            manage_documents: true
        }),
        MANAGER: await ensureRole('MANAGER', { view_team: true, approve_leave: true }),
        EMPLOYEE: await ensureRole('EMPLOYEE', { self_service: true, clock_in_out: true }),
        AUDITOR: await ensureRole('AUDITOR', { view_audit_logs: true, view_compliance: true }),
        SUPPORT_ADMIN: await ensureRole('SUPPORT_ADMIN', { manage_tickets: true, view_issues: true }),
    };

    // 3. User Data from request
    const userData = [
        { name: 'Super Admin', email: 'admin@default.com', password: 'Admin@123', role: roles.SUPER_ADMIN },
        { name: 'HR Manager', email: 'hr@hrms.com', password: 'HR@123', role: roles.HR_MANAGER },
        { name: 'Manager', email: 'dev_lead@hrms.com', password: 'Manager@123', role: roles.MANAGER },
        { name: 'Employee', email: 'employee@hrms.com', password: 'Employee@123', role: roles.EMPLOYEE },
        { name: 'Auditor', email: 'auditor@hr-central.com', password: 'Audit@Secure2026', role: roles.AUDITOR },
        { name: 'Support Admin', email: 'support@hr-central.com', password: 'Support@Secure2026', role: roles.SUPPORT_ADMIN },
    ];

    // 4. Upsert Users
    for (const u of userData) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        console.log(`- Upserting ${u.name} (${u.email})`);
        
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password: hashedPassword,
                roleId: u.role.id,
                companyId: company.id,
                status: UserStatus.ACTIVE,
                name: u.name,
            },
            create: {
                email: u.email,
                name: u.name,
                password: hashedPassword,
                roleId: u.role.id,
                companyId: company.id,
                status: UserStatus.ACTIVE,
                emailVerified: true,
            },
        });
    }

    // 5. Add Active Time Entries (For real-time dashboard testing)
    console.log('- Creating active sessions for live dashboard feedback...');
    const usersToClockIn = [
        { email: 'employee@hrms.com', type: 'REMOTE' },
        { email: 'dev_lead@hrms.com', type: 'IN_OFFICE' }
    ];

    for (const u of usersToClockIn) {
        const user = await prisma.user.findUnique({ where: { email: u.email } });
        if (user) {
            await (prisma.timeEntry as any).create({
                data: {
                    userId: user.id,
                    companyId: company.id,
                    clockIn: new Date(),
                    clockType: u.type,
                    status: 'ACTIVE'
                }
            });
        }
    }

    console.log('✨ Credentials seeded successfully. Users can now log in.');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
