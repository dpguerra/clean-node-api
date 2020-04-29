export interface LogErrorReposytory {
  log(stack: string): Promise<void>
}
