import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 30,
    max_col = 80;

function Cell(props) {
    return (
        <div
            className="cell"
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseOver={props.onMouseOver}
        >
            {props.value}
        </div>
    );
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            value: 0,
            cells: Array(max_row * max_col).fill(0), //stores the state of each cell (0:free space; 1:start; 2:end; -1:obstacle)
        };
    }

    renderCell(i) {
        return (
            <Cell
                key={i}
                value={this.state.value}
                onMouseDown={() => this.handlePress()}
                onMouseUp={() => this.handleRelease()}
                onMouseOver={() => this.handleSelect(i)}
            />
        );
    }

    handlePress() {
        this.setState({
            pressed: !this.state.pressed,
        });
        this.setState({
            value: this.state.value + 1,
        });
    }

    handleRelease() {
        this.setState({
            pressed: !this.state.value,
        });
    }

    handleSelect(i) {
        if (this.state.pressed) {
            this.setState({
                value: this.state.value + 1,
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

        for (const [index, value] of col_index.entries()) {
            cols.push(this.renderCell({ value }));
        }

        for (let i = 0; i < max_row; ++i) {
            row_index.push(i);
        }

        for (const [index, value] of row_index.entries()) {
            rows.push(
                <div key={index} className="grid-row">
                    {cols}
                </div>
            );
        }

        return <div className="grid">{rows}</div>;
    }
}

ReactDOM.render(<Grid />, document.getElementById("root"));
