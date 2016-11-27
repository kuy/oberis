import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stage from '../components/stage';
import { restart } from '../actions';

class App extends Component {
  handleClick() {
    this.props.dispatch(restart());
  }

  render() {
    const { app, stage, piece } = this.props;

    let message;
    if (app.gameOver) {
      message = <h3>
        Game Over
        <button onClick={this.handleClick.bind(this)}>Restart</button>
      </h3>;
    }

    return <div>
      <Stage piece={piece} {...stage} />
      {message}
    </div>;
  }
}

function select({ app, stage, piece }) {
  return { app, stage, piece };
}

export default connect(select)(App);
