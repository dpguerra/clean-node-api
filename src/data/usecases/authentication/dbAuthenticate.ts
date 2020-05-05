import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByIdRepository } from '../../protocols/db/loadAccountByIdRepository'

export class DBAuthenticate implements Authentication {
  constructor (private readonly loadAccountByIdRepository: LoadAccountByIdRepository) { }
  async auth (credential: AuthenticationModel): Promise<string> {
    await this.loadAccountByIdRepository.load(credential.email)
    return await Promise.resolve('any_token')
  }
}
