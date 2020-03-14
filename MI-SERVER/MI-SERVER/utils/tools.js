// MD5的二次加密处理
function handleMD5(val = '') {
	val = val.substring(4);
	val = val.split('').reverse().join('');
	val = val.substring(4);
	return val;
}

// 返回结果的批处理
function success(flag = true, options = {}) {
	let defaults = {
		code: flag ? 0 : 1,
		codeText: flag ? 'OK' : 'NO'
	};
	return Object.assign(defaults, options);
}

// 获取手机校验码
function random() {
	const area = '0123456789';
	return new Array(6).fill(null).map(item => {
		return area[Math.round(Math.random() * 9)];
	}).join('');
}

// 自增长ID
function createID(data) {
	return data.length === 0 ? 1 : (parseInt(data[data.length - 1]['id']) + 1);
}

// 检测手机号是否被注册
function checkPhone(req, phone) {
	return req.$USER_DATA.find(item => {
		return item.phone === phone;
	});
}

// 获取会员基本信息
function queryUserInfo(req, id) {
	return req.$USER_DATA.find(item => {
		return parseInt(item.id) === parseInt(id);
	});
}

// 获取产品基本信息
function queryProductInfo(req, id) {
	return req.$PRODUCT_DATA.find(item => {
		return parseInt(item.id) === parseInt(id);
	});
}

// 获取当前用户所有购物车的信息
function queryMyCartList(req) {
	return req.$ORDER_DATA.filter(item => {
		return parseInt(item.state) === 1 && parseInt(item.uid) === req.session.userId;
	});
}

module.exports = {
	handleMD5,
	success,
	checkPhone,
	queryUserInfo,
	random,
	createID,
	queryProductInfo,
	queryMyCartList
};