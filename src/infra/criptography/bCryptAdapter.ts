import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/criptography/hasher'

export class BCryptAdapter implements Encrypter {
  constructor (private readonly salt: number) {}
  async encrypt (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return await Promise.resolve(hash)
  }
}
