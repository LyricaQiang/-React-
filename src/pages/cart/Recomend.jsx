import React from 'react';
import { Link } from 'react-router-dom';
import './Recomend.less';
export default function Recomend(props) {
	return <div className="recomendBox">
		<h4>
			<i></i>
			<span>为你推荐</span>
			<i></i>
		</h4>
		<div className="rec_list">
			<Link to='/detail/xxx'>
				<div className="pic">
					<img src="https://img.youpin.mi-img.com/shopmain/6d3de990662baf1e60d64142bb0d4e65.png?w=800&h=800" alt="" />
					<div className="tag"><em>特价</em></div>
				</div>
				<p>海之蓝旗舰版 520ml*2瓶</p>
				<p>香气幽雅怡人，入口绵柔顺喉</p>
				<p>￥122起</p>
			</Link>
			<Link to='/detail/xxx'>
				<div className="pic">
					<img src="https://img.youpin.mi-img.com/shopmain/6d3de990662baf1e60d64142bb0d4e65.png?w=800&h=800" alt="" />
					<div className="tag"><em>特价</em></div>
				</div>
				<p>海之蓝旗舰版 520ml*2瓶</p>
				<p>香气幽雅怡人，入口绵柔顺喉</p>
				<p>￥122起</p>
			</Link>
			<Link to='/detail/xxx'>
				<div className="pic">
					<img src="https://img.youpin.mi-img.com/shopmain/6d3de990662baf1e60d64142bb0d4e65.png?w=800&h=800" alt="" />
					<div className="tag"><em>特价</em></div>
				</div>
				<p>海之蓝旗舰版 520ml*2瓶</p>
				<p>香气幽雅怡人，入口绵柔顺喉</p>
				<p>￥122起</p>
			</Link>
			<Link to='/detail/xxx'>
				<div className="pic">
					<img src="https://img.youpin.mi-img.com/shopmain/6d3de990662baf1e60d64142bb0d4e65.png?w=800&h=800" alt="" />
					<div className="tag"><em>特价</em> <em>秒杀</em></div>
				</div>
				<p>海之蓝旗舰版 520ml*2瓶,海之蓝旗舰版 520ml*2瓶</p>
				<p>香气幽雅怡人，入口绵柔顺喉</p>
				<p>￥122起</p>
			</Link>
		</div>
	</div>;
}