const { PrismaClient } = require("@prisma/client")

async function getUsers(page = 1){
  try {
      const prisma = new PrismaClient();
      const results = await prisma.user.findMany();
      return results;
  } catch (error) {
      console.error('userRepository Error:' + error);
  }
}

async function findUserById(id){
  let _id = parseInt(id);
  try {
      const prisma = new PrismaClient();
      const results = await prisma.user.findUnique({
        where: {
          id_user: _id,
        },
      });
      return results;
  } catch (error) {
      console.error('userRepository Error:' + error);
  }
}

module.exports = {
  getUsers,
  findUserById
}