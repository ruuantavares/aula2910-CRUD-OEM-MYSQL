import User from '../model/users.js'

class ServiceUser {
    async FindAll() {
        return User.findAll()
    }

    async FindOne(id) {
        //verificar se o index é valido e se for um numero. verificar se ele for menor q o .lenth
        if (!id) {
            throw new Error('Favor informar um ID')

        }

        const user = await User.findByPk(id)

        if (!user) {
            throw new Error(`Usuario ${id} não encontrado`)
        }

        return user
    }

    async Create(nome, email, senha, ativo) {
        //verificar se o nome é valido
        if (!nome || !email || !senha) {
            throw new Error('Favor preencher todos os campos')
        }
        await User.create({
            nome, email, senha, ativo
        })
    }

    async Update(id, nome, email, senha, ativo) {
        //verificar se o indexe o nome sao validos e se for um numero. verificar se ele for menor q o .lenth
        if (!id || !nome || !email || !senha) {
            throw new Error('Favor informar um ID')

        }

        const user = await User.findByPk(id)

        if (!user) {
            throw new Error(`Usuario ${id} não encontrado`)
        }

        user.nome = nome
        user.email = email
        user.senha = senha

        return user.save()
    }

    async Delete(id) {
        //verificar se o index e o nome sao validos e se for um numero. verificar se ele for menor q o .lenth
        if (!id) {
            throw new Error('Favor informar um ID')

        }

        const user = await User.findByPk(id)

        if (!user) {
            throw new Error(`Usuario ${id} não encontrado`)
        }

        return user.destroy(id)
    }
}

export default new ServiceUser()