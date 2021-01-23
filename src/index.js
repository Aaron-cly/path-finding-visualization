import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 30,
    max_col = 40;
// 0:free    1:start      2:end       3:obstacle      4:open list   5:closed list
const cell_class = [
    "cell", //0: free space
    "cell start", //1: start node
    "cell end", //2: end node
    "cell obstacle", //3: obstacle
    "cell open", //4: open list
    "cell closed", //5: closed list
];

const col_index = [],
    row_index = [];

for (let i = 0; i < max_col; ++i) {
    col_index.push(i);
}

for (let i = 0; i < max_row; ++i) {
    row_index.push(i);
}

class Node {
    constructor({ c1, c2 }, gCost, hCost, { p1, p2 } = {}) {
        this.c1 = c1;
        this.c2 = c2;
        this.gCost = gCost; //distance from start
        this.hCost = hCost; //distance from end
        this.parent = { c1: p1, c2: p2 };
    }

    get fCost() {
        //node.fCost to call
        return this.hCost + this.gCost;
    }

    set new_object(object) {
        this.object = object;
    }

    set new_gCost(gCost) {
        this.gCost = gCost;
    }

    set new_parent({ c1, c2 }) {
        this.parent.c1 = c1;
        this.parent.c2 = c2;
    }
}
const array_cols = Array(max_col).fill(0);

const open = []; //open list that stores open nodes
const closed = Array(max_row)
    .fill(null)
    .map(() => Array.from(array_cols)); //0: not on closed list; 1: on closed list;

const node_cols = Array(max_col).fill(new Node(0));

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
function Next_step(props) {
    return (
        <button id="nextstep-button" onClick={props.onClick}>
            Next step
        </button>
    );
}

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
                <Next_step onClick={() => this.handleNextstep()} />
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
        // const open = []; //open list that stores open nodes
        //const closed = Array(max_row)

        const cells = this.state.cells;
        const start = this.state.start;
        const end = this.state.end;

        const start_node = new Node(
            { c1: start.c1, c2: start.c2 },
            0,
            distance(start, end),
            { p1: start.c1, p2: start.c2 }
        );
        open.push(start_node);

        // while (!closed[this.state.end.c1][this.state.end.c2]) {
        // setTimeout(
        //     () => findpath(cells, start, this.state.end, open, closed),
        //     250
        // );
        // findpath(cells, start, end, open, closed);
        // this.setState({
        //     cells: cells,
        // });
        this.handleNextstep(cells, start, end);
        // }
    }

    handleNextstep(cells, start, end) {
        // const cells = this.state.cells;
        // const start = this.state.start;
        // const end = this.state.end;
        findpath(cells, start, end, open, closed);
        this.setState({
            cells: cells,
        });
        if (closed[end.c1][end.c2]) return;
        setTimeout(() => this.handleNextstep(cells, start, end), 50);
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

function findpath(cells, start, end, open, closed) {
    //look for the lowest f on open list
    let index = 0;
    for (let i = 1; i < open.length; ++i) {
        if (open[i].fCost <= open[index].fCost) {
            index = i;
        }
    }
    const current = open[index];
    open.splice(index, 1); //remove the node with smallest fcost from open list
    cells[current.c1][current.c2] = 5;
    closed[current.c1][current.c2] = 1; //add the node to closed list

    operations.forEach(([x, y]) => {
        const c1 = current.c1 + x,
            c2 = current.c2 + y;
        if (c1 >= max_row || c1 < 0 || c2 >= max_col || c2 < 0) return;

        if (closed[c1][c2] !== 1 && cells[c1][c2] !== 3) {
            //if not on open list, add to open list
            //and make the current cell the parent of this cell
            //record the f,g,h costs of this cell

            let i = 0;
            for (; i < open.length; ++i) {
                if (open[i].c1 === c1 && open[i].c2 === c2) break;
            }
            if (i === open.length) {
                //if this neigbor cell is not on open list
                const node = new Node(
                    { c1: c1, c2: c2 },
                    1 + current.gCost,
                    distance(end, { c1: c1, c2: c2 }),
                    { p1: current.c1, c2: current.c2 }
                );
                open.push(node);
                cells[c1][c2] = 4;
            } else {
                //if this neighbor cell is on open already
                //compare gcost
                // const existing = open[i];
                if (current.gCost + 1 < open[i].gCost) {
                    open[i].new_gCost = current.gCost + 1;
                    open[i].parent = { p1: current.c1, p2: current.c2 };
                }
            }
        }
    });
    // updateCells(cells, open, closed);
}

function distance(a, b) {
    return Math.pow(a.c1 - b.c1, 2) + Math.pow(a.c2 - b.c2, 2);
}

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
