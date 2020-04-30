export interface LogErrorReturnModel {
  id: string
  stack: string
}
export interface LogErrorRepository {
  log(stack: string): Promise<LogErrorReturnModel>
}
