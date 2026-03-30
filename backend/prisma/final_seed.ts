import 'dotenv/config';
import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting final credential seed...');

    const roles = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];
    const roleMap: Record<string, string> = {};

    for (const roleName of roles) {
        const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: {
                name: roleName,
                permissions: roleName === 'ADMIN' ? { all: true } : { read: true },
            },
        });
        roleMap[roleName] = role.id;
    }

    const credentials = [
        // Set 1: hrms.com
        { email: 'admin@hrms.com', password: 'Admin@123', role: 'ADMIN', name: 'HRMS Admin' },
        { email: 'manager@hrms.com', password: 'Manager@123', role: 'MANAGER', name: 'HRMS Manager' },
        { email: 'employee@hrms.com', password: 'Employee@123', role: 'EMPLOYEE', name: 'HRMS Employee' },
        { email: 'hr@hrms.com', password: 'HR_Secure_hpt6a8vh', role: 'HR', name: 'HR Specialist' },

        // Potential alternative password for HR or another user
        // The user mentioned Swot@1234, I'll create a user for it or use it as a backup
        { email: 'hr_alt@hrms.com', password: 'Swot@1234', role: 'HR', name: 'HR Alt' },

        // Set 2: rudratic.com
        { email: 'admin@rudratic.com', password: 'Admin123!', role: 'ADMIN', name: 'Rudratic Admin' },
        { email: 'manager@rudratic.com', password: 'Manager123!', role: 'MANAGER', name: 'Rudratic Manager' },
        { email: 'employee@rudratic.com', password: 'Employee123!', role: 'EMPLOYEE', name: 'Rudratic Employee' },
    ];

    for (const cred of credentials) {
        const hashedPassword = await bcrypt.hash(cred.password, 10);
        await prisma.user.upsert({
            where: { email: cred.email },
            update: {
                password: hashedPassword,
                roleId: roleMap[cred.role],
                status: UserStatus.ACTIVE
            },
            create: {
                email: cred.email,
                name: cred.name,
                password: hashedPassword,
                roleId: roleMap[cred.role],
                status: UserStatus.ACTIVE,
                department: cred.role === 'ADMIN' ? 'IT' : cred.role,
                designation: cred.role
            },
        });
        console.log(`User ${cred.email} updated/created with password: ${cred.password}`);
    }

    console.log('Final credential seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
