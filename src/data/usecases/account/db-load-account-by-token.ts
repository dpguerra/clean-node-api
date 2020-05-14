import { LoadAccountByToken, LoadAccountByTokenModel } from '../../../domain/usecases/account/load-account-usecase'
import { LoadAccountByTokenRepository } from '../../protocols/db/load-account-by-token-repository'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'

export class DBLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly accountMongoRepository: LoadAccountByTokenRepository
  ) { }

  async load (query: LoadAccountByTokenModel): Promise<AccountModel | null> {
    const decoded = await this.decrypter.decrypt(query.token)
    if (!decoded) {
      return await Promise.resolve(null)
    }
    const account = await this.accountMongoRepository.loadByToken(query)
    return await Promise.resolve(account ?? null)
  }
}
