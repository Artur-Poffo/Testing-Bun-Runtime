import Elysia from "elysia";
import { register } from "./register";

export const usersRoutes = new Elysia().
  post('/signup', ({ body, set }) => register({ body, set }))