import React, { Component } from 'react'
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();
//Provider
//Consumer

class ProductProvider extends Component {
    state = {
        products: [], 
        detailProduct: detailProduct,
        cart: [],
        modalOpen: false,
        modalProduct: detailProduct,
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0
    };
    
    componentDidMount() {
        this.setProducts();
    }

    // Creating the copy of actual data file, so I don't change anything inside,
    //  whenever I want to use the 'product' data, there would be always new
    // Different from the 'detailProduct', since I don't change of the data, 
    //  therefore, there is no necessary to create the copy.
    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = {...item};
            tempProducts = [...tempProducts, singleItem];

        })
        this.setState(()=> {
            return { products: tempProducts }
        })
    }

    getItem = (id) => {
      const product = this.state.products.find(item => item.id===id);
      return product;
    }

    handleDetail = (id) => {
        const product = this.getItem(id);
        this.setState(()=>{
          return {detailProduct: product}
        })
    }

    addToCart = (id) => {
        // Make copy of products list data
        let tempProducts = [...this.state.products];

        // Find the index of selected product
        const index = tempProducts.indexOf(this.getItem(id));
        
        // Make container for the selected product
        const product = tempProducts[index];

        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;
        
        this.setState(
          ()=>{
            return { products: tempProducts, cart: [...this.state.cart, product] };
          }, 
          ()=>{
            this.addTotals();
          }
        );

    };

    openModal = id => {
      const product = this.getItem(id);
      this.setState(()=>{
        return {modalOpen: true, modalProduct: product}
      })
    }

    closeModal = () => {
      this.setState(()=>{
        return {modalOpen: false}
      })
    }

    decrement = id => {
      // Make copy of products list data inside the cart
      let tempCart = [...this.state.cart];
      const selectedProduct = tempCart.find(item=> item.id === id);
      
      // Find the index of selected product
      const index = tempCart.indexOf(selectedProduct);
      
      // Make container for the selected product to remove
      const product = tempCart[index];

      product.count--;

      if (product.count === 0) {
        this.removeItem(product.id);
      } else {
        const price = product.price;
        product.total = price * product.count;

        this.setState(
          ()=>{
            return { cart: [...tempCart] };
          }, 
          ()=>{
            this.addTotals();
          }
        );
      }
      
      
    }

    increment = id => {
       // Make copy of products list data
       let tempCart = [...this.state.cart];
       const selectedProduct = tempCart.find(item=>item.id===id);
      
       // Find the index of selected product
       const index = tempCart.indexOf(selectedProduct);
       
       // Make container for the selected product to remove
       const product = tempCart[index];
 
       product.count++;
       const price = product.price;
       product.total = price * product.count;
       
       this.setState(
         ()=>{
           return { cart: [...tempCart] };
         }, 
         ()=>{
           this.addTotals();
         }
       );
    }

    removeItem = id => {
      // Make copy of products list data
      let tempProducts = [...this.state.products];
      let tempCart = [...this.state.cart];

      //whatever the id that matches the id we are currently clicking is removed from the cart
      tempCart = tempCart.filter(item => item.id !== id);

      // Find the index of selected product
      const index = tempProducts.indexOf(this.getItem(id));
      
      // Make container for the selected product to remove
      const removedProduct = tempProducts[index];

      removedProduct.inCart = false;
      removedProduct.count = 0;
      removedProduct.total = 0;
      
      this.setState(
        ()=>{
          return { products: [...tempProducts], cart: [...tempCart] };
        }, 
        ()=>{
          this.addTotals();
        }
      );
    }

    clearCart = () => {
      this.setState(()=>{
        return {cart:[]}
      }, ()=>{
        this.setProducts();
        this.addTotals();
      })
    }

    addTotals = () => {
      let subtotal = 0;
      this.state.cart.map(item=>(subtotal += item.total));
      
      const tax = subtotal * 0.1;
      const total = subtotal + tax;
      this.setState(()=>{
        return {
          cartSubTotal: subtotal.toFixed(2),
          cartTax: tax.toFixed(2),
          cartTotal: total.toFixed(2)
        }
      })

    }


  render() {
    return (
      <ProductContext.Provider value={{
        ...this.state, 
        handleDetail: this.handleDetail,
        addToCart: this.addToCart,
        openModal: this.openModal,
        closeModal: this.closeModal,
        increment: this.increment,
        decrement: this.decrement,
        removeItem: this.removeItem,
        clearCart: this.clearCart

      }}>
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };