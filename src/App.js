import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Table from './components/Table';
import RequestForm from './components/RequestForm';


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

    this.onQueueChange   = this.onQueueChange.bind(this);
    this.onRequestSubmit = this.onRequestSubmit.bind(this);
    this.sendRequest     = this.sendRequest.bind(this);
    this.setResponse     = this.setResponse.bind(this);

  }

  onQueueChange(event) {
      this.setState({ queueActivate: event.target.checked });
  }

  onRequestSubmit(event) {
      const { queueActivate, totalCounnter, requestQueue } = this.state;

      var counter        = totalCounnter + 1;
      var sendRequestKey = Date.now().toString() + '_' + counter.toString();
      var oldQueue       = requestQueue ? requestQueue : [];

      var updateQueue = [
          ...oldQueue,
          sendRequestKey
      ];
      this.setState({ totalCounnter: counter, requestQueue : updateQueue });

      // send request ?
      var queueLength = updateQueue.length;
      if (queueActivate) {
        if (queueLength >= MAX_QUEUE) {
            for (var i = 0; i < queueLength; i++) {
                this.sendRequest(updateQueue[i]);
            }              
        }
      } else {
          if (queueLength > 0) {
            for (var j = 0; j < queueLength; j++) {
              this.sendRequest(updateQueue[j]);
            }
          }
      }

      //console.log(JSON.stringify(updateQueue, null, 2))


      event.preventDefault();
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

      // remove the queue item
      const updatedQueue = this.state.requestQueue.filter(item => item !== key);

      this.setState({ results: updateRes , requestQueue: updatedQueue, isLoading : false });
  }


  render() {
      const { results, error, requestQueue } = this.state;
     
      const list = (results) || [];
      var queueLength = requestQueue ? requestQueue.length : 0;

      return (
          <div className="page">
              <div className="interactions">
              <RequestForm
                  queueActivate={this.state.queueActivate}
                  onChange={this.onQueueChange}
                  onSubmit={this.onRequestSubmit}
              >
                  Send Request
              </RequestForm>
              </div>
              <div className="queue_notice">Total <strong>{queueLength}</strong> items in request queue now.</div>
              {
                this.state.isLoading 
                ? <div>Loading ...</div>
                : ''

              }
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

export default App;

