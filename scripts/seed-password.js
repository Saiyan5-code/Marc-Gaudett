const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.siteSettings.upsert({
    where: { key: 'ADMIN_PASSWORD' },
    update: { value: 'admin' },
    create: { key: 'ADMIN_PASSWORD', value: 'admin' },
  });
  console.log('✅ Seeded admin password into SiteSettings:', result);
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
