const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

function getUserId(req) {
  const raw = req.headers["x-user-id"];
  const userId = Number(raw);
  return Number.isNaN(userId) ? null : userId;
}

async function getCurrentUser(req) {
  const userId = getUserId(req);
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
  });
}

router.post("/requests", async (req, res) => {
  try {
    const { clientName, phone, address, problemText } = req.body;

    if (!clientName || !phone || !address || !problemText) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const created = await prisma.request.create({
      data: {
        clientName,
        phone,
        address,
        problemText,
        status: "new",
      },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось создать заявку" });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось получить заявки" });
  }
});

router.get("/me/requests", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "master") {
      return res.status(403).json({ message: "Доступ только для мастера" });
    }

    const requests = await prisma.request.findMany({
      where: {
        assignedToId: user.id,
      },
      include: {
        assignedTo: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось получить заявки мастера" });
  }
});

router.patch("/requests/:id/assign", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "dispatcher") {
      return res
        .status(403)
        .json({ message: "Назначать мастера может только диспетчер" });
    }

    const requestId = Number(req.params.id);
    const masterId = Number(req.body?.masterId);

    if (!masterId) {
      return res.status(400).json({ message: "masterId обязателен" });
    }

    const master = await prisma.user.findUnique({
      where: { id: masterId },
    });

    if (!master || master.role !== "master") {
      return res.status(400).json({ message: "Указан некорректный мастер" });
    }

    const result = await prisma.request.updateMany({
      where: {
        id: requestId,
        status: "new",
      },
      data: {
        assignedToId: masterId,
        status: "assigned",
      },
    });

    if (result.count === 0) {
      return res
        .status(409)
        .json({ message: "Назначить можно только новую заявку" });
    }

    const updated = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        assignedTo: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("ASSIGN ERROR:", error);
    res.status(500).json({ message: "Не удалось назначить мастера" });
  }
});

router.patch("/requests/:id/cancel", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "dispatcher") {
      return res
        .status(403)
        .json({ message: "Отменять заявку может только диспетчер" });
    }

    const requestId = Number(req.params.id);

    const existing = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    if (!["new", "assigned"].includes(existing.status)) {
      return res
        .status(409)
        .json({
          message: "Отменить можно только новую или назначенную заявку",
        });
    }

    const updated = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "canceled",
      },
      include: {
        assignedTo: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось отменить заявку" });
  }
});

router.patch("/requests/:id/take", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "master") {
      return res
        .status(403)
        .json({ message: "Взять заявку в работу может только мастер" });
    }

    const requestId = Number(req.params.id);

    const result = await prisma.request.updateMany({
      where: {
        id: requestId,
        status: "assigned",
        assignedToId: user.id,
      },
      data: {
        status: "in_progress",
      },
    });

    if (result.count === 0) {
      return res.status(409).json({
        message:
          "Заявка уже взята, недоступна или не назначена текущему мастеру",
      });
    }

    const updated = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        assignedTo: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось взять заявку в работу" });
  }
});

router.patch("/requests/:id/complete", async (req, res) => {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    if (user.role !== "master") {
      return res
        .status(403)
        .json({ message: "Завершить заявку может только мастер" });
    }

    const requestId = Number(req.params.id);

    const existing = await prisma.request.findFirst({
      where: {
        id: requestId,
        assignedToId: user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Заявка не найдена" });
    }

    if (existing.status !== "in_progress") {
      return res
        .status(409)
        .json({ message: "Завершить можно только заявку в работе" });
    }

    const updated = await prisma.request.update({
      where: { id: requestId },
      data: {
        status: "done",
      },
      include: {
        assignedTo: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Не удалось завершить заявку" });
  }
});

module.exports = router;
