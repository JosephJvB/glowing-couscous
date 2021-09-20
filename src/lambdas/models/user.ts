export interface IUser {
  email: string
  password: string
  hash?: string
  salt?: string
  verified?: boolean
}