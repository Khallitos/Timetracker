import {
  CLEAR_TEXT,
  LOGIN_USER_ERROR,
  START_COUNTER,
  PAUSE_COUNTER,
  RESET_COUNTER,
  UPDATE_TIMER,
} from "./actions";

export const AppReducer = (state, action) => {
  switch (action.type) {
    case CLEAR_TEXT:
      return {
        ...state,
        showAlert: false,
        alertText: "",
        alertType: "",
      };

    case LOGIN_USER_ERROR:
      return {
        ...state,
        showAlert: true,
        alertText: action.payload.msg,
        alertType: "danger",
      };

    case START_COUNTER:
      return {
        ...state,
        startAt: new Date(),
      };

    case PAUSE_COUNTER:
      return {
        ...state,
      };

    case UPDATE_TIMER:
      return {
        ...state,
      };
    case RESET_COUNTER:
      return {
        ...state,
        startAt: null,
        endAt: null,
      };

    default:
      throw new Error(`${action.type} does not exist`);
  }
};
