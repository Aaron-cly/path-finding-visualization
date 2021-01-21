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
    return <button id="startpoint-button">Starting Point</button>;
}
function End_point(props) {
    return <button id="endpoint-button">End Point</button>;
}
function Find_path(props) {
    return <button id="findpath-button">Find Path</button>;
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
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
                <Start_point />
                <End_point />
                <Find_path />
            </div>
        );
    }

    handleStartButton() {
        if (this.state.object === 3) {
            this.setState({
                object: 3,
            });
        } else {
        }
    }

    handlePress(i) {
        const cells = Array.from(this.state.cells);
        cells[i] = 3;
        this.setState({
            pressed: !this.state.pressed,
            cells: cells,
        });
    }

    handleRelease() {
        this.setState({
            pressed: !this.state.pressed,
        });
    }

    handleSelect(i) {
        if (this.state.pressed) {
            const cells = Array.from(this.state.cells);
            cells[i] = 3;
            this.setState({
                cells: cells,
            });
        }
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
            </div>
        );
    }
}

ReactDOM.render(<Grid />, document.getElementById("root"));
