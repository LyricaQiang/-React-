import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './Pay.less';
import api from '../api/index';
import actions from '../store/actions/index';

function handle(ev, arr, changeArr, orderList, props) {
	const target = ev.target,
		text = target.innerHTML;
	if (target.tagName !== 'SPAN') return;
	if (!isNaN(text)) {
		// 数字
		for (let i = 0; i < arr.length; i++) {
			let item = arr[i];
			if (item === null) {
				arr[i] = parseInt(text);
				break;
			}
		}
		changeArr([...arr]);
		return;
	}
	if (text === '删除') {
		// 删除
		for (let i = arr.length - 1; i >= 0; i--) {
			let item = arr[i];
			if (item !== null) {
				arr[i] = null;
				break;
			}
		}
		changeArr([...arr]);
		return;
	}
	if (text === '确认') {
		// 支付
		// 本应该向服务器发请求验证（但是忘记写后台接口了）
		if (arr.join('') !== '888888') {
			window.alert('密码不正确~~');
			return;
		}
		orderList = orderList.map(item => {
			return api.cart.state(item.id, 2);
		});
		Promise.all(orderList).then(results => {
			// 最好还需要验证一下，每一个的code是都都为0
			const flag = results.find(item => {
				return parseInt(item.code) !== 0;
			});
			if (!flag) {
				//成功
					props.syncOrderList();
					props.history.push('/personal/order?lx=2');
				return;
			}
			return Promise.reject();
		}).catch(reason => {
			window.alert('部分订单支付失败，请稍后再试~~');
		});
	}
}

function Pay(props) {
	const { payVisable = false, orderList = [], updateVisable } = props;

	let [arr, changeArr] = useState(new Array(6).fill(null));

	return <div className="payBox"
		style={{
			display: payVisable ? 'block' : 'none'
		}}>
		<a className="closeBtn" onClick={ev => {
			changeArr(new Array(6).fill(null));
			updateVisable(false);
		}}>关闭</a>

		<h4>请输入支付密码（六位数字）</h4>
		<div className="center">
			{arr.map((item, index) => {
				return <input type="password" disabled key={index} value={item !== null ? item : ''} />;
			})}
		</div>
		<div className="keyBox clearfix"
			onClick={ev => {
				handle(ev, arr, changeArr, orderList, props);
			}}>
			<span>1</span>
			<span>2</span>
			<span>3</span>
			<span>4</span>
			<span>5</span>
			<span>6</span>
			<span>7</span>
			<span>8</span>
			<span>9</span>
			<span>0</span>
			<span>删除</span>
			<span>确认</span>
		</div>
	</div>;
}

export default withRouter(connect(null, actions.cart)(Pay));