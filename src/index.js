import express from 'express'
import router from './router/users.js'
import database from './config/database.js';

const app = express();

app.use(express.json())
app.use('/api/v1', router)

database.db
    .sync({ force: false })
    .then((_) => {
        app.listen(port, () => {
            console.info('Servidor rodando na porta ' + port)
        })
    })

const port = 3000

