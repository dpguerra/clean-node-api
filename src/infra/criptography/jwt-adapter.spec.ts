import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapater'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('valid_token')
  },
  async verify (): Promise<any> {
    return await Promise.resolve({ id: 'any_id' })
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JWT Adapter tests', () => {
  describe('sign() method', () => {
    test('should call JWT sign if corrects values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt({ id: 'any_id' })
      expect(signSpy).toBeCalledWith({ id: 'any_id' }, 'secret')
    })
    test('should throws if JWT sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt({ id: 'any_id' })
      await expect(promise).rejects.toThrow()
    })
    test('should returns a valid token on success', async () => {
      const sut = makeSut()
      const token = await sut.encrypt({ id: 'any_id' })
      expect(token).toBe('valid_token')
    })
  })
  describe('verify() method', () => {
    test('should call JWT verify if corrects values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(signSpy).toBeCalledWith('any_token', 'secret')
    })
  })
})
