import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom'
export default class App extends Component {

  render() {
    const data = [
      {title: '读者', id: 1},
      {title: '青年文摘', id: 2},
      {title: '意林', id: 3}
    ]
    return (
      <ul>
        {data.map(item => <li key={item.id} >
          <Link to={`/books/${item.title}`}>{item.title}</Link>
        </li>)
        }
      </ul>
    )
  }
}