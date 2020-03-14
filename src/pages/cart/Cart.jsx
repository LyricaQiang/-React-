import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Cart.less';
import Recomend from './Recomend';
import Computed from './Computed';
import HeaderNav from '../../components/HeaderNav';
import Pay from '../../components/Pay';
import actions from '../../store/actions/index';
import api from '../../api/index';

//把购物车列表页面的提示封装成一个函数式组件（优化操作）
// type = 0 =>未登录
// type = 1 =>没有信息
function Tip(props) {
    const type = props.type;
    return <div className='noTip'>
        <i></i>
        {type === 0 ? <>
        您还没有登录
    <Link to='/personal/login'>立即登录</Link>
    </> : '购物车没有信息，先去逛逛吧~'}
    </div>
}

class Cart extends React.Component {
    //支付弹层的状态
    state = {
        payVisable: false,
    };

    componentWillMount() {
        let baseInfo = this.props.personal.baseInfo;
        //=>redux中没有信息，可能登陆也可能没登录，所以需要派发任务，从服务器同步登录态到redux中
        if (!baseInfo) {
            this.props.syncLoginInfo();
        }
    }

    render() {
        // 从redux中完成状态的单一商品方法获取
        let updateSelect = this.props.updateSelect;

        //从redux中编辑、完成按钮的状态获取
        let isEdite = this.props.cart.isEdite;
        let updateEdite = this.props.updateEdite;

        //从redux中编辑状态的单一商品方法获取
        let updateSelectEdite = this.props.updateSelectEdite;

        // 从redux中获取购物车列表信息
        let baseInfo = this.props.personal.baseInfo;
        let orderList = this.props.cart.orderList;

        if (baseInfo && !orderList) {
            //=>从REDUX中获取购物车列表信息
            this.props.syncOrderList();
        }

        if (orderList) {
            orderList = orderList.filter(item => {
                return parseInt(item.state) === 1;
            });
        }

        //获取PAY组件的状态
        let { payVisable, cartList } = this.state;

        return <section className='cartBox'>
            <HeaderNav title='购物车'>
                <span onClick={ev => {
                    updateEdite(!isEdite)
                }}>{isEdite ? '完成' : '编辑'}</span>
            </HeaderNav>
            {!baseInfo ? <Tip type={0} /> : (!orderList || orderList.length === 0 ? <Tip type={1} /> : <div className='list'>{
                    orderList.map(item => {
                        const S = isEdite ? item.isSelectEdite : item.isSelect,
                            US = isEdite ? updateSelectEdite : updateSelect;
                        return <Link to={'/detail/' + item.pid} className='clearfix' key={item.id}>
                            <i className={S ? 'check active' : 'check'} onClick={ev => {
                                ev.preventDefault();
                                US(item.id, !S);
                            }}></i>
                            <div className='pic'>
                                <img src={item.info.pic} alt='' />
                            </div>
                            <div className='desc'>
                                <p>{item.info.title}</p>
                                <p>￥{item.info.discount}</p>
                            </div>
                            <div className='count'>
                                <i className={parseInt(item.count) === 1 ? 'minus disable' : 'minus'} onClick={ev => {
                                    ev.preventDefault();
                                    item.count--;
                                    this.handle('minus', item.id, item.count);
                                }}></i>
                                <input type='number' value={item.count} />
                                <i className='plus' onClick={ev => {
                                    ev.preventDefault();
                                    this.handle('plus', item.id, item.count);
                                }}></i>
                            </div>
                        </Link>
                    })
                }</div>)}
            {/* <Recomend /> */}
            <Computed updateVisable={this.updateVisable} />
            {/* 父组件传递给子组件的属性和方法 */}
            <Pay payVisable={payVisable} updateVisable={this.updateVisable} cartList={cartList} />
        </section>
    }

    //控制支付弹层是否显示
    updateVisable = flag => {
        this.setState({
            payVisable: flag
        })
    }

    //加减按钮的操作
    handle = async (type, cartId, count) => {
        if(type === 'minus'){
            if(count <= 1) return;
            count--;
        } else {
            count++;
        }

        //向服务器发送修改商品数量的请求
        let result = await api.cart.update(cartId, count);
        console.log(cartId,count)
        if(parseInt(result.code) === 1) {
            window.alert('当前网络繁忙，请稍后再试');
            return;
        }
        //=>同步redux（最省事的方式：syncOrderList，性能好的方式：自己去修改redux中的信息）
        this.props.updateCount(cartId, count);
    }


}

export default connect(state => state, {
    ...actions.personal,
    ...actions.cart
})(Cart);