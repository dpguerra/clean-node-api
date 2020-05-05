import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bCryptAdapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hashed_value')
  },
  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const salt = 12
const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(salt)
}

describe('BCrypt Adapter', () => {
  test('should bcrypt.hash with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
  test('should bcrypt.hash return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hashed_value')
  })
  test('should throws with bcrypt.hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
  test('should bcrypt.compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_password', 'any_hashed_password')
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_hashed_password')
  })
  test('should throws if bcrypt.compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.compare('any_password', 'any_hashed_password')
    await expect(promise).rejects.toThrow()
  })
  test('should return false if bcrypt.compare return false', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const result = await sut.compare('any_password', 'any_hashed_password')
    expect(result).toBeFalsy()
  })
  test('should return true if bcrypt.compare succeds', async () => {
    const sut = makeSut()
    const result = await sut.compare('any_password', 'any_hashed_password')
    expect(result).toBeTruthy()
  })
})
