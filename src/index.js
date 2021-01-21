import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 30,
    max_col = 80;

const cell_class = ["cell", "cell start", "cell end", "cell obstacle"];

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

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            //cells stores the state of each cell (0:free space; 1:start; 2:end; 3:obstacle)
            cells: Array(max_row * max_col).fill(0),
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
        const cells_index = [];
        const col_index = [];
        const row_index = [];
        const cells = [];
        const cols = [];
        const rows = [];

        for (let i = 0; i < max_col; ++i) {
            col_index.push(i);
        }

        for (let i = 0; i < max_row; ++i) {
            row_index.push(i);
        }

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
                <div>{this.state.cells[0]}</div>
            </div>
        );
    }
}

ReactDOM.render(<Grid />, document.getElementById("root"));
