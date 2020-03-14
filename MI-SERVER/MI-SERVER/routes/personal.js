const express = require('express'),
	route = express.Router();

const {
	handleMD5,
	success,
	queryUserInfo,
	checkPhone,
	random,
	createID
} = require('../utils/tools');

const {
	writeFile
} = require('../utils/promiseFS');

//=>用户登录
route.post('/login', (req, res) => {
	let {
		account,
		password,
		type = 1
	} = req.body || {};
	password = handleMD5(password);
	type = parseInt(type);
	let data = null;
	if (type === 1) {
		// 密码校验方式
		data = req.$USER_DATA.find(item => {
			return (item.name === account || item.phone === account) && item.password === password;
		});
	} else {
		// 短信校验方式
		let result = req.$CODE_DATA.find(item => {
			// 时间不能超过30分钟
			let nowT = new Date().getTime(),
				spanT = nowT - parseInt(item.time);
			return item.phone === account && item.code === password && spanT <= (30 * 60 * 1000);
		});
		if (result) {
			// 找到匹配的验证信息，获取当前人员的基本信息
			data = req.$USER_DATA.find(item => {
				return item.phone === result.phone;
			});
		}
	}

	if (data) {
		// 登录成功
		req.session.userId = parseFloat(data.id);
		res.send(success(true, {
			codeText: 'login success!',
			data: {
				id: data.id,
				name: data.name,
				phone: data.phone,
				pic: data.pic
			}
		}));
		return;
	}
	// 登录失败
	res.send(success(false, {
		codeText: 'account and password or code mismatch!'
	}));
});

//=>检测是否登录
route.get('/login', (req, res) => {
	const userId = req.session.userId;
	if (userId) {
		res.send(success(true));
		return;
	}
	res.send(success(false, {
		codeText: 'current user is not logged in!'
	}));
});

//=>退出登录
route.get('/signout', (req, res) => {
	req.session.userId = null;
	res.send(success(true));
});

//=>用户注册
route.post('/register', (req, res) => {
	req.body = req.body || {};
	// 首先检验手机号是否已经被注册
	const flag = checkPhone(req, req.body.phone);
	if (flag) {
		res.send(success(false, {
			codeText: 'mobile number is registered！'
		}));
		return;
	}
	// 注册信息
	let userDATA = req.$USER_DATA;
	let passDATA = Object.assign({
		id: createID(userDATA),
		name: '',
		phone: '',
		password: '',
		passwordPay: '',
		pic: 'https://app.youpin.mi.com/youpin/static/m/res/images/evaluation_icon_user.png'
	}, req.body);
	passDATA.password = handleMD5(passDATA.password);
	passDATA.passwordPay = handleMD5(passDATA.passwordPay);
	userDATA.push(passDATA);
	writeFile('./mock/user.json', userDATA).then(() => {
		res.send(success(true));
	}).catch(() => {
		res.send(success(false));
	});
});

//=>获取用户信息
route.get('/info', (req, res) => {
	const userId = req.query.id || req.session.userId;
	const data = queryUserInfo(req, userId);
	if (data) {
		res.send(success(true, {
			data: {
				id: data.id,
				name: data.name,
				phone: data.phone,
				pic: data.pic
			}
		}));
		return;
	}
	res.send(success(false));
});

//=>验证手机号是否注册
route.post('/phone', (req, res) => {
	req.body = req.body || {};
	const flag = checkPhone(req, req.body.phone);
	if (flag) {
		res.send(success(true));
		return;
	}
	res.send(success(false));
});

//=>发送短信验证码
const md5 = require('blueimp-md5');
route.post('/code', (req, res) => {
	req.body = req.body || {};
	const phone = req.body.phone,
		ran = random(),
		code = handleMD5(md5(ran));
	if (!phone) {
		res.send(success(false));
		return;
	}
	// 调用第三方平台发送短信
	// ...
	console.log(`生成的短信验证码：${phone} ==> ${ran}`);
	let codeDATA = req.$CODE_DATA;
	codeDATA.push({
		id: createID(codeDATA),
		phone: phone,
		code: code,
		time: new Date().getTime()
	});
	writeFile('./mock/code.json', codeDATA).then(() => {
		res.send(success(true));
	}).catch(() => {
		res.send(success(false));
	});
});

//=>校验验证码是否正确
route.post('/checkCode', (req, res) => {
	let {
		phone,
		code
	} = (req.body || {});
	code = handleMD5(code);
	const flag = req.$CODE_DATA.find(item => {
		let nowT = new Date().getTime(),
			spanT = nowT - parseInt(item.time);
		return item.phone === phone && item.code === code && spanT <= (30 * 60 * 1000);
	});
	if (flag) {
		res.send(success(true));
		return;
	}
	res.send(success(false));
});
module.exports = route;