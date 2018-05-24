// screen: Login, Home, ProjectEditor

const initialState = {
  router: 'Login',
  loading: { content: null },  // {content: '正在加载中'}
  message: { content: null }, // {content: '请检查网络后重试'}
  alert: { content: null, cback: null }, // {content: '发现了段落错误！'}
  confirm: { content: null, cback: null },// {content: '确认删除段落吗？',cback:()=>{}}
  notices: [],
  totalnotices: 0,
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'NAVIGATE_TO_ROUTER':
      return { ...state, router: action.router };

    case 'SET_APP_LOADING':
      return { ...state, loading: action.loading };

    case 'SET_APP_MESSAGE':
      return { ...state, message: action.message };

    case 'SET_APP_ALERT':
      return { ...state, alert: action.alert };

    case 'SET_APP_CONFIRM':
      return { ...state, confirm: action.confirm };

    case 'SET_APP_NOTICES':
      return { ...state, notices: action.notices, totalnotices: action.totalnotices };

    case 'INIT_APP':
      return initialState;

    case 'SET_LOGIN_TAB':
      return { ...state, login_tab: action.login_tab };

    default:
      return state;
  }
}