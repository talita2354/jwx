// Importa os módulos necessários
const express = require('express'); // Framework web para criar o servidor
const jwt = require('jsonwebtoken'); // Módulo para geração e verificação de JWTs (tokens de autenticação)
const bodyParser = require('body-parser'); // Middleware para processar o corpo da requisição (JSON)

const app = express(); // Inicializa o aplicativo Express
const PORT = 3000; // Define a porta onde o servidor irá rodar
const SECRET_KEY = 'minhachave-secreta'; // Chave secreta usada para assinar o token JWT

// Configura o body-parser para interpretar o conteúdo das requisições no formato JSON
app.use(bodyParser.json());

// Dados fictícios de exemplo para simular uma base de usuários
const users = [
    { usuario: 'usuario1', senha: 'senha123' }, // Exemplo de usuário 1
    { usuario: 'usuario2', senha: 'senha456' }  // Exemplo de usuário 2
];

// Rota POST /auth/login: Autentica o usuário e retorna um JWT (token de autenticação)
app.post('/auth/login', (req, res) => {
    const { usuario, senha } = req.body; // Extrai as credenciais (usuário e senha) do corpo da requisição
    
    // Verifica se o usuário existe na lista de usuários fictícios
    const user = users.find(u => u.usuario === usuario && u.senha === senha);
    
    if (user) {
        // Se o usuário for encontrado, gera um token JWT com o nome de usuário e a chave secreta
        // O token expira em 1 hora
        const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token }); // Retorna o token como resposta no formato JSON
    } else {
        // Se o usuário ou a senha forem inválidos, retorna uma resposta de erro 401 (não autorizado)
        return res.status(401).json({ mensagem: 'Usuário ou senha incorretos' });
    }
});

// Middleware para proteger rotas, verifica se o token JWT é válido
const autenticarToken = (req, res, next) => {
    // Extrai o token do cabeçalho "Authorization" da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // O token deve vir após a palavra "Bearer"

    if (token == null) return res.sendStatus(401); // Se não houver token, retorna erro 401 (não autorizado)

    // Verifica se o token é válido usando a chave secreta
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token for inválido ou expirado, retorna erro 403 (proibido)
        req.user = user; // Se o token for válido, armazena as informações do usuário na requisição
        next(); // Continua para o próximo middleware ou rota
    });
};

// Rota GET /produtos: Retorna uma lista de produtos, protegida por autenticação JWT
app.get('/produtos', autenticarToken, (req, res) => {
    // Lista de produtos fictícia para ser retornada na resposta
    const produtos = [
        { id: 1, nome: 'escova de dente', preco: '10.00' },
        { id: 2, nome: 'shampoo', preco: '40.00' }
    ];
    res.json({ produtos }); // Retorna a lista de produtos no formato JSON
});

// Inicia o servidor e faz com que ele escute na porta definida (3000)
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); // Mensagem de log para indicar que o servidor está ativo
});
