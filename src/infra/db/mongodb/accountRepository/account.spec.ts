import { AccountMongoRepository } from './account'

describe('Account MongoDB Repository', () => {
  test('should returns an account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@exemple.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@exemple.com')
    expect(account.password).toBe('any_password')
  })
})
