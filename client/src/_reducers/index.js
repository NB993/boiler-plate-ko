// state별로 여러 reducer를 사용하게 될텐데,
// 이 여러 reducer들을 root reducer로 통합시켜주는 역할.
import { combineReducers } from "redux";
import user from "./user_reducer";

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
