export const FETCH_START_AUTH = "FETCH_START_AUTH"
export const FETCH_SUCCESS_AUTH = "FETCH_SUCCESS_AUTH"
export const FETCH_FAILURE_AUTH = "FETCH_FAILURE_AUTH"
export const CLEAR_ERROR_AUTH = "CLEAR_ERROR_AUTH"
export const SET_AUTH = "SET_AUTH"

export type SuccessPayloadAuth = {
  token: string
  user: {
    typeUser: string
    ava: string
    _id: string
    firstname: string
    lastname: string
    email: string
    password: string
    date: string
    __v?: number
  }
}

export type ErrorPayload = {
  value?: string
  msg: string
  param: string
  location?: string
}

export interface FetchStartAuth {
  type: typeof FETCH_START_AUTH
}

export interface FetchSuccessAuth {
  type: typeof FETCH_SUCCESS_AUTH
  payload: SuccessPayloadAuth
}

export interface FetchFailureAuth {
  type: typeof FETCH_FAILURE_AUTH
  payload: ErrorPayload[]
}

export interface ClearErrorAuth {
  type: typeof CLEAR_ERROR_AUTH
  payload: string
}

export interface SetAuth {
  type: typeof SET_AUTH
}

export type AuthDispatchTypes =
  | FetchStartAuth
  | FetchSuccessAuth
  | FetchFailureAuth

export type AuthReducerTypes = AuthDispatchTypes | ClearErrorAuth | SetAuth
