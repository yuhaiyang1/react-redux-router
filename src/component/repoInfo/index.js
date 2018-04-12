import React, { Component } from 'react';
import {fetchData} from '../../fetch/fetch'
import {connect} from 'react-redux'
@connect((state) => {
  const {username} = state.userInfo
  return {
    username
  }
})
export default class App extends Component {
  async componentDidMount () {
    const shas = await this.getSingleReopInfo()
    console.log(shas,'1111')
    // shas.forEach(async(commitItem) => {
    //   await this.getCommitMessage(commitItem)
    // });
  }
  async getSingleReopInfo () {
    const {username} = this.props
    const {name} = this.props.match.params
    const res = await fetchData({
      url: `https://api.github.com/repos/${username}/${name}/commits`,
      type: 'get'
    })
    return res.map(i => ({message: i.commit.message, time: i.commit.committer.date}))
  }
  // async getCommitMessage (data) {
  //   const {username} = this.props
  //   const {name} = this.props.match.params
  //   const res = await fetchData({
  //     url: `https://api.github.com/repos/${username}/${name}/commits/${data}`,
  //     type: 'get'
  //   })
  //   console.log(res)
  // }
  render() {
    const {name} = this.props.match.params
    return (
      <div style={{background: '#f0f0f0'}}>
        {/* <h1 style={{textAlign: 'center'}}>{name}</h1> */}
        <div></div>
      </div>
    );
  }
}