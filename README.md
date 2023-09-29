<h1 align="center">
  <a href="#">Testing Elysia with Bun runtime</a>
</h1>

<h3 align="center">
  Simple API for user registration/authentication
</h3>

<h4 align="center"> 
	 Status: Finished
</h4>

<p align="center">
 <a href="#about">About</a> •
 <a href="#features">Features</a> •
 <a href="#api-routes">API Routes</a> • 
 <a href="#how-it-works">How it works</a> • 
 <a href="#tech-stack">Tech Stack</a> • 
 <a href="#author">Author</a>
</p>


## About

Testing Elysia with Bun runtime - Is a simple API created to test the new runtime JavaScript/TypeScript: `Bun`

---

## Features

- [x] Register user
- [x] Sign In with user
  - [x] JWT Authentication
- [x] Get user profile using the JWT

---

## API Routes

- **_Users_**
  - **POST /users/signup** - Register a new user
  - **POST /users/signin** - Sign in with user and generate JWT
  - **PATCH /users/profile** - Get logged user profile

---

## How it works

### Pre-requisites

Before you begin, you will need to have the following tools installed on your machine:
[Git](https://git-scm.com), [Bun runtime](https://bun.sh/).
In addition, it is good to have an editor to work with the code like [VSCode](https://code.visualstudio.com/) and a REST client like [Insomnia](https://insomnia.rest/)

You will also need to have [Docker](https://www.docker.com/) installed to run the
postgres database with [Docker Compose](https://docs.docker.com/compose/)

**it is very important that before running the project you configure the environment variables as indicated in the file: .env.example**

#### Run the app

```bash
# Clone this repository
$ git clone https://github.com/Artur-Poffo/Testing-Bun-Runtime.git

# Access the project folder cmd/terminal
$ cd Testing-Bun-Runtime

# install the dependencies
$ bun install

# Inicialize the database
# In the root directory after installing docker run:
$ docker compose up
# This command should create and start a container with Postgres database

# Then when you want to stop running docker run:
$ docker compose stop
# Or just press Ctrl+c

# When you want to restart, run:
$ docker compose start

# With your database running and connected in .env file:
$ bunx prisma migrate dev

# Run the application in development mode
$ bun dev

# The server will start at port: 3000 - You can now test in Insomnia or another REST client: http://localhost:3000
```

#### Run tests

```bash
# Run unit tests
$ bun test:unit
```

---

## Tech Stack

The following tools were used in the construction of the project:

- **Bun runtime/toolkit**
- **TypeScript**
- **Elysia Framework**
- **zod**
- **Prisma ORM**
- **@Elysia/jwt**
- **@Elysia/cookie**
- **@Elysia/swagger**

> See the file  [package.json](https://github.com/Artur-Poffo/Testing-Bun-Runtime/blob/main/package.json)

---

## Author

- _**Artur Poffo - Developer**_

[![Linkedin Badge](https://img.shields.io/badge/-Artur-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/arturpoffo/)](https://www.linkedin.com/in/arturpoffo/)
[![Gmail Badge](https://img.shields.io/badge/-arturpoffop@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:tgmarinho@gmail.com)](mailto:arturpoffop@gmail.com)

---