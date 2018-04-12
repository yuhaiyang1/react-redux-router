import React, { Component } from 'react';
import {Input, Icon, message, Button, Avatar} from 'antd'
import {connect} from 'react-redux'
import {fetchData} from '../../fetch/fetch'
import './index.css'
import './antd.css'
import {userInfo, loginStatus} from '../../redux/actions'
@connect((state) => {
  const {loginStatus} = state
  return {
    loginStatus
  }
})
export default class App extends Component {
  state = {
    usrname: '',
    password: '',
    checkStatus: true
  }
  handChangle (e, type) {
    const val = e.target.value
    switch (type) {
      case 'username':
        this.setState({username: val})
        break;
      case 'password':
        this.setState({password: val})
        break;
      default:
        break;
    }
  }
  login = async () => {
    const {username} = this.state
    if(username) {
      await this.getPersonInfo(username)
      await this.getPersonReops(username)
      this.props.dispatch(loginStatus(true))
      window.localStorage.setItem('username', username)
     
    }else{
      message.error('用户名或者密码没填')
    }
  }
  // 获取个人账号信息
  async getPersonInfo (username) {
    try {
      const res = await fetchData({
        url: `https://api.github.com/users/${username}`,
        type: 'get',
        data: {}
      })
      if(res.avatar_url) {
        const {avatar_url} = res
        window.localStorage.setItem('avatar_url',avatar_url)
        this.props.dispatch(userInfo({username, avatar_url}))
      }else{
        message.error('账号不存在')
        this.props.dispatch(userInfo({username: '', avatar_url: ''}))
      }
    } catch (error) {
      message.error('账号不存在')
      this.props.dispatch(userInfo({username: '', avatar_url: ''}))
      this.props.dispatch(loginStatus(false))
    }
  }
  // 获取个人仓库信息
  async getPersonReops (username) {
    try {
      const res = await fetchData({
        url: `https://api.github.com/users/${username}/repos?type=owner`,
        type: 'get',
        data: {}
      })
      if(res) {
        console.log(res)
      }else{
        message.error('账号不存在')
      }
    } catch (error) {
      message.error('账号不存在')
      this.props.dispatch(loginStatus(false))
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
          placeholder='请输入github用户名'
          onChange={(e) => this.handChangle(e, 'username')}
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