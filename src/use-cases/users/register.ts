import { randomUUID } from "crypto";
import { User } from "../../entities/User";
import { UsersRepository } from "../../repositories/users-repository";
import { ResourceAlreadyExistsError } from "../shared/errors/resource-already-exists-error";
import { UseCase } from "../shared/interfaces/UseCase";

interface RegisterUserUseCaseRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUserUseCase implements UseCase<RegisterUserUseCaseRequest, RegisterUserUseCaseResponse> {
  constructor(private readonly UserRepository: UsersRepository) { }

  async exec({ email, password, firstName, lastName }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userExists = await this.UserRepository.findByEmail(email)

    if (userExists) {
      throw new ResourceAlreadyExistsError()
    }

    const newUser = await this.UserRepository.register({
      id: randomUUID(),
      email,
      password: await Bun.password.hash(password),
      firstName,
      lastName,
    })

    return { user: newUser }
  }
}