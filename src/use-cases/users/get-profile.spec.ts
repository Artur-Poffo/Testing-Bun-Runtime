import { beforeEach, describe, expect, it } from "bun:test"
import { InMemoryUsersRepository } from "../../repositories/in-memory/in-memory-users-repository"
import { ResourceNotFoundError } from "../shared/errors/resource-not-found-error"
import { GetUserProfileUseCase } from "./get-profile"
import { RegisterUserUseCase } from "./register"

let usersRepository: InMemoryUsersRepository
let registerUserUseCase: RegisterUserUseCase

let sut: GetUserProfileUseCase

describe("Get user profile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUserUseCase = new RegisterUserUseCase(usersRepository)

    sut = new GetUserProfileUseCase(usersRepository)
  })

  it("Should be able to get user profile", async () => {
    const { user: { id } } = await registerUserUseCase.exec({
      firstName: "John",
      lastName: "Doe",
      email: "user@example.com",
      password: "12345"
    })

    const { userProfile } = await sut.exec({ id })

    expect(userProfile.firstName).toEqual("John")
  })

  it("Should not be able to get a user profile from a inexistent user", async () => {
    const id = "inexistentUserId"

    const result = Promise.resolve(sut.exec({ id }))

    expect(result).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})