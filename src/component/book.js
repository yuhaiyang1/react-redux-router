import React, { PureComponent} from 'react';
export default class App extends PureComponent {

  render() {
    
    return (
      <h1 style={{textAlign: 'center'}}>
        {this.props.match.params.id}
      </h1>
    );
  }
}
