import React, { useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Info.less';
import actions from '../../store/actions/index';
import api from '../../api';

const TipBox = withRouter(function (props) {
    let { title, link, icon, history } = props;
    return <div className='tipBox'
        onClick={ev => {
            if (link) {
                history.push(link);
            }
        }}>
        <div className="title">
            {/* 这里传了2种样式类名 */}
            <i className={'icon ' + (icon || '')}></i>
            <span>{title}</span>
        </div>
        <div className="arrow"></div>
    </div>;
});

function Info(props) {
    let { history, isLogin, baseInfo, syncLoginInfo } = props;

    useEffect(() => {
        if (!baseInfo) {
            //刷新过后没有登录，派发一个任务,重新从服务器获取用户信息
            syncLoginInfo();
        }
    }, []);

    return <div className='personalBox'>
        <div className='header'>
            <div className='pic'>
                {isLogin ? <img src={baseInfo.pic} alt='' /> : null}
            </div>
            <p className='account' onClick={ev => {
                if (isLogin) return;
                history.push('/personal/login')
            }}>{isLogin ? baseInfo.name : '请登录'}</p>
        </div>
        <TipBox title='我的订单' icon='icon6' link='/personal/order' />
        <div className='orderIcon'>
            {['待付款', '待收货', '待评价', '退款/售后'].map((item, index) => {
                const text = '/personal/order?lx=' + (index + 1);
                return <Link to={text} className='item' key={index}>
                    <i className='icon'></i>
                    <span>{item}</span>
                </Link>
            })}
        </div>
        <a className='guanggao'>
            <img src='https://img.youpin.mi-img.com/yingkebao/90337d93e628939c590fbe1a1cf338bf.gif?w=1080&h=210' alt='' />
        </a>
        <TipBox title='我的资产' icon='icon1' />
        <TipBox title='拼团' icon='icon2' />
        <TipBox title='我的收藏' icon='icon3' />
        <TipBox title='地址管理' icon='icon4' />
        <TipBox title='协议规则' icon='icon5' />
        <TipBox title='资质与证照' icon='icon6' />
        <TipBox title='帮助与反馈' icon='icon7' />
        {isLogin ? <button className='singoutBtn' onClick={async ev => {
            let data = await api.personal.signout();
            if (parseInt(data.code) !== 0) {
                window.alert('操作失败，请稍后再试！');
                return;
            }
        }}>退出登录</button> : null}
    </div>
}

export default connect(state => state.personal, actions.personal)(Info);