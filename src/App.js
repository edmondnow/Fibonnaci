import "./App.css";
import React from "react";
import { clone, cloneDeep} from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { grid: null, clicked: {}, length: 50, cellSize: 25, minimumSeqLength: 5 };
  }

  isFibonacci = function (num, fib = 1, lastFib = 0) {
    if (fib < num) return this.isFibonacci(num, fib + lastFib, fib);
    if (fib === num) return true;
    return false;
  };

  checkGrid = function () {
    const { grid } = this.state;
    let newGrid = this.makeGrid();
    grid.forEach((arr, idxCol) => {
      arr.forEach((el, idxRow, arr) => {
        newGrid[idxCol][idxRow] = this.isFibonacci(el)
          ? { idxCol, idxRow, num: el }
          : null;
      });
    });

    this.deconstruct(newGrid);
  };

  makeGrid = function () {
    const { length } = this.state;
    let grid = [];

    while (grid.length < length) {
      grid.push([]);
    }

    grid.forEach((el) => {
      while (el.length < length) {
        el.push([null]);
      }
    });

    return grid;
  };

  getDiagonals = function (arr) {
    const { length } = this.state;
    let diagonals = [];

    // TODO this is O(n^2), should be improved
    // Run the function separately: https://repl.it/@EdmondBitay/Algorithms-and-Data-Structures-1#diagonal.js

    for (var j = 0; j < length; j++) {
      let forward = [];
      let reverse = [];
      let forwardRemainder = [];
      let backwardRemainder = [];

      for (var i = 0; i < length; i++) {
        let x = i + j;

        if (x < length) {
          // forward diagonals starting with index of last element in the first array
          forward.push(arr[i][x]);

          // reverse diagonals starting with index of last element of first array
          reverse.push(arr[i][length - x - 1]);
        }

        if (x + 1 < length) {
          // compute forward remainder diagonals starting with first index of second array
          forwardRemainder.push(arr[x + 1][i]);

          // compute reverse remainder of diagonals starting with of last index of second array
          backwardRemainder.push(arr[length - (x + 1)][length - 1 - i]);
        }
      }

  
      diagonals.push(
        ...[forward, reverse, forwardRemainder, backwardRemainder]
      );
    }

    return diagonals.filter((arr) => arr.length > 0);
  };


  getColumns = function(grid) {
    let columns = [];
    const { length } = this.state;

    while(columns.length < length) {
      let column = [];
      grid.forEach((el) => column.push(el[columns.length]));
      columns.push(column);
    }

    return columns;
  }

  deconstruct = function (grid) {
    let neighbours = [...grid, ...this.getColumns(grid), ...this.getDiagonals(grid)];
    let reverseNeighbours = neighbours.slice().reverse();
    this.checkSequence([...neighbours, ...reverseNeighbours]);
  };

  checkSequence = function (cont) {
    let sequences = [];

    cont.forEach((arr) => {
      let seq = [];

      arr.forEach((el, idx) => {
       
        // this could be placed before this.isFibonacci is used, avoiding the use of objects in this function, checking for null values is terrible business
        // a for loop could be used to have less syntax, but I find this readable
        let prev = arr[idx - 1];
        let prev2 = arr[idx - 2];
        let next = arr[idx + 1];
        let next2 = arr[idx + 2];
        let prevExist = el && prev && prev2;
        let nextExist = el && next && next2;
        let sumOfPrev = prevExist && el.num === prev.num + prev2.num;
        let partOfNext = nextExist && next2.num === el.num + next.num;
        let prevOrNext = el && prev && next && next.num === el.num + prev.num;

        partOfNext || sumOfPrev || prevOrNext ? seq.push(el) : seq.push(null);
      });

      sequences.push(seq);
    });

    this.checkMinSeqLength(sequences);
  };

  checkMinSeqLength = function (sequences) {
    let qualified = [];
    const { grid, minimumSeqLength } = this.state;

    //To avoid mutating state, I have to deep clone the grid, otherwise nested arrays will be referenced, and changing them will cause tons of re-renders
    //Deepcloning is expensive, but it is probably better than tons of re-renders

    let clonedGrid = cloneDeep(clone(grid))


    // This still yields some arrays that use a lax definition of "next to each other" e.g. [1, 1, 2, 3, 5, 1, 1, 2, 3]. See discussion in Notion.
    sequences.forEach((seq) => {
      let minSeq = [];
      seq.forEach((el, idx) => {
        if (!el || idx === seq.length) {
          if (minSeq.length >= minimumSeqLength) {
            qualified.push(minSeq);
            minSeq = [];
            return;
          }

          return (minSeq = []);
        }
        minSeq.push(el);
      });
    });

    let deduplicatedQualified = qualified
      .flat()
      .filter(
        (current, idx, arr) =>
          idx ===
          arr.findIndex(
            (found) =>
              current.idxRow === found.idxRow && current.idxCol === found.idxCol
          )
      );


    deduplicatedQualified.forEach((el) => {
      if (el) clonedGrid[el.idxCol][el.idxRow] = 0;
    });

    
    this.setState({ grid: clonedGrid });
  };

  onClick = function (idxCol, idxRow, e) {
    const { grid } = this.state;
    let clicked = { idxCol, idxRow };
    grid[idxCol].forEach((el, idx, arr) => {
      if (idxRow !== idx) arr[idx]++;
    });

    grid.forEach((el) => el[idxRow]++);
    this.setState({ grid, clicked });
    this.checkGrid();
  };

  componentDidMount() {
    this.setState({ grid: this.makeGrid() });
  }

  componentDidUpdate() {
    const { clicked } = this.state;
    setTimeout(() => {
      if (clicked.hasOwnProperty("idxRow")) this.setState({ clicked: {} });
    }, 2000);
  }

  getClassNames = function (idxCol, idxRow, el) {
    const { clicked } = this.state;
    if (el === 0) return "green rect";
    const sameRowOrCol = clicked.idxCol === idxCol || clicked.idxRow === idxRow;
    return sameRowOrCol ? "yellow rect" : "rect";
  };

  render() {
    const { length, cellSize } = this.state;
  
    return (
      <div>
        <header className="container">
          <svg width={cellSize * length} height={cellSize * length}>
            {this.state.grid &&
              this.state.grid.map((row, idxCol) => (
                <g>
                  {row.map((el, idxRow) => (
                    <g key={idxRow.toString() + idxCol.toString()}>
                      <rect
                        className={this.getClassNames(idxCol, idxRow, el)}
                        onClick={(e) => this.onClick(idxCol, idxRow, e)}
                        width={cellSize}
                        height={cellSize}
                        x={cellSize * idxRow}
                        y={cellSize * idxCol}
                        fill="gray"
                      />
                      <text
                        className="text"
                        x={cellSize * idxRow + cellSize / 3}
                        y={cellSize * idxCol - cellSize / 3 + cellSize}
                        fontFamily="PT Serif"
                        fontSize="12"
                        fill="blue"
                      >
                        {`${el > 0 ? el : ""}`}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
          </svg>
        </header>
      </div>
    );
  }
}

export default App;
