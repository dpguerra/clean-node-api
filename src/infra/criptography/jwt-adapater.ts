import { sign } from 'jsonwebtoken'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: Object): Promise<string> {
    return sign(value, this.secret)
  }
}
