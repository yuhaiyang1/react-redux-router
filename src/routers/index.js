import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch  
} from 'react-router-dom'
import TreeTable from '../component/TreeTable/index'
import Home from '../component/home/home'
import About from '../component/about'
import Repo from '../component/repoInfo/index'
export default class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route path='/home' component={TreeTable} exact/>
          <Route path='/home/repo/:name' exact component={Repo}/>
          <Route path='/about' component={About} exact/>
        </Switch>
      </div>
    );
  }
}
