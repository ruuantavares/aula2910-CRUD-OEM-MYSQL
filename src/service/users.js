import User from "../model/users.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'


const JWT_SEGREDO = "M3uS3GR3D0";
const SALT = 10


class ServiceUser {
  async FindAll() {
    return User.findAll();
  }

  async FindOne(id) {
    //verificar se o index é valido e se for um numero. verificar se ele for menor q o .lenth
    if (!id) {
      throw new Error("Favor informar um ID");
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new Error(`Usuario ${id} não encontrado`);
    }

    return user;
  }

  async Create(nome, email, senha, ativo, permissao) {
    //verificar se o nome é valido
    if (!nome || !email || !senha) {
      throw new Error("Favor preencher todos os campos");
    }

    const senhaCriptografada = await bcrypt.hash(String(senha), SALT)

    await User.create({
      nome,
      email,
      senha: senhaCriptografada,
      ativo,
      permissao
    });
  }

  async Update(id, nome, email, senha, ativo) {
    //verificar se o indexe o nome sao validos e se for um numero. verificar se ele for menor q o .lenth
    if (!id || !nome || !email || !senha) {
      throw new Error("Favor informar um ID");
    }

    const oldUser = await User.findByPk(id);

    if (!oldUser) {
      throw new Error(`Usuario ${id} não encontrado`);
    }

    oldUser.nome = nome
    oldUser.email = email
    oldUser.senha = senha
      ? await bcrypt.hash(String(senha), SALT)
      : oldUser.senha 


    return oldUser.save();
  }

  async Delete(id) {
    //verificar se o index e o nome sao validos e se for um numero. verificar se ele for menor q o .lenth
    if (!id) {
      throw new Error("Favor informar um ID");
    }

    const user = await User.findByPk(id);

    if (!user) {
      throw new Error(`Usuario ${id} não encontrado`);
    }

    return user.destroy();
  }

  async Login(email, senha) {
    if (!email || !senha) {
      throw new Error("Email ou senha inválidos.");
    }
    const user = await User.findOne({ where: { email } });
    if (!user 
      || !(await bcrypt.compare(String(senha), user.senha ))
    ) {
      throw new Error("Email ou senha inválidos.");
    }

    //criar o token
    return jwt.sign({ 
        id: user.id,
         nome: user.nome, permissao: User.permissao },
          JWT_SEGREDO, 
          { expiresIn: 60 * 60,
    });
  }
}

export default new ServiceUser();
