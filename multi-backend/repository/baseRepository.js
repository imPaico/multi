const connection = require('mysql2-promise')();
const config = require('../config');

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}

/**
 * se non vengono estratti dati da db, restituisce una lista vuota
 * @param {*} rows 
 * @returns 
 */
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

/**
 * Funzione di creazione al database utilizzando il file config.js
 * @param {*} sql 
 * @param {*} params 
 * @returns 
 */
async function query(sql, params) {
    connection.configure(config.db);

    const results = connection
    .query(sql, [params])
    .then((rows) => {
        return rows;
    })
    .spread(function (rows) {
        console.log('call was successful', rows);
    });
    //console.table('baseRepository: '+ results);
  return results;
}

module.exports = {
  query,
  getOffset,
  emptyOrRows
}

