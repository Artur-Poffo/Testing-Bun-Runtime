import { beforeEach, describe, expect, it } from "bun:test"
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository"
import { ResourceAlreadyExistsError } from "../shared/errors/resource-already-exists-error"
import { RegisterUserUseCase } from "./register"

let usersRepository: InMemoryUsersRepository
let sut: RegisterUserUseCase

describe("Register user use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUserUseCase(usersRepository)
  })

  it("Should be able to register a new user", async () => {
    const { user } = await sut.exec({
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      password: "12345"
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.exec({
      email: 'user@example.com',
      firstName: "John",
      lastName: "Doe",
      password: '12345',
    })

    const isPasswordCorrectlyHashed = await Bun.password.verify(
      '12345',
      user.password,
    )

    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it("Should not be able to register a new user with same email twice", async () => {
    const email = 'user@example.com'

    await sut.exec({
      email: email,
      firstName: "John",
      lastName: "Doe",
      password: "12345"
    })

    const result = Promise.resolve(sut.exec({
      email: email,
      firstName: "John",
      lastName: "Doe",
      password: "12345"
    }))

    expect(result).rejects.toBeInstanceOf(ResourceAlreadyExistsError)
  })
})