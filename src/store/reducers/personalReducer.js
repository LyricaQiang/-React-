import * as TYPES from '../action-types';
//把登录态和基本信息存储到redux中
const initial = {
	isLogin: false,
	baseInfo: null
};
export default function personalReducer(state = initial, action) {
	state = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		case TYPES.PERSONAL_LOGIN_SUCCESS:
			state.isLogin = true;
			state.baseInfo = action.payload;
			break;
		case TYPES.PERSONAL_LOGIN_INFO:
			state.isLogin = action.isLogin;
			state.baseInfo = action.baseInfo || null;
			break;
	}
	return state;
};