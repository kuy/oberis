import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stage from '../components/stage';

class App extends Component {
  render() {
    const { stage, piece } = this.props;
    return <div>
      <Stage piece={piece} {...stage} />
    </div>;
  }
}

function select({ app, stage, piece }) {
  return { app, stage, piece };
}

export default connect(select)(App);
