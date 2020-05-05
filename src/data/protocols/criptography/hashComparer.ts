export interface HashComparer {
  compare(password: string, hashedPassword: string): boolean
}
