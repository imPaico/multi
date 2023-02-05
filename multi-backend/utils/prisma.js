const { PrismaClient } = require("@prisma/client")
let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
}
// `stg` or `dev`
else {
    if (!global.prisma) {
        console.log("new prisma client");
        global.prisma = new PrismaClient();
    }

    prisma = global.prisma;
}

module.exports = {
    prisma
}