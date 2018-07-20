import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch  
} from 'react-router-dom'
import Home from '../component/home'
import Books from '../component/books'
import Book from '../component/book'
export default class RouterConfig extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route path='/home' component={Home} exact/>
          <Route path='/books' exact component={Books}/>
          <Route path='/books/:id' component={Book} />
        </Switch>
      </div>
    );
  }
}
