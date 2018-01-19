import React, { Component } from 'react';
import '../css/Notice.css';

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notices:[],
      index: 0
    };
  }

  componentDidMount() {
    fetch('../../notice.json').then(data => {
      data.text().then(listdata => {
        //console.log(listdata);
        if (listdata === '') {
          return
        } else {
          const list = JSON.parse(listdata);
          this.setState({...this,notices:list});
          this.timerID = setInterval(
            () => this.change(),
            10000
          );
        }
      })
    });
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  change() {
    if (this.state.index < this.state.notices.length - 1) {
      this.setState({ ...this, index: this.state.index + 1 });
    } else {
      this.setState({ ...this, index: 0 });
    }
  }
  render() {
    return (
      <div className="container notice">
        <div className="alert alert-warning"><span className="glyphicon glyphicon-bell"></span>{this.state.notices[this.state.index]}</div>
      </div>
    );
  }
}

export default Notice;