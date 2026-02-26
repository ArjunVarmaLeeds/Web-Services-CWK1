import { prisma } from "../src/config/db.js";

beforeEach(async () => {
    await prisma.$transaction([
        prisma.battle.deleteMany(),
        prisma.playerCard.deleteMany(),
        prisma.playerDeck.deleteMany(),
        prisma.player.deleteMany(),
        prisma.card.deleteMany(),
        prisma.user.deleteMany(),
    ]);
});

afterAll(async () => {
    await prisma.$disconnect();
});