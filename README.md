# **Reading management system**

## Description

This system aims to allow readers to organize their reading by marking books as read, currently reading, intending to read, or abandoned.
The system will provide a list of books and their information, such as title, author, synopsis, and publisher.

## Environment and tools

- Node.js v20.15.1
- npm v10.7.0
- Fastify v5.5.0
- Typescript 5.9.2
- Docker v28.3.3
- Postgres v15.1
- Prisma v6.15.0
- Vscode v1.103.2
- TablePlus v6.7.0
- tsx v4.20.5
- Postman v11.61.7

## Steps to run and debug

Clone this repository:

```
git clone https://github.com/indigotech/onboard-gabrielle-verissimo.git
```

See how to install [Docker](https://docs.docker.com/get-started/introduction/get-docker-desktop/) for your operating system.
Open Docker Desktop.

Open the repository in your code editor of choice and install the packages:

```
npm install
```

Configure the ports and database information in the docker-compose.yml file and the Prisma connection URL with Postgres in the .env file.

To mount your containers run:

```
docker compose up -d
```

To run the server:

```
npm run dev
```

To view database data, you can use TablePlus, and to debug the API, you can use Postman. Feel free to use another tool of your choice.
