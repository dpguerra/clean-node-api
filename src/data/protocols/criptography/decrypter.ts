export interface Decrypter {
  decrypt (token: Object): Promise<any>
}
