import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 30,
    max_col = 40;

const cell_class = ["cell", "cell start", "cell end", "cell obstacle"];

const col_index = [],
    row_index = [];

for (let i = 0; i < max_col; ++i) {
    col_index.push(i);
}

for (let i = 0; i < max_row; ++i) {
    row_index.push(i);
}

function Cell(props) {
    return (
        <div
            className={cell_class[props.value]}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseOver={props.onMouseOver}
        ></div>
    );
}

function Start_point(props) {
    return (
        <button id="startpoint-button" onClick={props.onClick}>
            Starting Point
        </button>
    );
}
function End_point(props) {
    return (
        <button id="endpoint-button" onClick={props.onClick}>
            End Point
        </button>
    );
}
function Find_path(props) {
    return (
        <button id="findpath-button" onClick={props.onClick}>
            Find Path
        </button>
    );
}

const array_cols = Array(max_col).fill(0);
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            start: { c1: 0, c2: 0 },
            end: { c1: max_row - 1, c2: max_col - 1 },
            //cells stores the state of each cell (0:free space; 1:start; 2:end; 3:obstacle)
            //cells: Array(max_row * max_col).fill(0),
            cells: Array(max_row)
                .fill(null)
                .map(() => Array.from(array_cols)),
            object: 3,
        };
    }

    renderCell(i, j) {
        let key = i * max_col + j;
        return (
            <Cell
                key={key}
                //value_row * max_col + value_col;
                c1={i}
                c2={j}
                value={this.state.cells[i][j]}
                onMouseDown={() => this.handlePress(i, j)}
                onMouseUp={() => this.handleRelease()}
                onMouseOver={() => this.handleSelect(i, j)}
            />
        );
    }

    renderButtons() {
        return (
            <div>
                <Start_point onClick={() => this.handleStartButton()} />
                <End_point onClick={() => this.handleEndButton()} />
                <Find_path onClick={() => this.handlefindpath()} />
            </div>
        );
    }

    handleStartButton() {
        if (this.state.object !== 1) {
            this.setState({
                object: 1,
            });
        } else {
            this.setState({
                object: 3,
            });
        }
    }

    handleEndButton() {
        if (this.state.object !== 2) {
            this.setState({
                object: 2,
            });
        } else {
            this.setState({
                object: 3,
            });
        }
    }

    handlePress(i, j) {
        const cells = Array.from(this.state.cells);
        const start = this.state.start;
        const end = this.state.end;
        cells[i][j] = this.state.object;

        if (this.state.object === 3) {
            this.setState({
                pressed: !this.state.pressed,
                cells: cells,
            });
        } else {
            if (this.state.object === 1) {
                cells[start.c1][start.c2] = 0;
                this.setState({
                    start: { c1: i, c2: j },
                    cells: cells,
                });
            } else if (this.state.object === 2) {
                cells[end.c1][end.c2] = 0;
                this.setState({
                    end: { c1: i, c2: j },
                    cells: cells,
                });
            }
        }
    }

    handleRelease() {
        if (this.state.object !== 1 && this.state.object !== 2) {
            this.setState({
                pressed: !this.state.pressed,
            });
        }
    }

    handleSelect(i, j) {
        if (this.state.pressed && this.state.object === 3) {
            const cells = Array.from(this.state.cells);
            cells[i][j] = 3;
            this.setState({
                cells: cells,
            });
        }
    }

    handlefindpath() {
        const cells = this.state.cells;
        findpath(cells, this.state.start, this.state.end);
        this.setState({
            cells: cells,
        });
    }

    render() {
        const rows = [];

        //for each row insert cols
        for (const [index_row] of row_index.entries()) {
            const cols = [];
            for (const [index_col] of col_index.entries()) {
                cols.push(this.renderCell(index_row, index_col));
            }

            rows.push(
                <div key={index_row} className="grid-row">
                    {cols}
                </div>
            );
        }

        return (
            <div>
                <div className="grid">{rows}</div>
                <div className="button-wrapper">{this.renderButtons()}</div>
                <div>{this.state.object}</div>
            </div>
        );
    }
}

ReactDOM.render(<Grid />, document.getElementById("root"));

function findpath(cells, start, end) {
    const open = Array(max_row)
        .fill(null)
        .map(() => Array.from(array_cols));
    const closed = Array.from(open);
    const farr = [];

    open[start.c1][start.c2] = 1;
    repeat;
    const current = { c1: start.c1, c2: start.c2 };

    operations.forEach(([x, y]) => {
        if (
            !closed[current.c1 + x][current.c1 + y] &&
            cells[current.c1 + x][current.c2 + y] !== 3
        ) {
        }
    });
}

const distance = (a, b) => {
    Math.sqrt(Math.pow(a.c1 - b.c1, 2) + Math.pow(a.c2 - b.c2, 2));
};

const operations = [
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
];

const insert_element = (arr, element) => {
    arr.push(element);
    arr.sort();
};

//save every move in an array [cells, cells, cells,...]
//delay function
//setTimeout(() => function, 250);
