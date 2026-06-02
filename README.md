# API ICD

Backend para armazenamento de dados dos experimentos realizados pelo app ou script no mongoDB

## Tecnologias

- Node.js
- Express
- MongoDB
- Ngrok

## Pré-requisitos

- Node.js instalado
- MongoDB instalado
- NPM

## Instalação

Clone o repositório:

```bash
git clone https://github.com/FernandoTakao/API_IC.git
```

Entre na pasta:

```bash
cd seu-projeto
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie um arquivo `.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/testeCSV
```

## Executando o projeto

```bash
npm start
```

ou

```bash
node server.js
```

## Rotas da API

### Criar gráfico

**POST** `/charts`

Exemplo de body:

```json
{
  "_id": [1, 2],
  "dataset": "deepweeds",
  "device": "Slow-end"
}
```

Resposta:

```json
{
  "success": true
}
```

## Expondo a API com Ngrok

```bash
ngrok http 3000
```

O Ngrok fornecerá uma URL pública:

```text
https://abc123.ngrok-free.app
```

## Estrutura do Projeto

```text
project/
├── controllers/
├── routes/
├── config/
├── services/
├── server.js
└── package.json
```

## Autor

Fernando Takao Watanabe