import { SignUpController } from './signUp'
describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const request = {
      body: {
        name: '',
        email: 'daniel@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const response = sut.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: name'))
  })
})
