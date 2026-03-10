const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось получить пользователей" });
  }
});

module.exports = router;
