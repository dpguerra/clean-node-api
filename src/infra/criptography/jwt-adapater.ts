import { sign, verify } from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Decrypter, Encrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: Object): Promise<string> {
    return sign(value, this.secret)
  }

  async decrypt (token: string): Promise<any> {
    return verify(token, this.secret)
  }
}
