import React from 'react';
import { Link } from 'react-router-dom';
import './Login.less';
import api from '../../api/index';

class Register extends React.Component {
    state = {
        name: '',
        phone: '',
        code: '',
        password: '',
        passwordPay: '',
        // 发送验证码按钮状态
        isRun: false,
        runTime: 30
    }

    render() {
        let {name, phone, code, password, passwordPay, isRun, runTime } = this.state;
        // console.log(this.props)
        return <section className='loginBox'>
            <div className='header'>
                <h4>小米有品账号注册</h4>
            </div>
            <div className='main'>
                <div className='inpBox'>
                    <input type='text' placeholder='用户名' value={name} onChange={ev => {
                        this.setState({name:ev.target.value})
                    }} />
                </div>
                <div className='inpBox'>
                    <input type='text' placeholder='手机号码' value={phone} onChange={ev => {
                        this.setState({phone:ev.target.value})
                    }} />
                </div>
                <div className='inpBox'>
                    <input type='text' placeholder='短信验证码' className='short' value={code} onChange={ev => {
                        this.setState({code:ev.target.value})
                    }} />
                    <a onClick={this.sendCode} className={isRun ? `noClick` : ''}>
						{isRun ? `${runTime}S后重发` : '获取验证码'}
					</a>
                </div>
                <div className='inpBox'>
                    <input type='password' placeholder='登录密码' value={password} onChange={ev => {
                        this.setState({password:ev.target.value})
                    }} />
                </div>
                <div className='inpBox'>
                    <input type='password' placeholder='支付密码' value={passwordPay} onChange={ev => {
                        this.setState({passwordPay:ev.target.value})
                    }}  />
                </div>
                <button className='submit' onClick={this.handleRegister}>
                    立即注册
                </button>
                <Link to='/personal/login?noback' className='changeBtn'>已有账号，去登录！</Link>
            </div>
            <div className='footer'>
            <span>首页</span>|<span>简体</span>|<span>English</span>|<span>常见问题</span>|<span>隐私政策</span>
            </div>
        </section>
    }

    //表单验证
    checkPhone = () => {
        return /^1\d{10}$/.test(this.state.phone);
    }
    checkName = () => {
        return /^.{2,20}$/.test(this.state.name);
    }
    checkCode = () => {
        return /^\d{6}$/.test(this.state.code);
    }
    checkPassword = () => {
        return /^\w{6,16}$/.test(this.state.password);
    }
    checkPasswordPay = () => {
        return /^\d{6}$/.test(this.state.passwordPay);
    }

    sendCode = async () => {
        // console.log(this.props)
        if(this.state.isRun) return
        //验证手机号格式
        if(!this.checkPhone) {
            window.alert('必须保证手机号码不为空或者格式正确！');
            return;
        }
        //校验手机号是否被注册
        let data = await api.personal.phone(this.state.phone);
        if(parseInt(data.code) === 0 ) {
            window.alert('当前手机号已经被注册，您可以选择登录或者找回密码！');
            return;
        }

        //发送短信验证码失败
        data = await api.personal.code(this.state.phone);
        if(parseInt(data.code) !== 0) {
            window.alert('发送验证码错误，请稍后再试!！');
			return;
        }

        this.setState({ isRun:true });

        this.codeTimer = setInterval(() => {
            let time = this.state.runTime;
            time--;

            if(time ===0) {
                clearInterval(this.codeTimer);
                this.setState({
                    isRun: false,
                    runTime: 30
                })
                return;
            }
            this.setState({runTime:time});
        },1000)
    }

    handleRegister = async () => {
        //分别对表单进行校验
        if(!this.checkPhone) {
            window.alert('手机号码格式不正确！');
            return;
        }

        if(!this.checkName) {
            window.alert('用户名必须是2~20位！');
            return;
        }

        if(!this.checkCode) {
            window.alert('请输入有效验证码（6位数字）');
            return;
        }

        if(!this.checkPassword) {
            window.alert('密码不符合格式，正确规则：6~16位数字、字母、下划线');
            return;
        }

        if(!this.checkPasswordPay) {
            window.alert('支付密码不符合格式，正确规则：6位数字');
            return;
        }

        //将验证码传回服务器进行校验
        let data = await api.personal.checkCode(this.state.phone, this.state.code);
		if (parseInt(data.code) !== 0) {
			window.alert('请输入有效验证码（30MIN内有效）');
			return;
		}

        data = await api.personal.register(this.state.name, this.state.phone, this.state.password, this.state.passwordPay)

        if(parseInt(data.code) !== 0) {
            window.alert('注册失败，请稍后再试！');
            return;
        }

        this.props.history.push('/personal/login');
    }
}

export default Register;