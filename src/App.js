import './App.css';
import React from "react";









class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: null}
  }



  fibonnaciNum = function (num, fib = 1, lastFib = 0 ) {
    if (fib < num ) return this.fibonnaciNum(num, fib + lastFib, fib);
    if (fib === num)  return true;
    return false;
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

createArray = function (arr1, arr2) {
  if (!arr1.length < 10) return arr1;
  arr2.forEach(el => arr1.push(el)) 
}


deconstruct = function(grid) {
  let sequences = grid; 
  let columns = [];

  

  while (columns.length < 10) {
      let column;
      grid.forEach(el => column.push(el))
  }

}


checkGrid = function(grid) {
  
  this.setState({grid});
}

onClick = function(idxCol, idxRow, e) {
    let { grid } = this.state;

    grid[idxCol].forEach((el, idx, arr) =>  {
      if (idxRow !== idx)  arr[idx]++
    }
    
    );
    
    grid.forEach(el => el[idxRow]++)
    this.checkGrid(grid)    
}
componentDidMount() {
  this.makeGrid();
}


//https://reactjs.org/docs/handling-events.html
render() {

  const cellSize = 100;

  return (
    <div>
      <header className="container">
      <svg width={cellSize * 10} height={cellSize * 10}>
      {this.state.grid 
        && this.state.grid.map((row, idxCol) => 
          <g>
            {row.map((el, idxRow) => 
            <g>
            <rect className="rect" onClick={(e) => this.onClick(idxCol, idxRow, e)} width={cellSize} height={cellSize} x={cellSize * idxRow} y={cellSize * idxCol} fill="gray" /> 
            <text x={cellSize*idxRow} y={(cellSize * idxCol) + cellSize } font-family="Verdana" fontSize="20" fill="blue">
              {`${el}`} </text></g>)}
          </g>
        )}     
      </svg>
      </header>
    </div>
  );
}}

export default App;
