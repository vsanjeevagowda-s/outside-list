import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

const API_PATH = process.env[`REACT_APP_ROOT_PATH_${process.env.NODE_ENV}`]

const headers = () => {
  return {
  'Content-Type': 'application/json'
  }
}

class Item extends Component {
  state = {
    item: this.props.item
  }

  onCheck(item) {
    debugger
    const itemObj = { ...item, checked: !item.checked }
    const payload = {
      method: 'put',
      body: JSON.stringify(itemObj),
      headers: headers(),
      }
    fetch(`${API_PATH}/items/${item.id}`, payload)
    .then(resp => resp.json())
    .then(resp => {
      debugger
      this.setState({
        item: resp.item
      })
    })
    .catch(error => console.log('[ error ]: ', error));
    // item.checked = !item.checked;
    // this.setState({ item })
    
  }

  render() {
    const { item } = this.state;
    return (
      <div className='row'>
        <div className='col-md-10'>
          <li className="list-group-item">
            <span className={(item.checked === true) ? 'text-light' : ''}>{item.title}</span>
            <span className='float-right cursor-pointer border-left pl-2' onClick={() => this.onCheck(item)}>
              <i className="fa fa-check"></i>
            </span>
          </li>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsList: []
    }
  }

  componentDidMount(){
    fetch(`${API_PATH}/items`)
    .then(resp => resp.json())
    .then(resp => {
      debugger
      this.setState({
        itemsList: resp.items
      })
    })
    .catch(error => console.log('[ error ]: ', error));
  }

  updateLocalStorage(item){
    const { itemsList } = this.state;
    localStorage.setItem('items', JSON.stringify(itemsList));
  }

  render() {
    const {itemsList} = this.state;
    return (
      <div className="container-fluid">
        <div className='row'>
          <div className='col-md-4' />
          <div className='col-md-4 col-xs-12' >
            <ul className="list-group">
              {
                itemsList.map(item => {
                  return <Item key={item.id} item={item} />
                })
              }
            </ul>
          </div>
          <div className='col-md-4' />
        </div>
      </div>
    );
  }
}

export default App;
