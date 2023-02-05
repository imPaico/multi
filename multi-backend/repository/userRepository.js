const { PrismaClient } = require("@prisma/client")

async function getUsers(page = 1){
  try {
      const prisma = new PrismaClient();
      const results = await prisma.user.findMany();
      console.log(results);
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

async function findUserEmailAndPassword(email, password){
  let _id = parseInt(id);
  try {
      const prisma = new PrismaClient();
      const results = await prisma.user.findUnique({
        where: {
          email: email,
          password: password
        },
      });
      return results;
  } catch (error) {
      console.error('userRepository Error:' + error);
  }
}

async function saveUser(user) {
  try {
    const prisma = new PrismaClient();
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: user.password
      },
    })
    console.log('userRepository - user saved:' + createdUser)
    return createdUser;
  } catch(error) {
    console.error('userRepository - saveUser Error:' + error);
  }
}

module.exports = {
  getUsers,
  findUserById,
  saveUser,
  findUserEmailAndPassword
}