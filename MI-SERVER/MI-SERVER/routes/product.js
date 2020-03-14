const express = require('express'),
	route = express.Router();

const {
	success,
	queryProductInfo
} = require('../utils/tools');

route.get('/banner', (req, res) => {
	res.send(success(true, {
		data: req.$BANNER_DATA
	}));
});

route.get('/list', (req, res) => {
	let {
		type = '',
			recommend = false
	} = req.query;
	if (type) {
		req.$PRODUCT_DATA = req.$PRODUCT_DATA.filter(item => {
			return item.category1 === type;
		});
	}
	if (recommend) {
		req.$PRODUCT_DATA = req.$PRODUCT_DATA.filter(item => {
			return item.recommend === true;
		});
	}
	if (req.$PRODUCT_DATA && req.$PRODUCT_DATA.length > 0) {
		res.send(success(true, {
			data: req.$PRODUCT_DATA
		}));
		return;
	}
	res.send(success(false));
});

route.get('/limited', (req, res) => {
	// 按照正常需要获取传递进来的时间，在商品库中选择限时抢购时间和其相符合的，但是由于后台数据太少，我们则只要是限时抢购的都算上
	let {
		time
	} = req.query;
	if (time) {
		req.$PRODUCT_DATA = req.$PRODUCT_DATA.filter(item => item.limitedTime);
	} else {
		req.$PRODUCT_DATA = [];
	}
	if (req.$PRODUCT_DATA && req.$PRODUCT_DATA.length > 0) {
		res.send(success(true, {
			data: req.$PRODUCT_DATA
		}));
		return;
	}
	res.send(success(false));
});

route.get('/info', (req, res) => {
	const data = queryProductInfo(req, req.query.id);
	if (data) {
		res.send(success(true, {
			data
		}));
		return;
	}
	res.send(success(false));
});

route.get('/category', (req, res) => {
	res.send(success(true, {
		data: req.$CATEGORY_DATA
	}));
});

route.head('/serverTime', (req, res) => {
	res.send(success(true));
});
module.exports = route;