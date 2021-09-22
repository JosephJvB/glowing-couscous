export interface IUser {
  email: string
  hash?: string
  salt?: string
  verified?: boolean
  created?: number
}