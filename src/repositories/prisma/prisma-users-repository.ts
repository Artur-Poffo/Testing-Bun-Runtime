import { User } from "../../entities/User";
import { prisma } from "../../lib/prisma";
import { UsersRepository } from "../users-repository";

export class prismaUsersRepository implements UsersRepository {
  register(user: User): Promise<User> {
    const newUser = prisma.user.create({ data: user })

    return newUser
  }

  findById(id: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: { id: id },
    })

    return user
  }

  findByEmail(email: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: { email: email },
    })

    return user
  }
}