const initialState = {
  id: null,
  name: '',
  profile: '',
  qq: '',
  token: '',
  phone:'',
  phonemsg_cookie: '',
  union: null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case 'SET_PHONEMSG_COOKIE':
      return { ...state, phonemsg_cookie: action.phonemsg_cookie }

    case 'LOGGED_IN':
      return {
        ...state,
        id: action.id,
        name: action.name,
        profile: action.profile,
        token: action.token,
        phone: action.phone,
        qq: action.qq
      };

    case 'LOGGED_OUT':
      return initialState;

    case 'UPDATE_USER':
      return {
        ...state,
        name: action.user.name,
        profile: action.user.profile,
        qq: action.user.qq
      }

    default:
      return state;
  }
}