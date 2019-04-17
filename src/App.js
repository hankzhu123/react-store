import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Details from './components/Details';
import Default from './components/Default';
import Cart from './components/Cart/Cart';
import Modal from './components/Modal';

class App extends Component {
  render() {
    return (
      // 'react fragment' is parent container to replace 'div'
      <React.Fragment>
        <Navbar />
        <Switch>
          {/* home page should be list of products */}
          <Route path="/" exact component={ProductList} />

          <Route path="/details" component={Details} />

          <Route path="/cart" component={Cart} />

          <Route component={Default} />

        </Switch>

        <Modal />

  
        
      </React.Fragment>
    );
  }
}

export default App;
