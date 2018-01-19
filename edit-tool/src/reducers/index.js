import initstate from '../state/';

const pageup = (state) => {
  const index = state.index - 1 < 1 ? 1 : state.index - 1;
  const pagenationbtns = getpagenationbtns(state.pages, index);
  return { ...state, index: index, pagenationbtns: pagenationbtns }
}

const pagedown = (state) => {
  const index = state.index + 1 > state.pages ? state.pages : state.index + 1;
  const pagenationbtns = getpagenationbtns(state.pages, index);
  return { ...state, index: index, pagenationbtns: pagenationbtns }
}

const pageto = (state, index) => {
  const pagenationbtns = getpagenationbtns(state.pages, index);
  return { ...state, index: index, pagenationbtns: pagenationbtns }
}

const pageinit = (state, scripts) => {
  const pages = Math.round(scripts.length / 4);
  const pagenationbtns = getpagenationbtns(pages, 1);
  return { ...state, scripts: scripts, pages: pages, pagenationbtns: pagenationbtns }
}

const getpagenationbtns = (pages, index) => {
  let pagebtns = [];
  pagebtns.push({ id: '上一页', text: '上一页', active: 0 });
  if (pages <= 10) {
    for (let i = 1; i <= pages; i++) {
      if (i === index) {
        pagebtns.push({ id: i, text: i, active: 1 });
      } else {
        pagebtns.push({ id: i, text: i, active: 0 });
      }
    }
  } else {
    if (index <= 5) {
      for (let i = 1; i <= 8; i++) {
        if (i === index) {
          pagebtns.push({ id: i, text: i, active: 1 });
        } else {
          pagebtns.push({ id: i, text: i, active: 0 });
        }
      }
      pagebtns.push({ id: '...1', text: '...', active: 0 });
      pagebtns.push({ id: 10, text: pages, active: 0 });
    } else if (index > 5 && index < pages - 5) {
      pagebtns.push({ id: 1, text: 1, active: 0 });
      pagebtns.push({ id: '...0', text: '...', active: 0 });
      for (let i = index - 3; i <= index + 2; i++) {
        if (i === index) {
          pagebtns.push({ id: i, text: i, active: 1 });
        } else {
          pagebtns.push({ id: i, text: i, active: 0 });
        }
      }
      pagebtns.push({ id: '...1', text: '...', active: 0 });
      pagebtns.push({ id: 10, text: pages, active: 0 });
    } else {
      pagebtns.push({ id: 1, text: 1, active: 0 });
      pagebtns.push({ id: '...0', text: '...', active: 0 });
      for (let i = pages - 7; i <= pages; i++) {
        if (i === index) {
          pagebtns.push({ id: i, text: i, active: 1 });
        } else {
          pagebtns.push({ id: i, text: i, active: 0 });
        }
      }
    }
  }
  pagebtns.push({ id: '下一页', text: '下一页', active: 0 });
  return pagebtns;
}

const reducer = (state = initstate, action) => {
  switch (action.type) {
    case 'UP_COUNT':
      return { ...state, count: state.count + 1 };
    case 'DOWN_COUNT':
      return { ...state, count: state.count - 1 };
    case 'PAGE_UP':
      return pageup(state);
    case 'PAGE_DOWN':
      return pagedown(state);
    case 'PAGE_TO':
      return pageto(state, action.parames.index);
    case 'PAGE_INIT':
      return pageinit(state, action.parames.scripts);
    case 'TO_LOGIN':
      return {...state,user:action.parames.user};
    default:
      return state;
  }
}

export default reducer;