import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

declare const process: any;

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const employeePassword = await bcrypt.hash('Employee@123', 10);

    // --- SUBSCRIPTION PLANS ---
    console.log('Seeding Subscription Plans...');
    const plans = [
        { name: 'Starter', price: 29.00, interval: 'MONTHLY', maxUsers: 10, features: { attendance: true, leave: true, mobile: true } },
        { name: 'Professional', price: 99.00, interval: 'MONTHLY', maxUsers: 100, features: { attendance: true, leave: true, mobile: true, payroll: true, reports: true } },
        { name: 'Enterprise', price: 499.00, interval: 'MONTHLY', maxUsers: 1000, features: { all: true } },
    ];

    const seededPlans = [];
    for (const p of plans) {
        const plan = await prisma.subscriptionPlan.upsert({
            where: { name: p.name },
            update: p,
            create: p,
        });
        seededPlans.push(plan);
    }

    // 0. Create Default Company (SaaS Root)
    console.log('Seeding Default Company...');
    const defaultCompany = await prisma.company.upsert({
        where: { subdomain: 'default' },
        update: {},
        create: {
            name: 'Default Company',
            subdomain: 'default',
            domain: 'hrms.com',
            status: 'ACTIVE',
            planId: seededPlans[1].id, // Default to Professional
        },
    });

    // 1. Create Roles (SaaS Hierarchy)
    console.log('Seeding Roles...');

    async function upsertRole(name: string, permissions: any, companyId: string | null) {
        const existing = await prisma.role.findFirst({
            where: { name, companyId }
        });

        if (existing) {
            return prisma.role.update({
                where: { id: existing.id },
                data: { permissions }
            });
        }

        return prisma.role.create({
            data: { name, permissions, companyId }
        });
    }

    // Level 2: Company Specific
    const superAdminRole = await upsertRole('SUPER_ADMIN', {
        manage_settings: true,
        manage_employees: true,
        manage_roles: true,
        view_reports: true,
        configure_payroll: true
    }, defaultCompany.id);

    const supportAdminRole = await upsertRole('SUPPORT_ADMIN', {
        manage_tickets: true,
        view_issues: true,
        update_ticket_status: true,
        communicate_with_users: true
    }, defaultCompany.id);

    const hrManagerRole = await upsertRole('HR_MANAGER', {
        manage_employees: true,
        manage_attendance: true,
        approve_leave: true,
        process_payroll: true,
        generate_reports: true
    }, defaultCompany.id);

    const managerRole = await upsertRole('MANAGER', {
        view_team: true,
        approve_leave: true,
        approve_attendance: true,
        submit_ratings: true
    }, defaultCompany.id);

    const employeeRole = await upsertRole('EMPLOYEE', {
        self_service: true,
        view_payslips: true,
        apply_leave: true,
        clock_in_out: true
    }, defaultCompany.id);

    // 2. Create Users (Hierarchical)
    console.log('Seeding Users...');

    // B. The Company Owner (Now Restored as Super Admin)
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@default.com' },
        update: {
            password: hashedPassword,
            roleId: superAdminRole.id,
            companyId: defaultCompany.id,
        },
        create: {
            email: 'admin@default.com',
            name: 'Super Admin',
            password: hashedPassword,
            roleId: superAdminRole.id,
            companyId: defaultCompany.id,
            status: UserStatus.ACTIVE,
        },
    });
    
    // Alias for old references
    const companyAdmin = superAdmin;

    const supportAdmin = await prisma.user.upsert({
        where: { email: 'support@hrms.com' },
        update: {
            password: hashedPassword,
            roleId: supportAdminRole.id,
            companyId: defaultCompany.id,
        },
        create: {
            email: 'support@hrms.com',
            name: 'Support Lead',
            password: hashedPassword,
            roleId: supportAdminRole.id,
            companyId: defaultCompany.id,
            status: UserStatus.ACTIVE,
        },
    });

    const employee = await prisma.user.upsert({
        where: { email: 'employee@hrms.com' },
        update: {
            password: employeePassword,
            roleId: employeeRole.id,
            companyId: defaultCompany.id,
        },
        create: {
            email: 'employee@hrms.com',
            name: 'John Doe',
            password: employeePassword,
            roleId: employeeRole.id,
            companyId: defaultCompany.id,
            status: UserStatus.ACTIVE,
        },
    });

    // --- CREATE MANAGERIAL TEAMS ---
    console.log('Seeding Managerial Teams...');

    const managerCategories = [
        { name: 'Dev Lead', dept: 'Software Developer', email: 'dev_lead@hrms.com' },
        { name: 'Sales Head', dept: 'Sales Executive', email: 'sales_head@hrms.com' },
    ];

    const managersMap: Record<string, string> = {};

    for (const cat of managerCategories) {
        const password = await bcrypt.hash(`Manager@123`, 10);
        const m = await prisma.user.upsert({
            where: { email: cat.email },
            update: {
                roleId: managerRole.id,
                companyId: defaultCompany.id,
            },
            create: {
                email: cat.email,
                name: cat.name,
                password,
                roleId: managerRole.id,
                companyId: defaultCompany.id,
                status: UserStatus.ACTIVE,
            }
        });
        managersMap[cat.dept] = m.id;
    }

    const hrPassword = await bcrypt.hash('HR@123', 10);

    const hr = await prisma.user.upsert({
        where: { email: 'hr@hrms.com' },
        update: {
            password: hrPassword,
            roleId: hrManagerRole.id,
            companyId: defaultCompany.id,
        },
        create: {
            email: 'hr@hrms.com',
            name: 'Hannah HR',
            password: hrPassword,
            roleId: hrManagerRole.id,
            companyId: defaultCompany.id,
            status: UserStatus.ACTIVE,
        },
    });

    // --- ATTENDANCE DATA ---
    console.log('Seeding attendance data...');
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const clockIn = new Date(date);
        clockIn.setHours(9, 0, 0, 0);
        const clockOut = new Date(date);
        clockOut.setHours(18, 0, 0, 0);

        await prisma.timeEntry.create({
            data: {
                userId: employee.id,
                companyId: defaultCompany.id,
                clockIn,
                clockOut,
                hoursWorked: 9.0,
                clockType: i % 3 === 0 ? 'REMOTE' : 'IN_OFFICE',
                status: 'COMPLETED'
            }
        });
    }

    // --- LEAVE DATA ---
    console.log('Seeding leave requests...');
    await prisma.leaveRequest.create({
        data: {
            userId: employee.id,
            companyId: defaultCompany.id,
            type: 'SICK',
            startDate: new Date(now.getTime() + 86400000 * 2),
            endDate: new Date(now.getTime() + 86400000 * 3),
            reason: 'Feeling unwell',
            status: 'PENDING'
        }
    });

    // --- AUDIT LOGS ---
    console.log('Seeding audit logs...');
    await prisma.auditLog.createMany({
        data: [
            { action: 'USER_ROLE_UPDATE', adminId: companyAdmin.id, targetId: employee.id, details: 'Updated employee permissions', companyId: defaultCompany.id }
        ]
    });

    console.log('Mock activity data seeded successfully for SaaS structure.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
