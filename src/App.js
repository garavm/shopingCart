import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = {
    data: []
  };

  convertCsvtoObject = csv => {
    const lines = csv.split("\n");
    const [headerText] = lines.splice(0, 1);
    const headers = headerText.split(",");
    const result = lines.map(line => {
      const items = line.split(",");
      return items.reduce((accum, item, index) => {
        const key = headers[index];
        accum[key] = item;
        return accum;
      }, {});
    });
    return result;
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

  render() {
    console.log(this.state.data);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        {
          this.state.data ?
            this.state.data.map((item, i) => {
              return (
                <div key={i}>
                  <p>{item.product_name}</p>
                  <p>{item.price}</p>
                </div>
              )
            }) :
            <p />
        }
        
          </div>
          );
        }
      }
      
export default App;