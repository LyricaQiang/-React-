const CONFIG = require('./config'),
	session = require('express-session'),
	bodyParser = require('body-parser');

/*-CREATE SERVER-*/
const express = require('express'),
	app = express();
app.listen(CONFIG.PORT, () => {
	console.log(`SERVICE IS OK ===> ${CONFIG.PORT}`);
});

/*-MIDDLE WARE-*/
// 处理CORS跨域
app.use((req, res, next) => {
	const {
		ALLOW_ORIGIN,
		CREDENTIALS,
		HEADERS,
		ALLOW_METHODS
	} = CONFIG.CROS;
	res.header("Access-Control-Allow-Origin", ALLOW_ORIGIN);
	res.header("Access-Control-Allow-Credentials", CREDENTIALS);
	res.header("Access-Control-Allow-Headers", HEADERS);
	res.header("Access-Control-Allow-Methods", ALLOW_METHODS);
	req.method === 'OPTIONS' ? res.send('CURRENT SERVICES SUPPORT CROSS DOMAIN REQUESTS!') : next();
});
// 处理SESSION：req.session.xxx=xxx
app.use(session(CONFIG.SESSION));
// 处理客户端POST请求主体内容：req.body
app.use(bodyParser.urlencoded({
	extended: false
}));

/*-QUERY DATA-*/
const {
	readFile
} = require('./utils/promiseFS');

app.use(async (req, res, next) => {
	// 用户表
	req.$USER_DATA = JSON.parse(await readFile('./mock/user.json'));
	// 产品表
	req.$PRODUCT_DATA = JSON.parse(await readFile('./mock/product.json'));
	// 订单表
	req.$ORDER_DATA = JSON.parse(await readFile('./mock/order.json'));
	// 校验码表
	req.$CODE_DATA = JSON.parse(await readFile('./mock/code.json'));
	// 产品分类表
	req.$CATEGORY_DATA = JSON.parse(await readFile('./mock/category.json'));
	// 轮播图
	req.$BANNER_DATA = JSON.parse(await readFile('./mock/banner.json'));
	next();
});

/*-ROUTE-*/
app.use('/user', require('./routes/personal'));
app.use('/product', require('./routes/product'));
app.use('/cart', require('./routes/cart'));
app.use(express.static('./'));
app.use((req, res) => {
	res.status(404);
	res.send('NOT FOUND!');
});