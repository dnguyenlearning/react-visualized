import React, { useState, useReducer, useMemo, useEffect } from 'react';
import { columns, rows } from "./data";
import { Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';
import * as _ from "lodash";

function findSelected(selectedCells, row) {
    return _.some(selectedCells, row)
}

const initialState = {
    selectedCells: []
};

function reducer(state, action) {
    console.log("action", action)
  switch (action.type) {
    case 'select':
      return {selectedCells: action.selectedCells};
    case 'reset':
      return {selectedCells: action.selectedCells};
    default:
      throw new Error();
  }
}
 

function Cell({ value, columnIndex, rowIndex }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [selected, setSelected] = useState(false);

    useEffect(()=>{
        console.log("selectedCells", state.selectedCells);
        setSelected(findSelected(state.selectedCells, {rowIndex, columnIndex}))
    },[state.selectedCells, columnIndex, rowIndex])

    console.log('render')
    const handleCellClick = (e) => {
        console.log(e.ctrlKey, state.selectedCells)
        if (e.ctrlKey && state.selectedCells.length !== 0) {
            const selectedCellsCoppied = [...state.selectedCells,  {rowIndex, columnIndex}]
            console.log('selectedCellsCoppied', selectedCellsCoppied)
            dispatch({type: 'select', selectedCells: selectedCellsCoppied})
        } else {
            dispatch({type: 'reset', selectedCells: [{rowIndex, columnIndex}]})
        }
    }
    return <span
        className={selected? 'selected': ""}
        onClick={handleCellClick}
    >{value}</span>
}

function App() {
    let [selectedCells, setSelectedCells] = useState([]);

    const handleSelectedChange = (e, { rowIndex, columnIndex }) => {
        
    }

    return <div className="app">
        <h1>This is example of {rows.length} ROWS and {columns.length} COLUMNS</h1>  
        <Table
            width={9999999}
            height={1000}
            headerHeight={50}
            rowHeight={50}
            rowCount={rows.length}
            rowGetter={({ index }) => rows[index]}
            className={'override'}
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
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            // defaultClick={findSelected(selectedCells, { rowIndex, columnIndex })}
                            onClick={(e) =>console.log('hehe')}
                        />
                    }}
                />
            })}
        </Table>
    </div>
}

export default App;
