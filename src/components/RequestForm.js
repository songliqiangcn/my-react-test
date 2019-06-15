import React, { Component } from 'react';


export default class RequestForm extends Component {
  render() {
    return (
        <form onSubmit={this.props.onSubmit}>
            <input
                type="checkbox"
                checked={this.props.queueActivate}
                onChange={this.props.onChange}
            />
            Toggle Queue 
            <button type="submit">
                {this.props.children}
            </button>
        </form>
    )
  }
}
