const initialState = {
  id: null,
  name: '',
  token: '',
  level: 0,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'LOGGED_IN':
      return {
        ...state,
        name: action.name,
        token: action.token,
        level: action.level,
      };

    case 'LOGGED_OUT':
      return initialState;

    default:
      return state;
  }
}