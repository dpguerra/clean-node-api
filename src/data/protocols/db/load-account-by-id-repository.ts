import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByIdModel } from '../../../domain/usecases/account/load-account-usecase'

export interface LoadAccountByIdRepository {
  loadById(query: LoadAccountByIdModel): Promise<AccountModel | null>
}
