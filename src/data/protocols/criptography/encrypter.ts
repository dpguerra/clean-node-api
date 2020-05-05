export interface Encrypter {
  encrypt (value: Object): Promise<string>
}
