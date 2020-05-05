import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'
import { HashComparer } from '../../protocols/criptography/hashComparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { UpdateTokenRepository } from '../../protocols/db/updateTokenRepository'

export class DBAuthenticate implements Authentication {
  constructor (
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) { }

  async auth (credential: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByIdRepository.load(credential.email)
    if (!account) {
      return await Promise.reject(Error('unauthorized'))
    }
    if (!await this.hashCompare.compare(credential.password, account.password)) {
      return await Promise.reject(Error('unauthorized'))
    }
    const { id } = account
    const token = await this.encrypter.encrypt({ id })
    await this.updateTokenRepository.update(account.id, token)
    return await Promise.resolve(token)
  }
}
