import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
// eslint-disable-next-line no-unused-vars
import Interceptor from './interceptor';

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

  componentWillReceiveProps(nextProps, nextState){
    debugger
    const { item } = this.props;
    const { item:newItem } = nextProps
    if(item.checked !== newItem.checked){
      this.setState({
        item: newItem
      })
    }
  }

  onCheck(item) {
    const itemObj = { ...item, checked: !item.checked }
    item.checked = !item.checked;
    this.setState({
      item
    })
    const payload = {
      method: 'put',
      body: JSON.stringify(itemObj),
      headers: headers(),
    }
    fetch(`${API_PATH}/items/${item.id}`, payload)
      .then(resp => resp.json())
      .catch(error => console.log('[ error ]: ', alert(error)));
  }

  render() {
    const { item } = this.state;
    return (
      <div className='row'>
        <div className='col-md-12'>
          <li className="list-group-item">
            <span className={(item.checked === true) ? 'item-checked' : ''}>{item.title}</span>
            {item.checked && <span className='float-right cursor-pointer border-left pl-2' onClick={() => this.onCheck(item)}>
              <i className="fa fa-times text-danger"></i>
            </span>}
            {!item.checked && <span className='float-right cursor-pointer border-left pl-2' onClick={() => this.onCheck(item)}>
              <i className="fa fa-check text-success"></i>
            </span>}
          </li>
        </div>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.checkUncheckAll = this.checkUncheckAll.bind(this);
    this.state = {
      itemsList: [],
      isDropDownOpen: false
    }
  }

  componentDidMount() {
    fetch(`${API_PATH}/items`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          itemsList: resp.items
        })
      })
      .catch(error =>{ console.log('[ error ]: ', alert(error))});
  }

  checkUncheckAll(checked){
    const itemIds = [];
    const { itemsList } = this.state;
    const newItemList = itemsList.map(item => {
      itemIds.push(item.id);
      return { ...item, checked };
    });
    this.setState({
      itemsList: newItemList,
      isDropDownOpen: false
    });
    const payload = {
      method: 'put',
      body: JSON.stringify({checked, itemIds}),
      headers: headers(),
    }
    fetch(`${API_PATH}/items`, payload)
    .then(resp => resp.json())
    .catch(error => console.log('[ error ]: ', alert(error)));
  }

  render() {
    const { itemsList, isDropDownOpen } = this.state;
    return (
      <div className="container-fluid">
        <div className='row'>
          <div className='col-md-4' />
          <div className='col-md-4 col-xs-12 border p-2' >
            {/* <div className='px-4 py-2 border text-light bg-dark header'>samoke</div> */}
            <ul className="list-group">
              <li className="list-group-item header bg-light pos-rel">
                <span >Outside List</span>
                {!isDropDownOpen && <span className='float-right cursor-pointer border-left pl-2' onClick={() => this.setState({ isDropDownOpen: !isDropDownOpen })}>
                  <i className="fa fa-sort-down"></i>
                </span>}
                {isDropDownOpen && <span className='float-right cursor-pointer border-left pl-2' onClick={() => this.setState({ isDropDownOpen: !isDropDownOpen })}>
                  <i className="fa fa-sort-up"></i>
                </span>}
                {isDropDownOpen && <ul className="list-group pos-abs check-uncheck-box">
                  <li className="list-group-item cursor-pointer" onClick={() => this.checkUncheckAll(true)}><small>Check all</small></li>
                  <li className="list-group-item cursor-pointer" onClick={() => this.checkUncheckAll(false)}><small>Uncheck all</small></li>
                </ul>}
              </li>
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
