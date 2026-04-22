const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient({
  transactionOptions: {
    timeout: 10000,
    maxWait: 5000,
  }
});

const main = async () => {
  const adminPass = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bitbuzz.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@bitbuzz.com',
      passwordHash: adminPass,
      role: 'ADMIN',
      buzzCredits: 100000
    }
  });

  const markets = [
    { title: 'Will Mission Impossible 8 cross $500M worldwide box office?', category: 'Movies' },
    { title: 'Will Avengers: Doomsday break the opening weekend record?', category: 'Movies' },
    { title: 'Will any 2025 Pixar film win Best Animated Feature at Oscars?', category: 'Movies' },
    { title: 'Will a horror film crack the top 5 highest grossing films of 2025?', category: 'Movies' },
    { title: 'Will Taylor Swift release a new album before December 2025?', category: 'Music' },
    { title: 'Will Kendrick Lamar perform at a major award show in 2025?', category: 'Music' },
    { title: 'Will a K-pop group hit #1 on Billboard Hot 100 in 2025?', category: 'Music' },
    { title: 'Will Apple release a foldable iPhone in 2025?', category: 'Tech' },
    { title: 'Will GPT-5 be released to the public before mid-2025?', category: 'Tech' },
    { title: 'Will Tesla Full Self-Driving reach Level 4 autonomy in 2025?', category: 'Tech' },
    { title: 'Will Manchester City win the Premier League 2024/25 season?', category: 'Sports' },
    { title: 'Will LeBron James retire before the 2025-26 NBA season?', category: 'Sports' }
  ];

  for (let i = 0; i < markets.length; i++) {
    const m = markets[i];
    const offsetDays = 30 + (i * 12);
    const closeTime = new Date();
    closeTime.setDate(closeTime.getDate() + offsetDays);
    
    await prisma.market.create({
      data: {
        title: m.title,
        category: m.category,
        closeTime: closeTime,
        createdById: admin.id,
        pool: {
          create: {
            yesShares: 50,
            noShares: 50,
            liquidityConstant: 100
          }
        }
      }
    });
  }
};

main()
  .catch(e => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
