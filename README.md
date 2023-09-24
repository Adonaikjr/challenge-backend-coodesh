
## Coodesh Backend Challenge 20230105 

O projeto visa otimizar a importação diária de grandes volumes de dados em formato JSON através do uso de streams, processando e armazenando os produtos em uma coleção no MongoDB Atlas. Em seguida, realiza a filtragem e adição de campos em uma segunda coleção chamada "product", permitindo operações CRUD por meio de endpoints e a execução de testes unitários para garantir o funcionamento correto.





## Stack utilizada

**Back-end:** Node, Express, TypeScript, Jest, Eslint, Supertest, Tsup, node-cron, zod, mongodb,  mongoose, dotenv, axios


## Instalação

Faça o clone do projeto

```bash
  cd challenge-backend-coodesh
  npm install
  npm run dev
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env, existe um arquivo .env.exemple

`DATABASE_URL`

`PORT`

`DATABASE_NAME`

`COLLECTION_STREAM`

`COLLECTION_PRODUCT`

## Stream importante
Após esses passos chame a seguinte rota: localhost:3000/product/import
## Referência

 - challenge by coodesh: [Coodesh](https://coodesh.com/)


