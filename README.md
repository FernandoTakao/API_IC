# API ICD

Backend para armazenamento e gerenciamento de experimentos executados por aplicações e scripts, utilizando Next.js, Node.js e MongoDB.

## Tecnologias

- Next.js (App Router)
- Node.js
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
MONGO_URI=mongodb://localhost:27017/testeCSV
JWT_SECRET=seu_segredo_jwt
```

## Executando o projeto

```bash
npm run dev
```

Para executar a versão de produção:

```bash
npm run build
npm start
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

`charts` e `filters` são opcionais. Sem `charts`, a API retorna todos os gráficos; sem `filters`, retorna todos os registros do usuário autenticado. Para gráficos mobile, a resposta é um objeto `{ "charts", "data" }`; para gráficos de predição, é `{ "charts", "data", "mobile_data" }` quando houver Pareto. Ao solicitar os dois grupos, a resposta é uma lista com as duas mensagens.

Resposta:

```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": [...]
}
```
### Recuperação de senha

**POST** `/api/auth/forgot-password`
Exemplo de body:

```json
{
  "emailInstitucional": "fernando@universidade.edu"
}
```

### Resetar senha

**POST** `api/auth/reset-password`
Exemplo de body:

```json
{
  "senha": "NovaSenha123",
  "token": [...]
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

Um experimento vazio será criado com esta chave contendo duas listas independentes:
execucoesScript
execucoesMobile
Utilize uma das rotas PATCH abaixo para enviar as execuções correspondentes ao tipo de experimento.

### Listar meus experimentos com todas a informações

**GET** `/api/experimentos`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

### Listar meus experimentos com as informações essenciais

**GET** `/api/experimentos/info`

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
    "qtdMobile": 200,
    "qtdScript": 200,
    "createdAt": 2026-07-09T17:53:52.940+00:00,
    "updatedAt": 2026-07-09T17:53:52.940+00:00,
  },
  {
    "_id": "Ef56Gh78",
    "modelo": "ResNet50",
    "dataset": "ImageNet",
    "dispositivo": "RTX 3090",
    "qtdMobile": 200,
    "qtdScript": 200,
    "createdAt": 2026-07-09T17:53:52.940+00:00,
    "updatedAt": 2026-07-09T17:53:52.940+00:00,
  },
  {
    "_id": "Ij90Kl12",
    "modelo": "MobileNet",
    "dataset": "CIFAR-10",
    "dispositivo": "Jetson Nano",
    "qtdMobile": 200,
    "qtdScript": 200,
    "createdAt": 2026-07-09T17:53:52.940+00:00,
    "updatedAt": 2026-07-09T17:53:52.940+00:00,
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

### Atualizar experimento com os dados do Mobile

**PATCH** `/api/experimentos/:id/performance`

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

### Atualizar experimento com os dados do Script

**PATCH** `/api/experimentos/:id/aiMetrics`

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
      "dataset": "deepweeds",
      "modelo": "resnet50",
      "fold": 1,
      "y_true_idx": 8,
      "y_pred_idx": 8,
      "correct": 1,
      "pred_confidence": 0.9999825,
      "prob_class_0": 9.516573e-14,
      "prob_class_1": 3.491989e-10,
      "prob_class_2": 4.1936277e-20,
      "prob_class_3": 4.750078e-10,
      "prob_class_4": 1.0527873e-18,
      "prob_class_5": 0.000017577197,
      "prob_class_6": 6.139137e-10,
      "prob_class_7": 2.54979e-13,
      "prob_class_8": 0.9999825,
      "filename": "/home/leo/Documentos/mestrado/DeepWeeds-Mobile/images/deepweeds/201712…"
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

### Gerar gráficos

**POST** `/api/charts`

Requer autenticação

Header:

```http
Authorization: Bearer <token>
```

Exemplo de body:

```json
{
  "charts": ["chart1", "chart2", "chart_metrics", "chart_pareto"],
  "filters": {
    "_id": ["exp1", "exp2"],
    "modelo": "resnet18",
    "dataset": "deepweeds",
    "device": "SM-S908E"
  }
}
```

Resposta:

```json
[
  {
    "charts": ["chart1", "chart2"],
    "data": [
      {
        "experimento_id": "exp1",
        "modelo": "resnet18",
        "dataset": "deepweeds",
        "device": "SM-S908E",
        "inference_time": 2033.7
      }
    ]
  },
  {
    "charts": ["chart_metrics", "chart_pareto"],
    "data": [
      {
        "experimento_id": "exp1",
        "modelo": "resnet18",
        "dataset": "deepweeds",
        "fold": 1,
        "y_true_idx": 3,
        "y_pred_idx": 3
      }
    ],
    "mobile_data": [
      {
        "experimento_id": "exp1",
        "modelo": "resnet18",
        "dataset": "deepweeds",
        "device": "SM-S908E",
        "inference_time": 2033.7
      }
    ]
  }
]
```

## Rotas Protegidas

As seguintes rotas exigem autenticação JWT:

- POST `/api/experimentos/chaves`
- GET `/api/experimentos/:id`
- GET `/api/experimentos/:id/colunas`
- PATCH `/api/experimentos/:id/performance`
- PATCH `/api/experimentos/:id/aiMetrics`
- DELETE `/api/experimentos/:id`
- GET `/api/experimentos`
- GET `/api/experimentos/info`
- POST `/api/charts`

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
├── app/
│   └── api/
├── config/
├── controllers/
├── lib/
├── scripts/
├── proxy.js
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
7. Gerar graficos.

---

## Autor

Fernando Takao Watanabe
