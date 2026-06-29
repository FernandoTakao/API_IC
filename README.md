edite este documento read me # API ICD

Backend para armazenamento e gerenciamento de experimentos executados por aplicações e scripts, utilizando Node.js, Express e MongoDB.

## Tecnologias

- Node.js
- Express
- MongoDB
- JWT (JSON Web Token)
- Ngrok

## Pré-requisitos

- Node.js
- MongoDB
- NPM

## Instalação

Clone o repositório:

```bash
git clone https://github.com/FernandoTakao/API_IC.git
```

Entre na pasta do projeto:

```bash
cd API_IC
```

Instale as dependências:

```bash
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/testeCSV
JWT_SECRET=seu_segredo_jwt
```

## Executando o projeto

```bash
npm start
```

ou

```bash
node server.js
```

---

## Autenticação

A API utiliza JWT para proteger determinadas rotas.

Após realizar login, envie o token no header da requisição:

```http
Authorization: Bearer <token>
```

---

## Endpoints

### Verificar servidor

**GET** `/`

Resposta:

```text
Servidor funcionando
```

---

## Usuários

### Criar usuário

**POST** `/api/users`

Exemplo de body:

```json
{
  "nomeCompleto": "Fernando Takao Watanabe",
  "emailInstitucional": "fernando.watanabe@alunos.utfpr.edu.br",
  "instituicao": "Universidade Tecnologica Federal do Parana,
  "laboratorio": "LABIC",
  "senha": "MinhaSenha123"
}
```

### Atualizar usuário

**PATCH** `/api/users/:id`
Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

### Remover usuário

**DELETE** `/api/users/:id`
Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

---

## Autenticação

### Login

**POST** `/api/auth/login`

Exemplo de body:

```json
{
  "emailInstitucional": "fernando@universidade.edu",
  "senha": "123456"
}
```

Resposta:

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": [...]
}
```

---

## Experimentos

### Gerar chave de experimento

**POST** `/api/experimentos/chaves`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

Resposta:

```json
{
    "message": "Experimento criado com sucesso",
    "id": "HHgWQ9qI",
    "createdAt": "2026-06-24T20:01:58.412Z"
}
```

Um experimento vazio será criado com esta chave, com isto, utilize a endpoint PATCH para adicionar os novos dados


### Listar meus experimentos com todas a informações

**GET** `/api/experimentos/meus-experimentos`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

### Listar meus experimentos com as informações essenciais

**GET** `/api/experimentos/meus-experimentos/info`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```
Resposta:

```json
[
  {
    "_id": "Ab12Cd34",
    "modelo": "YOLOv8",
    "dataset": "COCO",
    "dispositivo": "RTX 4060"
  },
  {
    "_id": "Ef56Gh78",
    "modelo": "ResNet50",
    "dataset": "ImageNet",
    "dispositivo": "RTX 3090"
  },
  {
    "_id": "Ij90Kl12",
    "modelo": "MobileNet",
    "dataset": "CIFAR-10",
    "dispositivo": "Jetson Nano"
  }
]
```

### Buscar experimento por Key

**GET** `/api/experimentos/:id`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

### Obter colunas disponíveis de um experimento

**GET** `/api/experimentos/:id/colunas`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

### Atualizar experimento

**PATCH** `/api/experimentos/:id`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

Exemplo de body:

```json
{
  "execucoes": [
    {
      "modelo": "efficientnetv2b0",
      "dataset": "deepweeds",
      "fold": 1,
      "device": "Slow-end",
      "rep": 0,
      "inference_time": 361.08377,
      "pss_baseline": 71.3623046875,
      "pss_after_load": 128.546875,
      "pss_warmup": 137.1376953125,
      "pss_footprint": 137.22754,
      "pss_peak": 137.22754,
      "brightness_pct": 0,
      "battery_pct": 99,
      "is_charging": "YES",
      "airplane_mode": "ON"
    }
  ]
}
```

### Remover experimento

**DELETE** `/api/experimentos/:id`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

---

## Relatórios

### Gerar relatório CSV e gráficos

**POST** `/api/charts`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

Exemplo de body:

```json
{
  "charts": ["chart1", "chart2", "chart3", "chart4"],
  "filters": {
    "dataset": "deepweeds",
    "device": "Slow-end"
  }
}
```

Resposta:

```json
{
  {"chart1": "base64",
  "chart2": "base64",
  "chart3": "base64",
  "chart4": "base64"
}
}
```

### Download de relatório CSV

**GET** `/api/charts/download/:file`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

---

## Rotas Protegidas

As seguintes rotas exigem autenticação JWT:

* POST `/api/chaves`
* GET `/api/experimentos/:id`
* GET `/api/experimentos/:id/colunas`
* PATCH `/api/experimentos/:id`
* DELETE `/api/experimentos/:id`
* GET `/api/experimentos/meus-experimentos`
* POST `/api/charts`
* GET `/api/charts/download/:file`

Header obrigatório:

```http
Authorization: Bearer <token>
```

---

## Expondo a API com Ngrok

```bash
ngrok http 3000
```

O Ngrok fornecerá uma URL pública semelhante a:

```text
https://abc123.ngrok-free.app
```

---

## Estrutura do Projeto

```text
project/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── scripts/
├── app.js
├── server.js
├── package.json
└── .env
```

---

## Fluxo de Utilização

1. Criar um usuário.
2. Realizar login.
3. Receber um token JWT.
4. Gerar uma chave de experimento e criar um experimento vazio com a chave automaticamente.
5. Adicionar dados no experimento criado.
6. Consultar ou atualizar experimentos.
7. Gerar e baixar relatórios CSV.

---

## Autor

Fernando Takao Watanabe
