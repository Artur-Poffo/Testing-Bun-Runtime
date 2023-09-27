import { User } from "@prisma/client";
import { UsersRepository } from "../../repositories/users-repository";
import { InvalidCredentialsError } from "../shared/errors/invalid-credentials-error";
import { UseCase } from "../shared/interfaces/UseCase";

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUserUseCaseResponse {
  user: User
}

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserUseCaseRequest, AuthenticateUserUseCaseResponse> {
  constructor(private readonly UserRepository: UsersRepository) { }

  async exec({ email, password }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.UserRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordsMatch = await Bun.password.verify(
      password,
      user.password
    )

    if (!doesPasswordsMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}