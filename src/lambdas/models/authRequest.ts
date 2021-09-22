export enum AuthPaths {
  login = '/login',
  register = '/register',
}
export interface IAuthRequest {
  email: string
  password: string
}