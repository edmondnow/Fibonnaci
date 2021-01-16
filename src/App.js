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

onClick = function(idxCol, idxRow, e) {
    let { grid } = this.state;
    console.log( "r",idxRow, "c", idxCol )
    console.log(idxCol)
    
    grid[idxCol].forEach((el, idx, arr) => 
      arr[idx]++
    );
    
    grid.forEach(el => el[idxRow]++)
    this.setState({grid})
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
              {`e${el}r${idxRow}c${idxCol}`} </text></g>)}
          </g>
        )}     
      </svg>
      </header>
    </div>
  );
}}

export default App;
