import bcrypt from 'bcrypt'

const saltRounds = 10

export class AuthClient {
  constructor() {}

  salt(): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(salt)
        }
      })
    })
  }
  hash(password: string, salt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash: string) => {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    })
  }
  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}