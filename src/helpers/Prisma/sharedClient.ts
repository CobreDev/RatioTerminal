import { PrismaClient } from "@prisma/client";
import signale from 'signale';

let sharedPrismaClient: PrismaClient;
export const createSharedPrismaClient = async () => {
	sharedPrismaClient = new PrismaClient();
	signale.success("Launched shared Prisma Client")
}

export { sharedPrismaClient };