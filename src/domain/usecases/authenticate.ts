export interface AuthenticateModel {
  email: string
  password: string
}
export interface Authenticate {
  auth (credential: AuthenticateModel): Promise<string>
}
