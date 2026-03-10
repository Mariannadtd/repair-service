const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
require("dotenv").config();

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.request.deleteMany();
  await prisma.user.deleteMany();

  const dispatcher = await prisma.user.create({
    data: {
      name: "dispatcher",
      role: "dispatcher",
    },
  });

  const master1 = await prisma.user.create({
    data: {
      name: "master1",
      role: "master",
    },
  });

  const master2 = await prisma.user.create({
    data: {
      name: "master2",
      role: "master",
    },
  });

  await prisma.request.createMany({
    data: [
      {
        clientName: "Иван Петров",
        phone: "+7 900 111-11-11",
        address: "ул. Ленина, 1",
        problemText: "Не работает розетка",
        status: "new",
      },
      {
        clientName: "Мария Соколова",
        phone: "+7 900 222-22-22",
        address: "ул. Садовая, 10",
        problemText: "Протекает кран",
        status: "assigned",
        assignedToId: master1.id,
      },
      {
        clientName: "Олег Смирнов",
        phone: "+7 900 333-33-33",
        address: "пр. Мира, 5",
        problemText: "Сломан выключатель",
        status: "in_progress",
        assignedToId: master2.id,
      },
    ],
  });

  console.log("Seed completed");
  console.log({ dispatcher, master1, master2 });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
