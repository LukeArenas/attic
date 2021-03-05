import React, { Component } from 'react'
import CartItem from '../components/CartItem'

export default class Cart extends Component {
  directToBuyPage = () => {
    this.props.history.push('/buy')
  }
  render() {
    console.log(this.props.addedToCart)
    return (
      <div className="cart">
        <h3>Your Cart:</h3>
        <div className="product-container">
          {this.props.addedToCart.length ? (
            this.props.addedToCart.map((item) => (
              <CartItem
                price={item.price}
                title={item.title}
                id={item._id}
                removeFromCart={this.props.removeFromCart}
              />
            ))
          ) : (
            <div>Your cart is empty</div>
          )}
          {this.props.addedToCart.length ? (
            <div className="total-container">
              <div className="total">Total</div>
              <div className="total-amount">
                $
                {this.props.addedToCart.reduce((acc, value) => {
                  return acc + value.price
                }, 0)}
              </div>
            </div>
          ) : null}
        </div>
        {this.props.addedToCart.length ? (
          <button className="checkout">Checkout</button>
        ) : (
          <button className="checkout" onClick={this.directToBuyPage}>
            Shop now
          </button>
        )}
      </div>
    )
  }
}
