import React, { Component } from 'react';
import {fetchData} from '../../fetch/fetch'
import {withRouter, Link, Route} from 'react-router-dom'
import _ from 'lodash'
import {connect} from 'react-redux'
import moment from 'moment'
import {Card, Tooltip, Spin} from 'antd'
import {Button, Glyphicon} from 'react-bootstrap'
import './index.less'
@connect((state) => {
  const {username} = state.userInfo
  return {
    username
  }
})
export default class App extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
    this.avatar_url = null
    this.repoList = []
  }
  componentWillMount () {
    this.getListData(this.props)
  }
  async getListData (props) {
    const {username} = props
    const res = await fetchData({
      url: `https://api.github.com/users/${username}/repos?type=owner`,
      type: 'get',
      data: ''
    })
    if(res.length){
      this.repoList = this.dealData(res)
      this.setState({loading: false})
    }else{
    }
  }
  dealData (data) {
    const newData = data.map(i => ({
        name: i.name,
        des: i.description,
        createTime: i.created_at,
        stars: i.stargazers_count,
        url: i.html_url
      })
  )
  newData.sort((a, b) => b.stars - a.stars)
  return _.chunk(newData, 3)
  }
  renderTitle (url, name, stars) {
    console.log(stars)
    return <div className='flex' style={{justifyContent: 'space-around'}}>
      <div>
      <Tooltip placement="top" title={name}>
        <Link to={`${url}/repo/${name}`}>{name.substring(0, 10) + '...'}</Link>
      </Tooltip>
      </div>
      <Button bsSize="xsmall">
        <Glyphicon glyph="star" /> {stars}
      </Button>
    </div>
  }
  renderItem () {
    const {match} = this.props
    return this.repoList.map((repoItem, index) => <div key={index} className='single'>
      {repoItem.map(item => <Card
          style={{ width: 300,height: 250, marginRight: 10}}
          title={this.renderTitle(match.url, item.name, item.stars)}
          >
            <div className='flex'>
              <span className='label'>创建时间：</span>
              {moment(item.createTime).format('YYYY-MM-DD')}
            </div>
            <div className='flex'>
              <span className='label'>描述：</span>
              {item.des}
            </div>
            <a href={item.url}>仓库地址</a>
        </Card>
      )}
      </div>
    )
  }
  render() {
    return (
      <Spin spinning={this.state.loading}>
        <div className='repos'>
        {this.renderItem()}
        </div>
      </Spin>
    );
  }
}