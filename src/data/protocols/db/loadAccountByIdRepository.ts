import { AccountModel } from '../../../domain/models/account'

export interface LoadAccountByIdRepository {
  load (email: string): Promise<AccountModel>
}
