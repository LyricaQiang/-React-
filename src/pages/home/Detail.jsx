import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Swiper from 'swiper';
import './Detail.less';
import api from '../../api/index';
import actions from '../../store/actions/index';

function Detail(props) {
	const [data, changeData] = useState(null);

	//=>获取详情信息的
	useEffect(() => {
		//=>DidMount:发送请求获取产品详细信息
		//=>useEffect传递的函数不允许直接async，需要在里面单独定义函数处理
		async function fetchData() {
			const id = props.match.params ? props.match.params.id : 0;
			const data = await api.product.info(id);
			if (parseInt(data.code) === 0) {
				//=>获取数据成功
				changeData(data.data);
				return;
			}
			//=>获取数据失败
			window.alert('当前产品数据获取失败，请检查地址的有效性~~');
		}
		fetchData();
	}, []);

	//=>SWIPER
	useEffect(() => {
		if (data) {
			new Swiper('.detail-swiper', {
				loop: true,
				pagination: {
					el: '.swiper-pagination',
					// type: 'fraction'
				},
				autoplay: {
					delay: 2000,
					disableOnInteraction: false
				}
			});
		}
	}, [data]);

	//=>验证是否登录
	const baseInfo = props.personal.baseInfo;
	useEffect(() => {
		if (!baseInfo) {
			props.syncLoginInfo();
		}
	}, []);

	//=>同步订单信息（只要登录再加之redux中没有，则需要同步）
	let orderList = props.cart.orderList;
	if (baseInfo) {
		if (!orderList) {
			props.syncOrderList();
		}
	}

	//=>在所有订单中只获取状态为1的
	if (orderList) {
		orderList = orderList.filter(item => {
			return parseInt(item.state) === 1;
		});
	}

	//=>按钮点击处理
	async function handle(ev, type) {
		ev.preventDefault();
		//=>首先校验是否登录
		if (!baseInfo) {
			window.alert('请您先登录~~', {
				handled: () => {
					props.history.push('/personal/login');
				}
			});
			return;
		}
		//=>加入购物车（成功后同步REDUX） data.id=>产品ID
		let result = await api.cart.add(data.id);
		if (parseInt(result.code) !== 0) {
			window.alert('网络繁忙，请稍后再试~~');
			return;
		}
		props.syncOrderList();
	}

	return <>
		{data ? <section className="detailBox">
			<div className="swiper-container detail-swiper">
				<div className="swiper-wrapper">
					{data.images.map((item, index) => {
						return <div className="swiper-slide" key={index}>
							<img src={item} alt="" />
						</div>;
					})}
				</div>
				<div className="swiper-pagination"></div>
			</div>
			<div className="info">
				<div className="price">
					<span className="price1">￥{data.discount}</span>
					{data.discount === data.price ? null : <span className="price2">￥{data.price}</span>}
					{data.tag.split('|').map((item, index) => {
						return item ? <span className="tag" key={index}>
							{item}
						</span> : null;
					})}
				</div>
				<h5 className="title">{data.title}</h5>
				<p className="desc">{data.detail.text}</p>
			</div>
			{/* 在JSX中导入静态资源图片（相对地址），需要基于CommonJS/ES6Module规范导入，保证webpack编译的时候地址的正确性 */}
			<img src={require('../../assets/images/ce497b9d0341ac785d77e343dddab7e7.png')} alt="" className="guanggao" />
			<div className="xiangxi">
				{data.detail.images.map((item, index) => {
					return <img src={item} alt="" key={index} />;
				})}
			</div>
			{/* 头部 */}
			<div className="topBtn">
				<a className="return" onClick={ev => {
					props.history.go(-1);
				}}></a>
				<a className="home" onClick={ev => {
					props.history.push('/');
				}}></a>
			</div>
			{/* 底部 */}
			<div className="bottomBtn">
				<div className="cartIcon"
					onClick={ev => {
						props.history.push('/cart');
					}}>
					{orderList && orderList.length > 0 ? <em>
						{orderList.reduce((result, item) => {
							return result + parseInt(item.count);
						}, 0)}
					</em> : null}
					<i></i>
					<span>购物车</span>
				</div>
				<div className="btn">
					<a onClick={ev => {
						handle(ev, 'ADD');
					}}>加入购物车</a>
					<a onClick={ev => {
						handle(ev, 'PAY');
					}}>立即购买</a>
				</div>
			</div>
		</section> : null}
	</>;
}

export default connect(state => state, {
	...actions.personal,
	...actions.cart
})(Detail);