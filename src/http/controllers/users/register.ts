import { Context } from "elysia";
import { z } from "zod";
import { ResourceAlreadyExistsError } from "../../../use-cases/shared/errors/resource-already-exists-error";
import { makeRegisterUserUseCase } from "../../../use-cases/users/factories/make-register-user-use-case";

export async function register({ body, set }: Partial<Context>) {
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

    set!.status = 201 // Created
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      set!.status = 409 // E-mail already in use
      return { message: err.message }
    }

    set!.status = 500 // Other error
    throw err
  }
}