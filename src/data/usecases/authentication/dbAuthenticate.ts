import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'
import { HashComparer } from '../../protocols/criptography/hashComparer'

export class DBAuthenticate implements Authentication {
  constructor (
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository,
    private readonly hashCompare: HashComparer
  ) { }

  async auth (credential: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByIdRepository.load(credential.email)
    this.hashCompare.compare(credential.password, account.password)
    return await Promise.resolve('any_token')
  }
}
