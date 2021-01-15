import './App.css';
import React from "react";









class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: null}
  }





  makeGrid = function() {

    let grid = []
    while(grid.length < 10) {
      grid.push([]);
    }

    grid.forEach(el => 	{
      while (el.length < 10) {
        el.push([]);
      }
    })
    console.log(grid)
    this.setState({grid})
}

componentDidMount() {
  this.makeGrid();
}



render() {

  const size = 50;


  return (
    <div>
      <header className="container">
      <svg width={size * 10} height={size * 10}>
      {this.state.grid 
        && this.state.grid.map((row, idxRow) => 
          <g>
            {row.map((el, idxCol) => <rect width={size} height={size} x={size*idxRow} y={size*idxCol} fill="gray"></rect>)}
          </g>
        )}     
      </svg>
      </header>
    </div>
  );
}}

export default App;
