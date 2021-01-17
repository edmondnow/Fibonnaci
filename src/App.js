import './App.css';
import React from "react";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {grid: null, clicked: {}, length: 20, cellSize: 50}
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
    const { length } = this.state;
    let grid = []
    while(grid.length < length) {
      grid.push([]);
    }

    grid.forEach(el => 	{
      while (el.length < length) {
        el.push([null]);
      }
    })

    return grid;
}


 diagonal = function (arr) {
  const { length } = this.state;
  let diagonals = [];
 
  // TODO this is O(n^2), should be improved
   for (var j = 0; j < length; j++) {
     let forward = [];
     let reverse = [];
     let forwardRemainder = [];
     let backwardRemainder = [];
     for (var i = 0; i < length; i++) {
       let x = i + j;
 
     if (x  < length) {
     // forward diagonals starting with index of last element in the first array
      forward.push(arr[i][x]);
      // reverse diagonals starting with index of last element of first array
      reverse.push(arr[i][length - x - 1])
     }
    
     
     if ((x + 1) < length )  {
       // compute forward remainder diagonals starting with first index of second array
       forwardRemainder.push(arr[x + 1][i]);
       // compute reverse remainder of diagonals starting with of last index of second array
       backwardRemainder.push(arr[length - (x + 1)][(length - 1) - i])
     }

     }
     
   //remove empty arrays
   diagonals.push(...[forward, reverse, forwardRemainder, backwardRemainder]);

  }

   return diagonals.filter( arr => arr.length > 0)
 }
 


deconstruct = function(grid) {
  const { length } = this.state;
  let columns = [];
  // add diagonal neighbours
  while (columns.length < length) {
      let column = [];
      grid.forEach(el => column.push(el[columns.length]))
      columns.push(column);
  }
  let neighbours = [...grid, ...columns, ...this.diagonal(grid)];
  let reverseNeighbours = neighbours.slice().reverse();
  this.checkSequence([...neighbours, ...reverseNeighbours])
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
  
  this.minSeq(sequences)
}


minSeq = function(sequences) {
 
  let qualified = []
  let { grid } = this.state;

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

  //map(el => { return {...el, fib: true, num: 0}});
  // stupid way of deduplicating
  //let dedup = [...new Set(qualifed.map(({idxRow, idxRow, v}) => `${idxRow,idxCol}`))]]
  //todo check if this actually works
  
  let deduplicatedQualified =  qualified.flat().filter((current, idx, arr) =>
    idx === arr.findIndex((found) => (
      current.idxRow === found.idxRow && current.idxCol === found.idxCol
  )))
    // does state mutate here?
  deduplicatedQualified.forEach((el) => {
  
    if (el) grid[el.idxCol][el.idxRow] = 0
  })

  console.log('here')
  this.setState({grid})  
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

getClassNames = function (idxCol, idxRow, el) {
  const { clicked } = this.state
  if (el === 0) return "green rect";
  const sameRowOrCol = (clicked.idxCol === idxCol || clicked.idxRow === idxRow);
  return sameRowOrCol ? "yellow rect" : "rect"
}

render() {
  const { length, cellSize } = this.state;
 
  return (
    <div>
      <header className="container">
      <svg width={cellSize * length} height={cellSize * length}>
      {this.state.grid 
        && this.state.grid.map((row, idxCol) =>  
            <g>
              {row.map((el, idxRow) => 
              <g key={idxRow.toString() +  idxCol.toString()}>
                <rect className={(this.getClassNames(idxCol, idxRow, el))} onClick={(e) => this.onClick(idxCol, idxRow, e)} width={cellSize} height={cellSize} x={cellSize * idxRow} y={cellSize * idxCol} fill="gray" /> 
                <text  className="text" x={cellSize*idxRow + (cellSize / 3)} y={(cellSize * idxCol - (cellSize / 3)) + cellSize } font-family="Verdana" fontSize="20" fill="blue">
                {`${el > 0 ? el : "" }`} </text></g>)}
               </g>
        )}     
      </svg>
      </header>
    </div>
  );
}}

export default App;
