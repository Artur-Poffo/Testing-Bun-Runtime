import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { z } from "zod";
import { InvalidCredentialsError } from "../../use-cases/shared/errors/invalid-credentials-error";
import { ResourceAlreadyExistsError } from "../../use-cases/shared/errors/resource-already-exists-error";
import { ResourceNotFoundError } from "../../use-cases/shared/errors/resource-not-found-error";
import { makeAuthenticateUserUseCase } from "../../use-cases/users/factories/make-authenticate-user-use-case";
import { makeGetUserProfileUseCase } from "../../use-cases/users/factories/make-get-user-profile-use-case";
import { makeRegisterUserUseCase } from "../../use-cases/users/factories/make-register-user-use-case";

export const usersController = (app: Elysia) => app
  // Plugins  
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET || "BreakYourKeyboardHere",
      exp: '7d'
    })
  )
  .use(cookie())
  // SignUp controller
  .post('/signup', async ({ body, set }) => {
    const registerUserBodySchema = z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
    })

    const { email, firstName, lastName, password } = registerUserBodySchema.parse(body)

    try {
      const registerUseCase = makeRegisterUserUseCase()

      await registerUseCase.exec({
        email,
        password,
        firstName,
        lastName,
      })

      set.status = 201 // Created
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        set.status = 409 // E-mail already in use
        return { message: err.message }
      }

      set.status = 500 // Other error
      throw err
    }
  }, {
    detail: {
      tags: ["Auth"]
    }
  })
  // Signin controller
  .post('/signin', async ({ body, set, setCookie, jwt, cookie }) => {
    const authenticateUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const { email, password } = authenticateUserBodySchema.parse(body)

    try {
      const authenticateUseCase = makeAuthenticateUserUseCase()

      const { user } = await authenticateUseCase.exec({
        email,
        password
      })

      setCookie('auth', await jwt.sign(
        {
          sub: user.id
        }
      ),
        {
          httpOnly: true,
          maxAge: 7 * 86400,
        })

      return { token: cookie.auth }
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        set.status = 401 // Unauthorized
        return { message: err.message }
      }

      throw err
    }
  }, {
    detail: {
      tags: ["Auth"]
    }
  })
  // Get user profile
  .get('/profile', async ({ jwt, cookie: { auth }, set }) => {
    const userId = await jwt.verify(auth)

    if (!userId) {
      set.status = 401 // Unauthorized
      return { message: "Unauthorized" }
    }

    try {
      const getProfileUseCase = makeGetUserProfileUseCase()

      const { userProfile } = await getProfileUseCase.exec({ id: userId.sub! })

      set.status = 200 // OK
      return { userProfile }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        set.status = 404 // Not found
        return { message: err.message }
      }

      throw err
    }
  }, {
    detail: {
      tags: ["App"],
    }
  })