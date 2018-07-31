import React, { Component } from 'react';
import {Input, Icon, message, Button, Avatar} from 'antd'
import {connect} from 'react-redux'
import {fetchData} from '../../fetch/fetch'
import './index.css'
import './antd.css'
import '../../mock/login'
import {userInfo, loginStatus} from '../../redux/actions'
@connect((state) => {
  const {loginStatus} = state
  return {
    loginStatus
  }
})
export default class Login extends Component {
  state = {
    usrname: '',
    checkStatus: true
  }
  handChangle = (type) => (e) => {
    // this.setState(null)
    this.setState({[type]: e.target.value})
  }
  login = async () => {
    const {username} = this.state
    const res = await fetchData({
      url: '/login',
      type: 'post'
    })
    if(res.success) {
      this.props.dispatch(loginStatus(true))
      this.props.dispatch(userInfo({username}))
      window.localStorage.setItem('username', username)
    }else{
      message.error('用户名或者密码没填')
    }
  }
  
  renderForm () {
    return <div className='loginArea'>
      <div className='users'> 
      <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521460109012&di=d6efc7cc504cd0dbaeda93837ec5fdda&imgtype=0&src=http%3A%2F%2Fs9.51cto.com%2Fwyfs02%2FM00%2F24%2FE8%2FwKiom1NWK0Whszx9AAD_GyJVjNA483.jpg'/>
       
      </div>
      <div className='col'>
        <Input
          className='input'
          placeholder='请输入用户名'
          onChange={this.handChangle('username')}
        />
      </div>
      <div className='col'>
        <Button  type="primary" onClick={this.login} className='input'>登录</Button>
      </div>
    </div>
  }
  renderHasLogin () {
    return (
      <div style={{lineHeight: '200px', textAlign: 'center'}}>
        <h3>你已经登陆啦！如果需要切换账号，请在右上角点击登出</h3>
      </div>
    )
  }
  render() {
    console.log(this.state.foo, 'foo')
    return (
      <div>
        { !this.props.loginStatus
          ? this.renderForm()
          : this.renderHasLogin()
        }
      </div>
    )
  }
}