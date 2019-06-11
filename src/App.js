import React, { useState } from 'react';
import { columns, rows } from "./data";
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import * as _ from "lodash";

function findSelected(selectedCells, row) {
    return _.some(selectedCells, row)
}

function Cell({ value, onClick, defaultClick }) {
    const handleCellClick = (e) => {
        onClick(e)
    }
    return <span
        style={{
            color: "red",
            border: (defaultClick) ? '1px solid black' : ''
        }}

        onClick={handleCellClick}
    >{value}</span>
}

function App() {
    let [selectedCells, setSelectedCells] = useState([]);

    const handleSelectedChange = (e, { rowIndex, columnIndex }) => {
        if (e.ctrlKey && selectedCells.length !== 0) {
            setSelectedCells([...selectedCells, {
                rowIndex, columnIndex
            }])
        } else {
            setSelectedCells([]);
            setSelectedCells([{
                rowIndex, columnIndex
            }])
        }
    }

    return <div>
        <h1>This is example of {rows.length} ROWS and {columns.length} COLUMNS</h1>  
        <Table
            width={999999}
            height={1000}
            headerHeight={20}
            rowHeight={30}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
        >
            {columns.map(column => {
                return <Column
                    key={column.name}
                    label={column.name}
                    dataKey={column.key}
                    width={200}
                    cellRenderer={({ cellData, rowIndex, columnIndex }) => {
                        return <Cell
                            value={cellData}
                            defaultClick={findSelected(selectedCells, { rowIndex, columnIndex })}
                            onClick={(e) => handleSelectedChange(e, { rowIndex, columnIndex })}
                        />
                    }}
                />
            })}
        </Table>
    </div>
}

export default App;
