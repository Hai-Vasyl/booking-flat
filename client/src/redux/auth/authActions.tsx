import {
  FETCH_START_AUTH,
  FETCH_SUCCESS_AUTH,
  FETCH_FAILURE_AUTH,
  AuthDispatchTypes,
} from "./authTypes"
import { Dispatch } from "redux"
import axios from "axios"

interface DataFetch {
  firstname?: string
  lastname?: string
  email: string
  password: string
}

export const fetchAuth = (isLogin: boolean, data: DataFetch) => async (
  dispatch: Dispatch<AuthDispatchTypes>
) => {
  try {
    dispatch({ type: FETCH_START_AUTH })
    const res = await axios({
      url: `/auth/${isLogin ? "login" : "register"}`,
      method: "post",
      data,
    })
    dispatch({ type: FETCH_SUCCESS_AUTH, payload: res.data })
  } catch (error) {
    dispatch({ type: FETCH_FAILURE_AUTH, payload: error.response.data.errors })
  }
}
