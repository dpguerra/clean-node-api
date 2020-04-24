interface SignUpBody {
  body: { name: string, email: string, password: string, passwordConfirmation: string }
}

export class SignUpController {
  handle (request: SignUpBody): any {
    if (request.body.name === '') {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
  }
}
