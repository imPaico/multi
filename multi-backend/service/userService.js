const userRepository = require('../repository/userRepository');

/**
 * estrae tutti gli utenti da db
 */
getUsers = async (npages) => {
    let data = await userRepository.getUsers(npages);
    console.log('userService - data extracted: ' + data);
    return data;
}

/**
 * Metodo che cerca un utente dato un id
 * @param {*} id 
 * @returns 
 */
findById = async (id) => {
    let data = await userRepository.findUserById(id);
    return data
}

module.exports = {
    getUsers,
    findById
};