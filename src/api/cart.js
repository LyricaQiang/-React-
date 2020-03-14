import axios from './axios';
const suffix = '/cart';

export default {
    list(state = 0) {
        return axios.get(`${suffix}/list`, {
            params: {
                state
            }
        });
    },
    //详情页添加商品
    add(pid, count = 1) {
        return axios.post(`${suffix}/add`, {
            pid,
            count
        });
    },
    //购物车页面修改购物车数量
    update(id, count = 1) {
        return axios.post(`${suffix}/update`, {
            id,
            count
        })
    },
    //移出购物车中的商品
    remove(id) {
        return axios.get(`${suffix}/remove`, {
            params: {
                id
            }
        })
    },
    //修改购物车商品状态
    state(id, state = 1) {
        return axios.get(`${suffix}/state`, {
            params: {
                id,
                state
            }
        })
    }
}