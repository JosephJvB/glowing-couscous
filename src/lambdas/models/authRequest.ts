export enum AuthActions {
  login = 'login',
  register = 'register',
}
export interface IAuthRequest {
  action: AuthActions
  email: string
  password: string
}