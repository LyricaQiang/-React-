import * as TYPES from '../action-types';
import api from '../../api/index';

export default {
	//=>登录成功
	loginSuccess(data) {
		return {
			type: TYPES.PERSONAL_LOGIN_SUCCESS,
			payload: data
		}
	},
	//同步登录信息到redux
	syncLoginInfo() {
		//验证有没有登录，为什么这里要验证？因为不知道是不是redux没有存储信息，还是因为刷新没有了信息
		return async dispatch => {
			let data = await api.personal.loginGET();
			if(data.code !== 0) {
				dispatch({
					type: TYPES.PERSONAL_LOGIN_INFO,
					isLogin: false
				});
				return;
			}
			//从服务器获取登录的用户信息
			data = await api.personal.info();
			if(parseInt(data.code) === 0) {
				dispatch({
					type: TYPES.PERSONAL_LOGIN_INFO,
					isLogin: true,
					baseInfo: data.data
				});
			}
		}
	},
	//同步退出登录信息
	resetBaseInfo() {
		return {
			type:TYPES.PERSONAL_LOGIN_INFO,
			isLogin:false,
			baseInfo: null
		}
	}
};