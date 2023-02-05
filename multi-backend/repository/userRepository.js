const baseRepository = require('./baseRepository');
const config = require('../config');
const { PrismaClient } = require("@prisma/client")

async function getUsers(page = 1){
  try {
      const prisma = new PrismaClient();
      console.log(prisma.user);
      const results = await prisma.user.findMany();
      return results;
  } catch (error) {
      console.error('userRepository Error:' + error);
      //return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getUsers
}