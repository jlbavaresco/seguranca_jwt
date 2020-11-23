const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const ola = (request, response, next) => {
    response.status(200).json("Seja bem vindo a Segurança com JWT")
}

const dados = (request, response, next) => {
    const lista = [{ id: 1, nome: 'luiz' }, { id: 2, nome: 'jorge' }]
    response.status(200).json(lista)
}

const login = (request, response, next) => {
    if (request.body.user === 'jorge' && request.body.password === '123') {
        //acertou usuário e senha
        const id = 1; //esse id viria do banco de dados
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 300 // expira em 5 minutos
        });
        return response.json({ auth: true, token: token });
    }
    request.status(500).json({ message: 'Login inválido!' });
}



function verificaJWT(request, response, next){
    const token = request.headers['x-access-token'];
    if (!token) return response.status(401).json({ auth: false, message: 'Nenhum token recebido.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return response.status(500).json({ auth: false, message: 'Erro ao autenticar o token.' });
      
      // Se o token for válido, salva no request para uso posterior
      request.userId = decoded.id;
      next();
    });
}

app
    .route("/ola")
    .get(verificaJWT, ola)

app
    .route("/dados")
    .get(verificaJWT,dados)

app
    .route("/login")
    .post(login)    
    

app.listen(3000, () => {
    console.log("Servidor rodando.....")
}) 