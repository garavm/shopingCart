import React, { Component } from "react";

import "./App.css";

function CSVToArray(strData, strDelimiter) {
  strDelimiter = (strDelimiter || ",");
  var objPattern = new RegExp((
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
  var arrData = [[]];
  var arrMatches = null;
  while (arrMatches = objPattern.exec(strData)) {
    var strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)) {
      arrData.push([]);
    }
    if (arrMatches[2]) {
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"), "\"");
    } else {
      var strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  return (arrData);
}

const numRegex = /^\d+$/;

class App extends Component {
  state = {
    data: [],
    cart: {}
  };

  convertCsvtoObject = csv => {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < array[0].length && k < array[i].length; k++) {
        var key = array[0][k];
        objArray[i - 1][key] = array[i][k]
      }
    }
    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return JSON.parse(str);
  };

  componentDidMount() {
    fetch(
      "https://raw.githubusercontent.com/garavm/shopingcart/master/src/MOCK_DATA.csv"
    )
      .then(res => res.text())
      .then(csv => {
        this.setState({
          data: this.convertCsvtoObject(csv)
        });
      });
  }
  addToCart(item) {
    const { cart } = this.state;
    this.setState({ cart: { ...cart, [item.product_id]: { ...item, quantity: 1 } } })
  }
  removeFromCart(product_id) {
    let { cart } = this.state;
    delete cart[product_id]
    this.setState({ cart })
  }

  changeQuantity(product_id, e) {
    const value = e.target.value
    const { cart } = this.state;
    const item = cart[product_id]
    if (value.length > 0) {
      const isNum = numRegex.test(value)
      console.log(isNum)
      if (isNum) {
        this.setState({ cart: { ...cart, [item.product_id]: { ...item, quantity: parseInt(value) } } })
      }
    } else {
      this.setState({ cart: { ...cart, [item.product_id]: { ...item, quantity: value } } })
    }
  }

  render() {
    const { cart, data } = this.state
    return (
      <div class="wrapper">
        <div class="wrapper">
          <h1>Cart</h1>
          <table >
            <tbody>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove Item</th>
              </tr>
              {Object.keys(cart).map(key => {
                const item = cart[key]
                return (
                  <tr key={key}>
                    <td>{item.product_name}</td>
                    <td>
                      <input
                        value={item.quantity}
                        onChange={(e) => this.changeQuantity(item.product_id, e)}
                      />
                    </td>
                    <td>{item.quantity ? parseFloat(item.quantity * item.price).toFixed(2) : 0}</td>
                    <td>
                      <button
                        onClick={() => this.removeFromCart(item.product_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p>Total Quantity: {Object.keys(cart).reduce((acc, key) => {
          const item = cart[key]
          let quantityOfEachItem = item.quantity
          acc += quantityOfEachItem;
          return acc;
        }, 0)}</p>
        <p>Total Amount: {Object.keys(cart).reduce((acc, key) => {
          const item = cart[key]
          let priceOfEachItem = item.quantity * item.price
          acc += priceOfEachItem;
          return acc;
        }, 0)}</p>
        <table>
          <tbody>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Add Item</th>
            </tr>
            {
              data.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.product_name}</td>
                    <td>{item.price}</td>
                    <td>
                      <button
                        onClick={() => this.addToCart(item)}
                        disabled={cart[item.product_id] ? true : false}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;