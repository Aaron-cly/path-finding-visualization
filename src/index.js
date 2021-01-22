import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 30,
    max_col = 80;

const cell_class = ["cell", "cell start", "cell end", "cell obstacle"];

const cells_index = [],
    col_index = [],
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
            id={props.coord}
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseOver={props.onMouseOver}
        />
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

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            start: null,
            end: null,
            //cells stores the state of each cell (0:free space; 1:start; 2:end; 3:obstacle)
            cells: Array(max_row * max_col).fill(0),
            object: 3,
        };
    }

    renderCell(i) {
        return (
            <Cell
                key={i}
                coord={i}
                value={this.state.cells[i]}
                onMouseDown={() => this.handlePress(i)}
                onMouseUp={() => this.handleRelease()}
                onMouseOver={() => this.handleSelect(i)}
            />
        );
    }

    renderButtons() {
        return (
            <div>
                <Start_point onClick={() => this.handleStartButton()} />
                <End_point onClick={() => this.handleEndButton()} />
                <Find_path onClick={() => this.handlefindpath(0)} />
            </div>
        );
    }

    handleStartButton() {
        if (this.state.object != 1) {
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
        if (this.state.object != 2) {
            this.setState({
                object: 2,
            });
        } else {
            this.setState({
                object: 3,
            });
        }
    }

    handlePress(i) {
        const cells = Array.from(this.state.cells);
        cells[i] = this.state.object;
        if (this.state.object === 3) {
            this.setState({
                pressed: !this.state.pressed,
                cells: cells,
            });
        } else {
            if (this.state.object === 1) {
                cells[this.state.start] = 0;
                this.setState({
                    start: i,
                });
            }
            if (this.state.object === 2) {
                cells[this.state.end] = 0;
                this.setState({
                    end: i,
                });
            }
            this.setState({
                cells: cells,
            });
        }
    }

    handleRelease() {
        this.setState({
            pressed: !this.state.pressed,
        });
    }

    handleSelect(i) {
        if (this.state.pressed && this.state.object === 3) {
            const cells = Array.from(this.state.cells);
            cells[i] = 3;
            this.setState({
                cells: cells,
            });
        }
    }

    findpath(cells, j) {
        cells[0] = j;
    }

    handlefindpath(coord) {
        const cells = this.state.cells;
        cells[coord] = 3;
        this.setState({
            cells: cells,
        });
        //add delay
        if (coord > 10) return;
        setTimeout(() => this.handlefindpath(coord + 1), 250);
    }

    render() {
        const rows = [];

        //for each row insert cols
        for (const [index_row, value_row] of row_index.entries()) {
            const cols = [];
            let coord;
            for (const [index_col, value_col] of col_index.entries()) {
                coord = value_row * max_col + value_col;
                cols.push(this.renderCell(coord));
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
/*
function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
}
*/

//save every move in an array [cells, cells, cells,...]
