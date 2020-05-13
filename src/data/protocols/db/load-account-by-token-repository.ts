import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenModel } from '../../../domain/usecases/account/load-account-usecase'

export interface LoadAccountByTokenRepository {
  loadByToken(query: LoadAccountByTokenModel): Promise<AccountModel | null>
}
