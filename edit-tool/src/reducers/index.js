import initstate from '../state/';

const reducer = (state = initstate, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.parames.user };
    case 'SET_TOKEN':
      return { ...state, token: action.parames.token };
    case 'SET_PROJECTS':
      return { ...state, projects: action.parames.projects };
    case 'SET_PROJECT':
      return { ...state, project: action.parames.project };
    case 'SET_PROJECT_EDITTYPE':
      return { ...state, projectedittype: action.parames.projectedittype };
    case 'SET_PROJECTINFO_SHOW':
      return { ...state, projectinfoshow: action.parames.projectinfoshow };
    case 'SET_CURRENT_PARAGRAPHID':
      return { ...state, currentparagraphid: action.parames.currentparagraphid };
    case 'SET_CURRENT_OPTIONID':
      return { ...state, currentoptionid: action.parames.currentoptionid };
    case 'SET_LOADINGSHOW':
      return { ...state, loadingshow: action.parames.loadingshow };
    default:
      return state;
  }
}

export default reducer;