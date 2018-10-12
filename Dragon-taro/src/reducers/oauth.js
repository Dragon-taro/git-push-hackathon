import { REQUEST_OAUTH, SUCCESS_LOGIN } from "../actions/constants";

const initial = {
  isAuthorized: false,
  err: null
};

export default function oauth(state = initial, { type, payload }) {
  switch (type) {
    case REQUEST_OAUTH:
      return { ...state, isAuthorized: false, err: null };
    case SUCCESS_LOGIN:
      return { ...state, isAuthorized: true, err: null };
  }

  return state;
}