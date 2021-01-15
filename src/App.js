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
        el.push([0]);
      }
    })
    console.log(grid)
    this.setState({grid})
}

onClick = function(idxRow, idxCol, e) {
    let { grid } = this.state;

    grid[idxCol][idxRow]++; 

    this.setState({grid})
}

componentDidMount() {
  this.makeGrid();
}


//https://reactjs.org/docs/handling-events.html
render() {

  const size = 50;

  return (
    <div>
      <header className="container">
      <svg width={size * 10} height={size * 10}>
      {this.state.grid 
        && this.state.grid.map((row, idxRow) => 
          <g>
            {row.map((el, idxCol) => 
            <g>
            <rect className="rect" onClick={(e) => this.onClick(idxRow, idxCol, e)} width={size} height={size} x={size*idxRow} y={size*idxCol} fill="gray" /> 
            <text x={size*idxRow} y={size*idxCol} font-family="Verdana" font-size="30" fill="blue">
              {el}</text></g>)}
          </g>
        )}     
      </svg>
      </header>
    </div>
  );
}}

export default App;
