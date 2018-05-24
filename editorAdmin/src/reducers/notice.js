const initialState = [];

export default function notice(state = initialState, action) {
    switch (action.type) {
        case 'SET_NOTICE':
            return action.notice;
        default:
            return state;
    }
}