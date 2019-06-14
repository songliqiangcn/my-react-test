import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const MAX_QUEUE = 10;
const API_PATH = 'https://api.tradypik.com.au/api/v1/my_test';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      queueActivate: false,
      totalCounnter: 0,
      requestQueue: null,
      results: [],
      error: null,
      isLoading : false
    };

    this.onQueueChange = this.onQueueChange.bind(this);
    this.onRequestSubmit = this.onRequestSubmit.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.setResponse = this.setResponse.bind(this);

  }

  onQueueChange(event) {
      this.setState({ queueActivate: event.target.checked });
  }

  onRequestSubmit(event) {
      const { totalCounnter, requestQueue } = this.state;

      var counter = totalCounnter + 1;
      var sendRequestKey = Date.now().toString() + '_' + counter.toString();
      var oldQueue = requestQueue ? requestQueue : [];

      var updateQueue = [
          ...oldQueue,
          sendRequestKey
      ];
      this.setState({ totalCounnter: counter, requestQueue : updateQueue });

      event.preventDefault();
  }

  componentDidUpdate(){
      const { queueActivate, requestQueue } = this.state;

      var queueLength = requestQueue ? requestQueue.length : 0;

      if (queueActivate) {
          if (queueLength >= MAX_QUEUE) {
              for (var i = 0; i < queueLength; i++) {
                  this.sendRequest(requestQueue[i]);
              }
              this.setState({ requestQueue: null });
          }
      } else {
          if (queueLength > 0) {
              this.sendRequest(requestQueue[0]);
              this.setState({ requestQueue: null });
          }
      }
  }

  sendRequest(sendRequestKey) {

      const requestKey = sendRequestKey

      this.setState({ isLoading: true });
      axios.post(`${API_PATH}`, { requestKey })
      .then(result => this.setResponse(requestKey, result.data))
      .catch(error => this.setState({ error }));
  }

  setResponse(key, res){
      const newRes = {requestKey: key, response: res};

      const updateRes = [
          ...this.state.results,
          newRes
      ];

      console.log(JSON.stringify(updateRes, null, 2))

      this.setState({ results: updateRes , isLoading : false });
  }


  render() {
      const { results, error, requestQueue } = this.state;
     
      const list = (results) || [];
      var queueLength = requestQueue ? requestQueue.length : 0;

      return (
          <div className="page">
              <div className="interactions">
              <Request
                  queueActivate={this.state.queueActivate}
                  onChange={this.onQueueChange}
                  onSubmit={this.onRequestSubmit}
              >
                  Send Request
              </Request>
              </div>
              <Loading isLoading={this.state.isLoading} />
              <QueueNotice queueLength={queueLength} />
              { error
              ? <div className="interactions">
                  <p>Something went wrong.</p>
              </div>
              : <Table
                  list={list}
              />
              }
          </div>
      );
  }
}

const Table = ({
    list
}) => 
<div className="table">
  <div className="table-header">
  <span style={{ width: '50%' }}>Request Key</span>
  <span style={{ width: '50%' }}>API Response</span>
  </div>
  {list.map(item =>
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

const QueueNotice = ({queueLength}) =>
<div className="queue_notice">Total {queueLength} items in request queue now.</div>


const Loading = ({isLoading}) =>
isLoading ? 
<div>Loading ...</div>
: ''

const Request = ({
  queueActivate,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
      <input
          type="checkbox"
          checked={queueActivate}
          onChange={onChange}
      />
      Toggle Queue   
    <button type="submit">
      {children}
    </button>
  </form>


export default App;

export {
  Request,
  Table,
  Loading,
  QueueNotice
};