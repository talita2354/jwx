const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = 'minha_chave_secreta';

// Função que lista as principais JWT claims com suas definições
const jwtClaims = [
    { claim: 'iss', definition: 'Issuer - Identifica quem emitiu o token' },
    { claim: 'sub', definition: 'Subject - Identifica o assunto do token' },
    { claim: 'aud', definition: 'Audience - Identifica os destinatários para quem o token é destinado' },
    { claim: 'exp', definition: 'Expiration Time - Data de expiração do token' },
    { claim: 'nbf', definition: 'Not Before - Define a partir de quando o token pode ser aceito' },
    { claim: 'iat', definition: 'Issued At - Momento em que o token foi emitido' },
    { claim: 'jti', definition: 'JWT ID - Um identificador único para o token' }
  ];
  
  // Rota para listar as JWT Claims
  app.get('/jwt/claims', (req, res) => {
    res.json(jwtClaims);
  });
  

// Rota para gerar um JWT com `jti`, `iat` e `exp`
app.post('/jwt/tokenid', (req, res) => {
  const token = jwt.sign(
    {
      jti: Math.floor(Math.random() * 1000000), // ID único gerado aleatoriamente
      iat: Math.floor(Date.now() / 1000), // Data de criação do token (em segundos)
      exp: Math.floor(Date.now() / 1000) + 60 * 60 // Token expira em 1 hora
    },
    SECRET_KEY
  );

  res.json({ token });
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
