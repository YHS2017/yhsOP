const initialState = {
  project_id: 1,
  outline: null,
  content: null,

  selected_paragraph_id: null,
  
  operations: [],
  operation_index: -1,
  errors: [],
  warnings: []
};

export default function editor(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_EDITOR':
      return { ...action.editor };

    case 'CLEAR_EDITOR':
      return initialState;

    case 'RESPONSE_PROJECT':
      return {
        ...state,
        outline: action.outline,
        content: action.content,
      };

    case 'UPDATE_VALIDATION_RESULT':
      return {
        ...state,
        errors: action.errors,
        warnings: action.warnings,
      };

    case 'UPDATE_PARAGRAPHS':
      return {
        ...state,
        content: {
          ...state.content,
          paragraphs: action.paragraphs,
        },
      };

    case 'UPDATE_PROJECT_OUTLINE':
      return {
        ...state,
        outline: action.outline,
      };

    case 'UPDATE_PROJECT_CONTENT':
      return {
        ...state,
        content: action.content,
      };

    case 'SET_SELECTED_PARAGRAPH_ID':
      return {
        ...state,
        selected_paragraph_id: action.paragraph_id,
      };

    case 'UPDATE_OPERATIONS':
      return {
        ...state,
        operations: action.operations,
        operation_index: action.operation_index,
      };

    case 'SET_EDITSTATE':
      let edit = { ...state };
      Object.assign(edit, action.edit);
      return edit;

    default:
      return state;
  }
}