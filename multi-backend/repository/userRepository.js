const baseRepository = require('./baseRepository');
const config = require('../config');

async function getUsers(page = 1){
  //determina offset di pagine da estrarre
  const offset = baseRepository.getOffset(page, config.listPerPage);
  //query
  const rows = await baseRepository.query(
    `SELECT id_user, name
    FROM user LIMIT ${offset},${config.listPerPage}`
  );

  //const data = baseRepository.emptyOrRows(rows);
  console.log('userRepository:' + rows);
  return rows;
  
}

module.exports = {
  getUsers
}