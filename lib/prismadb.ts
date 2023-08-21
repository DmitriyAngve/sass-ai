import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismabd = globalThis.prisma || new PrismaClient(); // создаю новую переменную, проверяя если ли уже экземпляр "PrismaClient" в глобальном контексте "globalThis.prisma". Если он существует, то используется существующий экземпляр, если нет, то создается новый экземпляр "PrismaClient"
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismabd; // Это условие проверяет, что приложение работает в продуктовом режиме. Если это так, то вы устанавливаете глобальную переменную "prisma" равной "prismabd". Это необходимо, чтобы в разрабоке каждый запрос к БД создавал новый экземпляр "PrismaClient". В продуктовом используется один и тот же экземпляр "PrismaClient"

export default prismabd;
