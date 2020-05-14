import { sign, verify } from 'jsonwebtoken'
import { Decrypter } from '../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Decrypter, Encrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: Object): Promise<string> {
    return sign(value, this.secret)
  }

  async decrypt (token: string): Promise<any> {
    let decoded: any | null
    try {
      decoded = verify(token, this.secret)
    } catch (error) {
      if (error.message === 'jwt malformed') {
        return await Promise.resolve(null)
      }
      console.error(error)
      return await Promise.reject(error)
    }
    return await Promise.resolve(decoded)
  }
}
