import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Login.less';
import api from '../../api';
import actions from '../../store/actions/index';

class Login extends React.Component {
    state = {
        //登录状态管理，1是账号密码登录，2是验证码登录
        type: 1,
        account: '',
        password: '',
        //倒计时
        isRun: false,
        runTime: 30
    }
    render() {
        let { type, account, password, isRun, runTime } = this.state;

        return <section className='loginBox'>
            <div className='header'>
                <h4>欢迎登录小米有品</h4>
            </div>
            <div className='main'>
                {type === 2 ? <>
                    <div className='inpBox'>
                        <input type='text' placeholder='手机号码' value={account} onChange={ev => {
                            this.setState({ account: ev.target.value })
                        }} />
                    </div>
                    <div className='inpBox'>
                        <input type='text' placeholder='短信验证码' value={password} onChange={ev => {
                            this.setState({ password: ev.target.value })
                        }} />
                        <a className={isRun ? 'noClick' : ''} onClick={this.sendCode}>{isRun ? `${runTime}S后重发` : '获取验证码'}</a>
                    </div>
                </> : <>
                        <div className='inpBox'>
                            <input type='text' placeholder='用户名/手机号码' value={account} onChange={ev => {
                                this.setState({ account: ev.target.value })
                            }} />
                        </div>
                        <div className='inpBox'>
                            <input type='password' placeholder='密码' value={password} onChange={ev => {
                                this.setState({ password: ev.target.value })
                            }} />
                        </div>
                    </>}


                <button className='submit' onClick={this.handleLogin}>立即登录</button>
                <span className='changeBtn' onClick={this.handleChange}>{type === 2 ? '用户名密码登录' : '短信验证码登录'}</span>
            </div>
            <div className='register'>
                <Link to='/personal/register'>立即注册</Link>
                <a>忘记密码</a>
            </div>
            <div className='other'>
                <span>其它登录方式</span>
                <div>
                    <a></a>
                    <a></a>
                    <a></a>
                </div>
            </div>
            <div className='footer'>
                <span>首页</span>|<span>简体</span>|<span>English</span>|<span>常见问题</span>|<span>隐私政策</span>
            </div>
        </section>
    }
    //两种登录方式的切换
    handleChange = () => {
        let { type } = this.state;

        this.setState({
            type: type === 1 ? 2 : 1,
            account: '',
            password: ''
        })
    }

    //发送验证码
    sendCode = async () => {
        let { account, isRun } = this.state;
        //进行手机号校验
        if(!/^1\d{10}$/.test(account)) {
            window.alert('手机号码格式不对');
            return;
        }

        //验证手机号码是否被注册，发送到服务器
        let data = await api.personal.phone(account);
        if(parseInt(data.code) !== 0) {
            window.alert('当前手机号未被注册');
            return;
        }

        data = await api.personal.code(account);
        if(parseInt(data.code) !== 0) {
            window.alert('发送失败，稍后再试！');
            return;
        }

        this.setState({isRun: true})

        this.codeTimer = setInterval(() => {
            let time = this.state.runTime;
            time--;

            if(time === 0) {
                clearInterval(this.codeTimer);
                this.setState({
                    isRun: false,
                    runTime: 30
                })
                return;
            }
            this.setState({runTime: time});
        },1000)
    }

    //提交功能
    handleLogin = async () => {
        let { account, password, type } = this.state;

        if(type === 2) {
            //手机号和验证码格式
            if (!/^1\d{10}$/.test(account)) {
            window.alert('手机格式不对')
            return;
          }
            if (!/^\d{6}$/.test(password)) {
            window.alert('验证码格式不对')
            return;
          }
        } else {
            if (account.length === 0 ) {
                window.alert('账号不能为空')
                return;
            }
            if (!/^\w{6,16}$/.test(password)) {
                window.alert('密码格式不对')
                return;
            }
        }
        let data = await api.personal.loginPOST(account,password,type);
        if(parseInt(data.code) !== 0) {
            window.alert(`登陆失败, ${type === 2 ?'验证码输入有误!':'账号密码不匹配'}`)
            return;
        }

        // 把登录态和基本信息存储到redux中
        this.props.loginSuccess(data.data);
        //路由跳转
        let search = this.props.location.search;
        //search存在并且..
        if(search && search.includes('noback')) {
            this.props.history.push('/personal');
        } else {
            this.props.history.go(-1);
        }
    }
}

export default connect(null, actions.personal)(Login);