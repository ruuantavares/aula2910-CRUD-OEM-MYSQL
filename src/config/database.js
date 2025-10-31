import { Sequelize } from 'sequelize'

class database {
    constructor() {
        this.init()
    }


    init() {
        this.db = new Sequelize({
            database: "exemplo",
            host: 'localhost',
            username: 'root',
            password: '',
            dialect: 'mysql'
        })
    }
}

export default new database