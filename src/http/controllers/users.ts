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
      tags: ["Auth"],
      description: "Route for user registration",
      requestBody: {
        description: "Data required for user registration",
        content: {
          "firstName": {
            example: "John",
          },
          "lastName": {
            example: "Doe"
          },
          "email": {
            example: "johndoe@hotmail.com"
          },
          "password": {
            example: "12345"
          }
        },
        required: true,
      },
      responses: {
        "201": {
          description: "User registration successful"
        },
        "409": {
          description: "Conflict. indicates that the user already exists in the database"
        },
        "500": {
          description: "Other server error"
        }
      }
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

      set.status = 200 // OK
      return { token: cookie.auth }
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        set.status = 401 // Unauthorized
        return { message: err.message }
      }

      set.status = 500 // Other error
      throw err
    }
  }, {
    detail: {
      tags: ["Auth"],
      description: "Route for user authentication",
      requestBody: {
        description: "Data required for user authentication",
        content: {
          "email": {
            example: "johndoe@hotmail.com"
          },
          "password": {
            example: "12345"
          }
        },
        required: true,
      },
      responses: {
        "200": {
          description: "User authenticated"
        },
        "401": {
          description: "Unauthorized. invalid credentials"
        },
        "500": {
          description: "Other server error"
        }
      }
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

      set.status = 500 // Other error
      throw err
    }
  }, {
    detail: {
      tags: ["App"],
      description: "Route to return the user profile based on the ID saved in the JWT that is stored (or not) in a cookie named: 'auth'",
      responses: {
        "200": {
          description: "User profile was successfully retrieved"
        },
        "401": {
          description: "An error message is displayed indicating that the user is not authorized"
        },
        "404": {
          description: "An error message is displayed indicating that the user was not found"
        },
        "500": {
          description: "Other server error"
        }
      }
    }
  })