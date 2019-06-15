import React, { Component } from 'react';


export default class Table extends Component {
  render() {
    return (
        <div className="table">
            <div className="table-header">
                <span style={{ width: '50%' }}>Request Key</span>
                <span style={{ width: '50%' }}>API Response</span>
            </div>
            {this.props.list.map(item =>
              <div key={item.requestKey} className="table-row">
                <span style={{ width: '50%' }}>
                  {item.requestKey}
                </span>
                <span style={{ width: '50%' }}>
                  {item.response}
                </span>
                
              </div>
            )}  
      </div>
    )
  }
}
