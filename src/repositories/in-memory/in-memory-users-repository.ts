import { User } from "../../entities/User";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  private readonly items: User[] = []

  async register(user: User): Promise<User> {
    const newUser: User = {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName
    }

    this.items.push(newUser)

    return newUser
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find(item => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
}