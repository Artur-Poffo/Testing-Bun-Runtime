import { swagger } from '@elysiajs/swagger';
import { Elysia } from "elysia";
import { usersController } from './http/controllers/users';

const app = new Elysia()
  .use(swagger(
    {
      documentation: {
        info: {
          title: "Testing Bun runtime",
          description: "I decided to create this simple user registration and authentication API to test this new runtime",
          version: "1.0.0",
        },
        tags: [
          { name: 'App', description: 'General endpoints' },
          { name: 'Auth', description: 'Authentication endpoints' }
        ]
      }
    }
  ))
  .group('/users', (app) => app
    .use(usersController))
  .listen(3000)

console.log(`Running at http://${app.server!.hostname}:${app.server!.port}`)