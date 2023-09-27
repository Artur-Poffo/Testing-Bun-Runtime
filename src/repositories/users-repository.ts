import { User } from "../entities/User"

export interface UsersRepository {
  register(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}