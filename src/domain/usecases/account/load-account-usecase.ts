import { AccountModel } from '../../models/account'

export interface LoadAccountByTokenModel {
  token: string
  role?: string
}
export interface LoadAccountByIdModel {
  id: string
  role?: string
}
export interface LoadAccountByToken {
  load (query: LoadAccountByTokenModel): Promise<AccountModel | null>
}
