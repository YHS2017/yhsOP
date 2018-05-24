const initialState = {
    list: [],
    listtype: '1',
};

export default function projects(state = initialState, action) {
    switch (action.type) {
        case 'RESPONSE_PROJECTS':
            return {
                ...state,
                list: action.list,
                listtype: action.listtype,
            };

        case 'UPDATE_PROJECTS':
            return {
                ...state,
                list: action.list
            };

        case 'INIT_PROJECTS':
            return initialState;

        default:
            return state;
    }
}