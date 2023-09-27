import { beforeEach, describe, expect, it } from "bun:test"
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository"
import { InvalidCredentialsError } from "../shared/errors/invalid-credentials-error"
import { AuthenticateUserUseCase } from "./authenticate"
import { RegisterUserUseCase } from "./register"

let usersRepository: InMemoryUsersRepository
let registerUserUseCase: RegisterUserUseCase

let sut: AuthenticateUserUseCase

describe("Authenticate user use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUserUseCase = new RegisterUserUseCase(usersRepository)

    sut = new AuthenticateUserUseCase(usersRepository)
  })

  it("Should be able to authenticate with a user", async () => {
    const email = "user@example.com"
    const password = "12345"

    await registerUserUseCase.exec({
      email: email,
      firstName: "John",
      lastName: "Doe",
      password: password
    })

    const { user } = await sut.exec({
      email: email,
      password: password
    })

    expect(user.email).toEqual("user@example.com")
  })

  it("Should not be able to authenticate with a inexistent user", async () => {
    const result = Promise.resolve(sut.exec({
      email: "inexistent@user.com",
      password: "12345"
    }))

    expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("Should not be able to authenticate with a wrong password user", async () => {
    const password = "12345"

    await registerUserUseCase.exec({
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      password: password
    })

    const result = Promise.resolve(sut.exec({
      email: "user@example.com",
      password: "Wrong password"
    }))

    expect(result).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})