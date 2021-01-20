import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const max_row = 10,
    max_col = 10;

function Cell(props) {
    return (
        <button
            className="cell"
            onMouseDown={props.onMouseDown}
            onMouseUp={props.onMouseUp}
            onMouseOver={props.onMouseOver}
        >
            {props.value}
        </button>
    );
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
            value: 1,
        };
    }

    renderCell(i) {
        return (
            <Cell
                onMouseDown={() => {
                    this.handlePress();
                }}
                onMouseUp={() => this.handleRelease()}
                onMouseOver={() => this.handleSelect(i)}
                value={this.state.value}
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
        return (
            <div>
                <div className="grid-row">
                    {this.renderCell(1)}
                    {this.renderCell(2)}
                </div>
                <div className="grid-row">
                    {this.renderCell(3)}
                    {this.renderCell(4)}
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Grid />, document.getElementById("root"));
