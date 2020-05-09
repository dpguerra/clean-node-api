import { AddAccountModel } from '../../../domain/usecases/account/account-usecase'
import { AccountModel } from '../../../domain/models/account'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountModel>
}
