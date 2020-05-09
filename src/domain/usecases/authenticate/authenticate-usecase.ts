export interface AuthenticateModel {
  email: string
  password: string
}

export interface TokenModel {
  token: string
}

export interface Authenticate {
  auth(credential: AuthenticateModel): Promise<TokenModel>
}
