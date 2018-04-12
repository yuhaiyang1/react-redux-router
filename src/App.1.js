import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg'
import Demo from './routers/index'
import {connect} from 'react-redux'
import { BrowserRouter as Router, Route, Switch, Redirect, NavLink} from 'react-router-dom'
import Login from './component/login/login'
import {Avatar} from 'antd'
import {logout} from './redux/actions'
const UnauthorizedLayout = () => (
  <Switch>
    <Route path='/' component={Login} />
  </Switch>
)
@connect((state) => {
  const {userInfo} = state
  return {
    username: userInfo.username,
    avatar_url: userInfo.avatar_url
  }
})
class AuthorizedLayout extends Component {
  logout = () => {
    this.props.dispatch(logout(false))
  }
  render () {
    const { username, avatar_url} = this.props
    return (
      <div>
        <div id='main'>
          <div className='menu'>
            <NavLink to='/home' className='link' activeClassName="selected">主页 </NavLink>
            <NavLink to='/about' className='link' activeClassName="selected">商城</NavLink>
            <div className='logout'>
              {username}
              <Avatar src={avatar_url}/>
              <span onClick={this.logout}>登出</span>
            </div>
          </div>
            <Switch>
              <Demo />
            </Switch>
        </div>
      </div>
    )
  }
}
@connect((state) => {
  const {userInfo, loginStatus} = state
  return {
    username: userInfo.username,
    loginStatus
  }
})
class App extends Component {
  render() {
    return (
      <div>
        <img src ={logo} alt='' className='img' />
        <Router>
          <Switch>
            { this.props.loginStatus
                ? <AuthorizedLayout />
                : <UnauthorizedLayout userName={this.props.userName} />
            }
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
