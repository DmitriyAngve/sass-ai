import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { MAX_FREE_COUNTS } from "@/constants";
import { use } from "react";

export const increaseApiLimit = async () => {
  const { userId } = auth(); // extract the "userId", using "auth"

  if (!userId) {
    // if no have "userId" => break function
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  // если "userApiLimit" уже существует, то к счетчику прибавляем 1
  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 },
    });

    // Или создаем новую
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};
// "findUnique" - проверяю существует ли модель

export const checkApiLimit = async () => {
  const { userId } = auth();

  // false - we are not going allow the user to go any further
  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false; // block the user
  }
};

// Для проверки счетчика Лимитов
export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userApiLimit) {
    return 0;
  }
  return userApiLimit.count;
};
