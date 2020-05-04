export interface AuthenticationModel {
  email: string
  password: string
}
export interface Authentication {
  auth (credential: AuthenticationModel): Promise<string>
}
