import axios from './axios';
import md5 from 'blueimp-md5';
const suffix = '/user';
export default {
	loginPOST(account, password, type = 1) {
		return axios.post(`${suffix}/login`, {
			account,
			password: md5(password),
			type
		});
	},
	loginGET() {
		return axios.get(`${suffix}/login`);
	},
	signout() {
		return axios.get(`${suffix}/signout`);
	},
	register(name, phone, password, passwordPay) {
		return axios.post(`${suffix}/register`, {
			name,
			phone,
			password: md5(password),
			passwordPay: md5(passwordPay)
		});
	},
	info(id) {
		let params = {};
		if (id) {
			params.id = id;
		}
		return axios.get(`${suffix}/info`, {
			params
		});
	},
	phone(phone) {
		return axios.post(`${suffix}/phone`, {
			phone
		});
	},
	code(phone) {
		return axios.post(`${suffix}/code`, {
			phone
		});
	},
	checkCode(phone, code) {
		return axios.post(`${suffix}/checkCode`, {
			phone,
			code: md5(code)
		});
	}
};