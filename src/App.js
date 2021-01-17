import "./App.css";
import React from "react";
import _ from "lodash";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      clicked: {},
      length: 50,
      cellSize: 25,
      minSeqLength: 5,
    };
  }

  componentDidMount() {
    this.setState({ grid: this.makeGrid() });
  }

  componentDidUpdate() {
    const { clicked } = this.state;
    setTimeout(() => {
      if (clicked.hasOwnProperty("idxRow")) this.setState({ clicked: {} });
    }, 2000);
  }

  makeGrid = function () {
    const { length } = this.state;
    let grid = [];

    while (grid.length < length) {
      grid.push([]);
    }

    grid.forEach((el) => {
      while (el.length < length) {
        el.push(null);
      }
    });

    return grid;
  };

  //To avoid mutating state, I have to deep clone the grid, otherwise nested arrays will be referenced, and changing them will cause tons of re-renders
  //Deepcloning is expensive, but it is better than tons of re-renders
  cloneGrid = (grid) => _.cloneDeep(_.clone(grid));

  increment = (grid, idxCol, idxRow) => {
    return grid.map((el, idx) => {
      el[idxRow]++;

      if (idxCol === idx) {
        return el.map((el2, idx2) => {
          return idx2 !== idxRow ? ++el2 : el2;
        });
      }

      return el
    });
  };

  onClick = async (idxCol, idxRow, e) => {
    const { grid } = this.state;
    let clicked = { idxCol, idxRow };
    let clonedGrid = this.cloneGrid(grid);
    
    // This function mutates state, once it is fixed, the return value needs to be used to setState
    let incrementedGrid = this.increment(clonedGrid, idxCol, idxRow);
  
    await this.setState({ grid: incrementedGrid, clicked });
    this.checkGrid();
  };

  isFibonacci = function (num, fib = 1, lastFib = 0) {
    if (fib < num) return this.isFibonacci(num, fib + lastFib, fib);
    if (fib === num) return true;
    return false;
  };

  checkFibonacci = (grid) => {
    let fibGrid = this.makeGrid();
    grid.forEach((arr, idxCol) => {
      arr.forEach((el, idxRow, arr) => {
        fibGrid[idxCol][idxRow] = this.isFibonacci(el)
          ? { idxCol, idxRow, num: el }
          : null;
      });
    });

    return fibGrid;
  };
  checkGrid = function () {
    const {
      state: { grid, length, minSeqLength },
      ...functions
    } = this;
    let clonedGrid = this.cloneGrid(grid);
    // extends lodash prototype chain, not really readable, but kind of cool;
    _.mixin({ ...functions });

    /* the functions here are connected to the prototype chain of lodash, thus they do not have access to the component state,
       which is great, cause then you cannot rely on state in the function, making them purer.
    */

    let checkedGrid = _.chain(grid)
      .checkFibonacci()
      .deconstruct(length)
      .checkSequence()
      .checkMinSeqLength(minSeqLength)
      .flatten()
      .deduplicate()
      .setFibsToZero(clonedGrid)
      .value();

    this.setState({ grid: checkedGrid });
  };

  deconstruct = function (grid, length) {
    let neighbours = [
      ...grid,
      ...this.getColumns(grid),
      ...this.getDiagonals(grid),
    ];
    let reverseNeighbours = neighbours.slice().reverse();
    return [...neighbours, ...reverseNeighbours];
  };

  getDiagonals = function (arr, length) {
    let diagonals = [];

    // g this is O(n^2), should be improved
    // Run the function separately: https://repl.it/@EdmondBitay/Algorithms-and-Data-Structures-1#diagonal.js (approximate version)

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

  getColumns = function (grid, length) {
    let columns = [];

    while (columns.length < length) {
      let column = [];
      grid.forEach((el) => column.push(el[columns.length]));
      columns.push(column);
    }

    return columns;
  };

  checkSequence = function (seqCont) {
    let sequences = [];

    seqCont.forEach((arr) => {
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

    return sequences;
  };

  checkMinSeqLength = function (sequences, minSeqLength) {
    let qualifiedSeqs = [];

    // This still yields some arrays that use a lax definition of "next to each other" e.g. [1, 1, 2, 3, 5, 1, 1, 2, 3]. For now it is fine.
    sequences.forEach((seq) => {
      let minSeq = [];
      seq.forEach((el, idx) => {
        if (!el || idx === seq.length) {
          if (minSeq.length >= minSeqLength) {
            qualifiedSeqs.push(minSeq);
            minSeq = [];
            return;
          }

          return (minSeq = []);
        }
        minSeq.push(el);
      });
    });

    return qualifiedSeqs;
  };

  setFibsToZero = (fibs, clonedGrid) => {
    fibs.forEach((el) => {
      if (el) clonedGrid[el.idxCol][el.idxRow] = 0;
    });
    return clonedGrid;
  };

  deduplicate = (fibs) =>
    fibs.filter(
      (current, idx, arr) =>
        idx ===
        arr.findIndex(
          (found) =>
            current.idxRow === found.idxRow && current.idxCol === found.idxCol
        )
    );

  getClassNames = function (idxCol, idxRow, el) {
    const { clicked } = this.state;
    if (el === 0) return "green rect";
    const sameRowOrCol = clicked.idxCol === idxCol || clicked.idxRow === idxRow;
    return sameRowOrCol ? "yellow rect" : "rect";
  };

  render() {
    const { length, cellSize, grid } = this.state;

    return (
      <div>
        <header className="container">
          <svg width={cellSize * length} height={cellSize * length}>
            {grid &&
              grid.map((row, idxCol) => (
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
