const express = require('express'),
	route = express.Router();

const {
	writeFile
} = require('../utils/promiseFS');

const {
	success,
	queryMyCartList,
	createID,
	queryProductInfo
} = require('../utils/tools');

// 加入购物车
route.post('/add', (req, res) => {
	// 获取传递的信息
	let myDATA = queryMyCartList(req) || [];
	let {
		pid,
		count = 1
	} = (req.body || {});
	// 验证当前产品是否已经加入到购物车
	let flag = myDATA.find(item => parseInt(item.pid) === parseInt(pid));
	if (flag) {
		// 修改数量
		req.$ORDER_DATA = req.$ORDER_DATA.map(item => {
			if (parseInt(item.uid) === req.session.userId && parseInt(item.pid) === parseInt(pid) && parseInt(item.state) === 1) {
				item.count = parseInt(item.count) + 1;
			}
			return item;
		});
	} else {
		// 新增购物车信息
		req.$ORDER_DATA.push({
			id: createID(req.$ORDER_DATA),
			uid: req.session.userId,
			pid,
			count,
			state: 1,
			time: new Date().getTime()
		});
	}
	writeFile('./mock/order.json', req.$ORDER_DATA).then(() => {
		res.send(success(true));
	}).catch(() => {
		res.send(success(false));
	});
});

// 修改购物车某产品数量
route.post('/update', (req, res) => {
	let myDATA = queryMyCartList(req) || [];
	let {
		id,
		count
	} = (req.body || {});
	// 校验当前订单是否为自己的订单
	let flag = myDATA.find(item => parseInt(item.id) === parseInt(id));
	if (flag) {
		// 是：修改订单数量
		req.$ORDER_DATA = req.$ORDER_DATA.map(item => {
			if (parseInt(item.id) === parseInt(id)) {
				count = count < 1 ? 1 : count;
				item.count = count;
			}
			return item;
		});
		writeFile('./mock/order.json', req.$ORDER_DATA).then(() => {
			res.send(success(true));
		}).catch(() => {
			res.send(success(false));
		});
		return;
	}
	res.send(success(false, {
		codeText: 'order does not exist！'
	}));
});

// 移除购物车中的某产品
route.get('/remove', (req, res) => {
	let id = req.query.id;
	let myDATA = queryMyCartList(req) || [];
	// 校验当前订单是否为自己的订单
	let flag = myDATA.find(item => parseInt(item.id) === parseInt(id));
	if (flag) {
		req.$ORDER_DATA = req.$ORDER_DATA.filter(item => parseInt(item.id) !== parseInt(id));
		writeFile('./mock/order.json', req.$ORDER_DATA).then(() => {
			res.send(success(true));
		}).catch(() => {
			res.send(success(false));
		});
		return;
	}
	res.send(success(false, {
		codeText: 'order does not exist！'
	}));
});

// 获取当前用户指定状态下的订单信息
route.get('/list', (req, res) => {
	let state = req.query.state || 0;
	if (parseInt(state) !== 0) {
		req.$ORDER_DATA = req.$ORDER_DATA.filter(item => {
			return parseInt(item.state) === parseInt(state) && parseInt(item.uid) === req.session.userId;
		});
	}
	if (req.$ORDER_DATA && req.$ORDER_DATA.length > 0) {
		// 重构返回的数据格式
		let data = [];
		req.$ORDER_DATA.forEach(item => {
			data.push({
				id: item.id,
				pid: item.pid,
				count: item.count,
				state: item.state,
				info: queryProductInfo(req, item.pid)
			});
		});
		res.send(success(true, {
			data
		}));
		return;
	}
	res.send(success(false, {
		codeText: 'order does not exist！'
	}));
});

// 修改订单的状态
route.get('/state', (req, res) => {
	let {
		id,
		state
	} = req.query;
	let flag = false;
	req.$ORDER_DATA = req.$ORDER_DATA.map(item => {
		if (parseInt(item.id) === parseInt(id)) {
			item.state = state;
			flag = true;
		}
		return item;
	});
	if (flag) {
		writeFile('./mock/order.json', req.$ORDER_DATA).then(() => {
			res.send(success(true));
		}).catch(() => {
			res.send(success(false));
		});
		return;
	}
	res.send(success(false));
});
module.exports = route;