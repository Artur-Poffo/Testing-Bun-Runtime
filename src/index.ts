import { swagger } from '@elysiajs/swagger';
import { Elysia } from "elysia";
import { usersRoutes } from './http/controllers/users/routes';

const app = new Elysia()
  .use(swagger())
  .group('/users', (app) => app
    .use(usersRoutes))
  .listen(3000)

console.log(`Running at http://${app.server!.hostname}:${app.server!.port}`)