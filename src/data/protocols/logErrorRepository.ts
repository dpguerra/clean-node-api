export interface LogErrorReturnModel {
  id: string
  stack: string
}
export interface LogErrorRepository {
  logError (stack: string): Promise<LogErrorReturnModel>
}
