export interface UpdateTokenRepository {
  update (id: string, token: string): Promise<boolean>
}
