export interface Authentication {
  auth(user: string, pass: string): Promise<string>
}
