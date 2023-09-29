import { User } from "@prisma/client";
import { UsersRepository } from "../../repositories/users-repository";
import { ResourceNotFoundError } from "../shared/errors/resource-not-found-error";
import { UseCase } from "../shared/interfaces/UseCase";

interface GetUserProfileUseCaseRequest {
  id: string;
}

interface GetUserProfileUseCaseResponse {
  userProfile: User
}

export class GetUserProfileUseCase implements UseCase<GetUserProfileUseCaseRequest, GetUserProfileUseCaseResponse> {
  constructor(private readonly UserRepository: UsersRepository) { }

  async exec({ id }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.UserRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { userProfile: { ...user, password: "" } }
  }

}