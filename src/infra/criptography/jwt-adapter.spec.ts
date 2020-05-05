import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapater'
import { Encrypter } from '../../data/protocols/criptography/encrypter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('valid_token')
  }
}))

const makeSut = (): Encrypter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter', () => {
  test('should call JWT sign if corrects values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt({ id: 'any_id' })
    expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
  })
})
