const userRepository = require('../repository/userRepository');

/**
 * estrae gli utenti da db
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
findById = (id) => {
    var users = [
        {
            id: '1',
            name: 'Andrea'
        },
        {
            id: '2',
            name: 'PJ'
        }
    ]
    return users.find(user => user.id == id);
}

module.exports = {
    getUsers,
    findById
};