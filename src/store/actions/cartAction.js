import * as TYPES from '../action-types';
import api from '../../api/index';

export default {
    syncOrderList() {
        return async dispatch => {
            //不传参，默认获取全部订单信息
            let data = await api.cart.list();
            if(parseInt(data.code) === 0) {
                dispatch({
                    type:TYPES.CART_ORDERALL,
                    payload:data.data
                })
            }
        }
    },
    // 修改全选
    updateSelectAll(flag) {
        return {
            type: TYPES.CART_UPDATE_SELECT_ALL,
            flag
        }
    },
    //修改单一选中态
    updateSelect(cartId,flag) {
        return {
            type: TYPES.CART_UPDATE_SELECT,
            cartId,
            flag
        }
    },
    //修改编辑态全选
    updateSelectAllEdite(flag) {
        return {
            type: TYPES.CART_UPDATE_SELECT_ALL_EDITE,
            flag
        }
    },
    // 修改编辑态单一选中态
    updateSelectEdite(cartId,flag) {
        return {
            type: TYPES.CART_UPDATE_SELECT_EDITE,
            cartId,
            flag
        }
    },
    // 修改编辑态
    updateEdite(flag) {
        return {
            type: TYPES.CART_UPDATE_EDITE,
            flag
        };
    },
    //修改购物车商品数量
    updateCount(cartId, count) {
        return {
            type: TYPES.CART_UPDATE_COUNT,
            cartId,
            count
        }
    },
    //删除购物车商品
    removeCart(cartId) {
        return {
            type: TYPES.CART_REMOVE,
            cartId
        }
    }
}