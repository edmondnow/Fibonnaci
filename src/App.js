import './App.css';
import React from "react";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: null, clicked: {}}
  }



  isFibonacci = function (num, fib = 1, lastFib = 0 ) {
    if (fib < num ) return this.isFibonacci(num, fib + lastFib, fib);
    if (fib === num)  return true;
    return false;
  }

  checkGrid = function() {

    let { grid } = this.state;
    let newGrid = this.makeGrid();
    grid.forEach((arr, idxCol) => {
        arr.forEach((el, idxRow, arr) => {
          newGrid[idxCol][idxRow] = this.isFibonacci(el) ? { idxCol, idxRow, num: el } : null;
        })
    })

    this.deconstruct(newGrid);
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

    return grid;
}




deconstruct = function(grid) {
  let columns = [];
  // add diagonal neighbours
  while (columns.length < 10) {
      let column = [];
      grid.forEach(el => column.push(el[columns.length]))
      columns.push(column);
  }

  let neighbours = [...grid, ...columns]
  this.checkSequence(neighbours)
}


checkSequence = function(cont) {
  let sequences = [];



  cont.forEach(arr => {
    let seq = [];

    arr.forEach((el, idx) => {
      // this could be done better using a sliding window pattern
      // you could put this before the fibonanci checkj, then you could remove the objects
      // you could maybe use a for loops too check if they are the sequence, this would remove more syntax
      let prev = arr[idx - 1];
      let prev2 = arr[idx - 2];
      let next = arr[idx + 1];
      let next2 = arr[idx + 2]
      let prevExist = el && prev && prev2;
      let nextExist = el && next && next2;
      let sumOfPrev = prevExist && (el.num === prev.num + prev2.num);
      let partOfNext = nextExist && (next2.num === el.num + next.num);
      let prevOrNext = (el && prev && next) && (next.num === el.num + prev.num)
   
       partOfNext || sumOfPrev || prevOrNext ? seq.push(el) : seq.push(null)
    })

    sequences.push(seq)
  });
  console.log(sequences);
  console.log("minseq", this.minSeq(sequences));
}


minSeq = function(sequences) {
  let qualified = []
  sequences.forEach(seq => {
    let inner = [];
      seq.forEach((el, idx) => {
        
        if (!el || idx === seq.length ) {
        
          if (inner.length >= 5) {
            qualified.push(inner); 
            inner = []; 
            return;
          }

          return inner = []
        } 
        inner.push(el)
      })
  })

  qualified.flat();
  //let dedup = [...new Set(qualifed.map(({idxRow, idxRow, v}) => `${idxRow,idxCol}`))]]
  //todo check if this actually works
  return qualified.filter((current, idx, arr) =>
  idx === arr.findIndex((found) => (
    current.idxRow === found.idxRow && current.idxCol === found.idxCol
  ))
)
} 

onClick =   function(idxCol, idxRow, e) {
  
    let { grid } = this.state;
    let clicked = {idxCol, idxRow}
    grid[idxCol].forEach((el, idx, arr) =>  {
      if (idxRow !== idx)  arr[idx]++
    });
    
    grid.forEach(el => el[idxRow]++);
    this.setState({grid, clicked})
    this.checkGrid();
}

componentDidMount() {
    this.setState({grid: this.makeGrid()})
}


componentDidUpdate()  {
  const {clicked} = this.state;
  setTimeout(() => 
   { if (clicked.hasOwnProperty("idxRow"))  this.setState({clicked: {}}) }, 2000);
}

getClassNames = function (idxCol, idxRow) {
  const { clicked } = this.state
  const sameRowOrCol = (clicked.idxCol === idxCol || clicked.idxRow === idxRow)
  console.log('>>', sameRowOrCol)
  return sameRowOrCol ? "yellow" : ""
}

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
              <g key={idxRow.toString() +  idxCol.toString()}>
                <rect className={(this.getClassNames(idxCol, idxRow))} onClick={(e) => this.onClick(idxCol, idxRow, e)} width={cellSize} height={cellSize} x={cellSize * idxRow} y={cellSize * idxCol} fill="gray" /> 
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
