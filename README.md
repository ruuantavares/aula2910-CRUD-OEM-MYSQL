# Banco de dados

## acessa o banco

```sql
mysql -Nome_do_usuario -p
```

## Exibe os bancos de dados criados

```sql
show databases;
```

## Utilizar um banco

```sql
use nome_do_banco
```

## Criar um novo banco

```sql
create database nome_do_banco
```

## Criar tabelas

```sql
create table nome_da_tabela(
	id INT NOT NULL PRIMARY KET AUTO_INCREMENT,
	nome VARCHAR(60) NOT NULL,
	login VARCHAR(100) NOT NULL UNIQUE,
	email VARCHAR(100) NOT NULL,
)
```

## Ver as tabelas criadas

SHOW TABLES;

## Ver as colunas de uma tabela

```sql
DESCRIBE nome_da_tabela;
```

## LISTAR os conteudos de uma tabela

```sql
SELECT * FROM nome_da_tabela;
SELECT * FROM nome_da_tabela WHERE id = 12345;
```

## EXCLUIR pelo id

```sql
DELETE FROM nome_da_tabela WHERE id = 1235;
```

## ATUALIZAR pelo id

```sql
UPDATE nome_da_tabela SET nome_coluna_1 = "valor", nome_coluna_2 = 45645 WHERE id = 12345
```

## INSERIR um novo registro

```sql
INSERT INTO nome_da_tabela (coluna1, coluna2, coluna3) values ('texto', 123456, '44564')
```

## Sair de dentro do servidor do banco
exit

## Backup do banco

No nome do arquivo backup, colocamos a data e hora em que o mesmo foi realizado e o nome do banco

```bash
mysqldump -unome_do_usuario -p nome_do_banco > nome_do_backup.sql

# Exemplo
mysqldump -uroot -p loja > 2025_10_31_20_32_loja.sql
```

## RESTAURAÇÃO DO BACKUP
```sql
('sudo' se precisar) mysql -uroot -p loja < 2025_10_31_20_47_57_loja.sql
```

## Automatizar o backup no servidor
```sql
agendador de tarefas do linux (https://crontab.guru/)

entrar na pasta do backup
    - pwd
    - crontab -e 

escolher a opcao que tiver o /bin/nano
cola o script do crontab.guru (*/1 * * * *)
coloca o caminho do programa que executa o script (/home/senac/backups_banco/backup_loja.sh)

# exemplo 

periodo       caminho                                script
*/1 * * * * /usr/bin/bash /home/senac/backups_banco/backup_loja.sh

para assistir o script rodando no tempo programado (*/1 * * * *   a cada 1 minuto)

- watch -n 1 'ls -lh'

```

## Criar script bash
```sql
Criar um arquivo backup_nome_loja.sh
dentro:

    #!/bin/bash
    #/home/senac/backups_loja.sh
    #*/1 * * * * /usr/bin/bash /home/senac/backups_banco/backup_loja.sh
    TIMESTAMP=$(date +%Y_%m_%d_%H_%M_%S)
    PATH="/home/senac/backups_banco"
    ARQUIVO_BACKUP="${PATH}/${TIMESTAMP}_loja.sql"

    # achar o caminho completo do executavel: type -p mysqldump

    /usr/bin/mysqldump -uroot -p123456 loja > $ARQUIVO_BACKUP

    # dar permissão de execução: chmod +x nome_do_arquivo.sh

para rodar o script

ls -la
```

## EXEMPLO ======================================================================================================================================================================================================
```sql
create database loja;
```

```sql
create table produto(
    id int not null primary key auto_increment,
    nome varchar(100) not null,
    marca varchar(100) not null,
    peso decimal(4,2) not null
);
```

```sql
INSERT INTO produto (nome, marca, peso) values ('tenis', 'topper', 30.0), ('tenis', 'nike', 40.0), ('chinelo', 'havaianas', 20.0), ('chinelo', 'senninha', 20.0), ('tv', 'cce', 50.0), ('tv', 'tcl', 60.0);
```

```sql
Exit
```

```sql
mkdir backups_banco
```

```sql
cd backups_banco
```

```sql
('sudo' se precisar) mysqldump -uroot -p loja > 2025_10_31_20_32_loja.sql
```

```sql
Atalho para salvar backup com o ano,mes,dia,hora e segundos com o _nome_loja.sql

('sudo' se precisar) mysqldump -uroot -p loja > $(date +%Y_%m_%d_%H_%M_%S)_loja.sql
```

```sql
para remover o banco de dados loja

('sudo' se precisar) mysql -uroot -p

drop database loja;
```

```sql
Restaurando backup

criar o banco novamente

create dabatase loja;

use loja;

show tables;

exit

ls -lh    (para ver os backups)

('sudo' se precisar) mysql -uroot -p loja < 2025_10_31_20_47_57_loja.sql   (selecionando o backup mais recente, clica 2 vezes com o botao direito para ele copiar e colar)
```

===========================================================================================================
#Middlaware  (aula sobre autenticação 10/11/25)

npm i jsonwebtoken
npm i jsonwebtoken bcrypt

-criar pasta middleware, dentro do src
    -auth.js

===========================================================================================================    
No auth.js
    import jwt from 'jsonwebtoken'

const JWT_SEGREDO = "M3uS3GR3D0"

export default function authMiddleware(req, res, next) {
  try {
    const token = req.headers["authorization"];
    

    if (!token) {
      throw new Error("Você não tem permissão para realizar essa ação");
    }

    const decoded = jwt.verify(token.split(' ')[1], JWT_SEGREDO)

    console.log(decoded)
    //se der certo
    next();
    //se der errado
  } catch (erro) {
    console.log("Entrou nessa merda");
    res.status(403).send({
      data: null,
      msg: erro.message,
      error: true,
    });
  }
}

===================
No controller

  async Login(req, res) {
    try {
      const { email, senha } = req.body;
      const token = await ServiceUser.Login(email, senha);
      res.status(200).send({ token });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
==========================
No service

async Login(email, senha) {
    if (!email || !senha) {
      throw new Error("Email ou senha inválidos.");
    }
    const user = await User.findOne({ where: { email } });
    if (!user || user.senha !== senha) {
      throw new Error("Email ou senha inválidos.");
    }

    //criar o token
    return jwt.sign({ id: user.id, nome: user.nome }, JWT_SEGREDO, {
      expiresIn: 60 * 60,
    });
  }
==========================================================
No router

import express from "express"
import ControllerUser from "../controller/users.js"
import authMiddleware from "../middleware/auth.js"      ---- novo

const router = express.Router()

//  api/v1
router.post('/login', ControllerUser.Login)      ---novo

router.get("/users", authMiddleware, ControllerUser.FindAll) //pegar todos
router.get("/user/:id", authMiddleware, ControllerUser.FindOne) //pegar um
router.post("/user", ControllerUser.Create) //cadastrar um
router.put("/user/:id", authMiddleware, ControllerUser.Update) //alterar um
router.delete("/user/:id", authMiddleware, ControllerUser.Delete) // deletar um

export default router

====================================================================================