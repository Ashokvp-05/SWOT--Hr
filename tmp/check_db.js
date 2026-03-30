const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: { users: true, roles: true, tickets: true }
        },
        users: {
          select: { id: true, status: true },
        },
        plan: {
          select: { name: true, price: true }
        }
      }
    });
    console.log("Companies:", JSON.stringify(companies, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
