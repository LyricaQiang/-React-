import React from 'react';
import { connect } from 'react-redux';
import './Computed.less';
import actions from '../../store/actions/index';
import api from '../../api';


function computedPrice(orderList) {
	if (!orderList) return 0;
	orderList = orderList.filter(item => parseInt(item.state) === 1);
	if (orderList.length === 0) return 0;
	return orderList.reduce((result, item) => {
		if (item.isSelect) {
			return result + (parseFloat(item.count * item.info.discount)) || 0;
		}
		return result;
	}, 0);
}

//支付前的操作提示
function handlePay(orderList) {
    if(!orderList) {
        window.alert('请选择您要支付的选项~~');
		return false;
    }

    orderList = orderList.filter(item => {
        return parseInt(item.state) === 1 && item.isSelect === true;
    })

    if(orderList.length === 0) {
        window.alert('请选择您要支付的选项~~');
		return false;
    }

    return true;
}

//移出购物车商品操作
function handleRemove(orderList, props) {
    if (!orderList) {
        window.alert('请选择您要删除的选项!');
        return;
    }

    orderList = orderList.filter(item => (parseInt(item.state) === 1 && item.isSelectEdite === true))
    if (orderList.length === 0) {
        window.alert('请选择您要删除的选项');
        return;
    }

    //一个个删除即可
    async function remove(orderList) {
        if(orderList.length === 0) {
            window.alert('选中的全部商品都已经被移除~~');
			return;
        }

        const item = orderList[0];
        const result = await api.cart.remove(item.id);
        if (parseInt(result.code) !== 0) {
            window.alert('删除失败，请稍后再试');
            return;
        }
        //删除数组元素第一个值，并返回这个值
        orderList.shift();
        //同步到redux
        props.removeCart(item.id);
        remove(orderList);
        // console.log(1)
    }
    //执行这个函数
    remove(orderList);
}

function Computed(props) {
    let { orderList, isSelectAll, updateSelectAll, isEdite, updateSelectAllEdite, isSelectAllEdite } = props;
    const SA = isEdite ? isSelectAllEdite : isSelectAll,
        USA = isEdite ? updateSelectAllEdite : updateSelectAll;
    return <div className='computedBox'>
        <div className='check' onClick={ev => {
            USA(!SA)
        }}>
            <i className={SA ? 'active' : ''}></i>
            <span>全选</span>
        </div>
        {isEdite ? <div className='result'>
            <button onClick={ ev => {handleRemove(orderList, props)}}>删除</button></div> : <div className='result'>
                <p>合计：<span>￥{computedPrice(orderList)}</span></p>
                <button onClick={ ev => {
                    if(handlePay(orderList)) {
                        props.updateVisable(true);
                    }
                }}>去支付</button>
            </div>}
    </div>
}

export default connect(state => state.cart, actions.cart)(Computed);