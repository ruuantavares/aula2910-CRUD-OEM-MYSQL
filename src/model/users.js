import database from "../config/database.js"

class User {
    constructor() {
        this.model = database.db.define('users', {
            id: {
                type: database.db.Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true 
            },
            nome: {
                type: database.db.Sequelize.STRING,
            },
            email: {
                type: database.db.Sequelize.STRING,
                unique: true,
            },

            senha: {
                type: database.db.Sequelize.STRING,
            },
            ativo: {
                type: database.db.Sequelize.STRING,
            },
        })
    }
}

export default new User().model