import './App.css'
import React, { Component } from 'react'
import Welcome from './pages/Welcome'
import Buy from './pages/Buy'
import Sell from './pages/Sell'
import ItemDetails from './pages/ItemDetails'
import Cart from './pages/Cart'
import { Switch, Route, NavLink } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from './globals'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      username: 'test',
      recentlyViewed: [],
      selectedListing: '',
      addedToCart: [],
      allSellers: [],
      currentSeller: {}
    }
  }

  componentDidMount() {
    this.getSellers()
  }

  //METHODS

  handleUsername = (event) => {
    this.setState({ username: event.target.value })
  }

  getSellers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sellers`)
      this.setState({ allSellers: response.data.sellers })
      console.log(response.data.sellers)
    } catch (error) {
      console.log(error)
    }
  }

  createSeller = async () => {
    const existingUser = this.state.allSellers.filter((seller) => {
      return seller.seller === this.state.username
    })
    existingUser.length
      ? console.log('seller exists')
      : await axios.post(`${BASE_URL}/sellers`, {
          seller: this.state.username,
          customerRating: Math.ceil(Math.random() * 50) / 10
        })
    this.getSellerByName()
  }

  getSellerByName = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sellers/${this.state.username}`
      )
      this.setState({ currentSeller: response.data.seller[0] })
    } catch (error) {
      console.log(error)
    }
  }

  viewListing = (event) => {
    console.log(event)
  }

  handleSelection = (id) => {
    this.setState({ selectedListing: id })
  }

  addToCart = async () => {
    const itemToAdd = await axios.get(
      `${BASE_URL}/listings/${this.state.selectedListing}`
    )
    const currentCart = this.state.addedToCart
    const newCart = [...currentCart, itemToAdd.data.listing]
    this.setState({ addedToCart: newCart })
    console.log(itemToAdd.data.listing)
  }

  removeFromCart = (id) => {
    const newCart = this.state.addedToCart.filter((item) => {
      return item._id !== id
    })
    this.setState({ addedToCart: newCart })
    console.log(this.state.addedToCart)
  }

  updateRecentlyViewed = async () => {
    const itemToAdd = await axios.get(
      `${BASE_URL}/listings/${this.state.selectedListing}`
    )
    const currentViewed = this.state.recentlyViewed
    const newViewed = [...currentViewed, itemToAdd.data.listing]
    this.setState({ recentlyViewed: newViewed })
    console.log(newViewed)
  }

  render() {
    return (
      <div className="app">
        <nav>
          <h1>freetrade</h1>
          <NavLink to="/buy">Buy</NavLink>
          <NavLink to="/sell">Sell</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </nav>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Welcome
                handleUsername={this.handleUsername}
                createSeller={this.createSeller}
              />
            )}
          />
          <Route
            path="/buy"
            render={(reactProps) => (
              <Buy
                recentlyViewed={this.state.recentlyViewed}
                viewListing={this.viewListing}
                handleSelection={this.handleSelection}
                updateRecentlyViewed={this.updateRecentlyViewed}
                {...reactProps}
              />
            )}
          />
          <Route
            path="/sell"
            render={(reactProps) => (
              <Sell
                username={this.state.username}
                {...reactProps}
                recentlyViewed={this.state.recentlyViewed}
                viewListing={this.viewListing}
                handleSelection={this.handleSelection}
                updateRecentlyViewed={this.updateRecentlyViewed}
              />
            )}
          />
          <Route
            path="/item-details/:id"
            render={(reactProps) => (
              <ItemDetails
                selectedListing={this.state.selectedListing}
                addToCart={this.addToCart}
                {...reactProps}
              />
            )}
          />
          <Route
            path="/cart"
            render={() => (
              <Cart
                addedToCart={this.state.addedToCart}
                removeFromCart={this.removeFromCart}
              />
            )}
          />
        </Switch>
        <footer>Contact Us:</footer>
      </div>
    )
  }
}
