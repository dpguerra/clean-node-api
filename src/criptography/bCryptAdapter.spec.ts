import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bCryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value')
  }
}))
describe('BCrypt Adapter', () => {
  test('should bcrypt with correct values', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('should return a hash on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    // jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.resolve('hashed_password'))
    const hash = await sut.encrypt('any_value')
    expect(hash).toBe('hashed_value')
  })
})
