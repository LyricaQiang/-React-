import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import HeaderNav from '../../components/HeaderNav';
import './Order.less';
import actions from '../../store/actions/index';
import api from '../../api/index';

function orderFn(orderList, syncOrderList) {
    if (!orderList) {
        syncOrderList();
    }
}

// 想用redux里面的信息就引入connect
//location保存的是当前传进来的search值,路径
function Order(props) {
    let { history, location, isLogin, baseInfo, syncLoginInfo, orderList, syncOrderList } = props;

    let [active, changeActive] = useState(() => {
        let search = location.search || '';
        let searchObj = {};
        search.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, key, value) => {
            searchObj[key] = value;
        });
        //如果不存在类型值lx，就给默认值0
        return parseInt(searchObj.lx) || 0;
    });

    //根据不同的状态渲染不同的订单信息
    let dataList = null;
    if (orderList && orderList.length > 0) {
        if (active === 0) {
            dataList = orderList;
        } else {
            dataList = orderList.filter(item => {
                return parseInt(item.state) === active
            });
        }
    }

    //useEffect不支持直接加async,所以用一个方法包起来
    //第一次加载这个组件：从服务器获取是否登录
    //1.没登陆提示跳转到登录
    //2.已经登录：需要派发任务同步redux的结果
    useEffect(() => {
        //如果是已经登录的状态，以下这些操作都不用进行了，直接return
        async function fetchData() {
            //获取订单信息
            if (baseInfo) {
                orderFn(orderList, syncOrderList);
                return;
            };

            //从服务器获取是否登录
            let data = await api.personal.loginGET();
            if (parseInt(data.code) === 0) {
                //获取订单信息
                orderFn(orderList, syncOrderList);
                //已经登录：需要派发任务同步redux的结果,更新redux中的东西
                syncLoginInfo();
                return;
            }
            //否则跳转到登录页面
            history.push('/personal/login');
        }
        fetchData();
    }, []);



    return <>
        {isLogin ? <section className='personalOrder'>
            <HeaderNav title='我的订单' />
            <div className='navBox'>
                {['全部订单', '待付款', '待收货', '待评价', '退款订单'].map((item, index) => {
                    return <Link key={index} to={'/personal/order?lx=' + index}
                        className={index === active ? 'active' : ''}
                        onClick={ev => {
                            changeActive(index);
                        }}>
                        {item}
                    </Link>
                })}
            </div>
            {dataList && dataList.length > 0 ? <ul className='list'>
                {dataList.map(item => {
                    return <li key={item.id}>
                        <div className='info'>
                            <Link to={'/detail/' + item.pid}>
                                <div className='top'>
                                    <div className='pic'>
                                        <img src={item.info.pic} alt='' />
                                    </div>
                                    <p className='title'>
                                        {item.info.title}
                                    </p>
                                    <div className='price'>
                                        <span>￥{item.info.price}</span>
                                        <span>X{item.count}</span>
                                    </div>
                                </div>
                                <div className='bottom'>
                                    共{item.count}件商品，总金额<span>￥{item.count * item.info.discount}</span>
                                </div>
                            </Link>
                        </div>
                        <div className='handle'>
                            {item.state == 1 ? <>
                                <button className='cancel'>取消</button>
                                <button>支付</button>
                            </> : null}
                            {item.state == 2 ? <>
                                <button>确认收货</button>
                            </> : null}
                            {item.state == 3 ? <>
                                <button>写评价</button>
                            </> : null}
                            {item.state == 4 ? <>
                                <button>申请退款</button>
                            </> : null}
                        </div>
                    </li>
                })}
            </ul> : <div className='noTip'>
                    <i></i>
                    目前没有任何订单哦
        </div>}
        </section> : null}
    </>
}

export default connect(state => {
    return {
        ...state.personal,
        ...state.cart
    }
}, {
    ...actions.personal,
    ...actions.cart
})(Order);