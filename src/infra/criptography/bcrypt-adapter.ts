import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/criptography/hasher'
import { HashComparer } from '../../data/protocols/criptography/hash-comparer'

export class BCryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}
  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return await Promise.resolve(hash)
  }

  async compare (password: string, hashedPassword: string): Promise<boolean> {
    return await Promise.resolve(
      await bcrypt.compare(password, hashedPassword)
    )
  }
}
