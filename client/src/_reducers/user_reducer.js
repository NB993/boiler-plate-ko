import { LOGIN_USER } from "../_actions/types";

export default function (state = {}, action) {
  // state는 빈상태
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
      break;

    default:
      return state;
      break;
  }
}
