import { LoadAccountByToken, LoadAccountByTokenModel } from '../../../domain/usecases/account/load-account-usecase'
import { LoadAccountByIdRepository } from '../../protocols/db/load-account-by-id-repository'
import { AccountModel } from '../../../domain/models/account'
import { Decrypter } from '../../protocols/criptography/decrypter'

export class DBLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly accountMongoRepository: LoadAccountByIdRepository
  ) { }

  async load (query: LoadAccountByTokenModel): Promise<AccountModel | null> {
    const decoded = await this.decrypter.decrypt(query.token)
    if (!decoded || !decoded.id) {
      return await Promise.resolve(null)
    }
    const { id } = decoded
    const { role } = query
    const account = await this.accountMongoRepository.loadById({ id, role })
    return await Promise.resolve(account ?? null)
  }
}
