import { Authenticate, AuthenticateModel, TokenModel } from '../../../domain/usecases/authenticate/authenticate-usecase'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { UpdateTokenRepository } from '../../protocols/db/update-token-repository'
import { InvalidUserOrPassword } from '../../../domain/usecases/authenticate/invalid-user-or-email-error'

export class DBAuthenticate implements Authenticate {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateTokenRepository: UpdateTokenRepository
  ) { }

  async auth (credential: AuthenticateModel): Promise<TokenModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credential.email)
    if (!account) {
      return await Promise.reject(new InvalidUserOrPassword())
    }
    if (!await this.hashCompare.compare(credential.password, account.password)) {
      return await Promise.reject(new InvalidUserOrPassword())
    }
    const { id } = account
    const token = await this.encrypter.encrypt({ id })
    await this.updateTokenRepository.updateToken(account.id, token)
    return await Promise.resolve({ token })
  }
}
