import React, { Component } from 'react';
import { columns, rows, generateMoreRows } from "./data";
import { Column, Table, InfiniteLoader } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { ReactComponent as Spinner } from './images/spinner200px.svg';

function findSelected(selectedCells, row) {
    return selectedCells.hasOwnProperty(`${row.rowIndex}${row.columnIndex}`)
}

class Cell extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.defaultClick !== this.props.defaultClick ||
            nextProps.value !== this.props.value
    }
    render() {
        const { value, defaultClick, onClick } = this.props;
        return <span
            className={defaultClick ? 'selected' : ""}
            onClick={onClick}
        >{value}</span>
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCells: {},
            items: rows,
            loading: false
        }
    }

    handleSelectedChange = (e, { rowIndex, columnIndex }) => {
        const { selectedCells } = this.state;
        if (e.ctrlKey && selectedCells.length !== 0) {
            if (findSelected(selectedCells, { rowIndex, columnIndex })) {
                delete selectedCells[`${rowIndex}${columnIndex}`]
            } else {
                selectedCells[`${rowIndex}${columnIndex}`] = true;
            }
            this.setState({
                selectedCells
            })
        } else {
            let newObj = Object.assign({}, {
                [`${rowIndex}${columnIndex}`]: true
            })
            console.log(newObj)
            this.setState({
                selectedCells: newObj
            })
        }
    }

    loadMore = () => {
        this.setState({
            loading: true
        })
        setTimeout(() => {
            this.actuallyLoadMore();
            this.setState({
                loading: false
            })
        }, 500)
        return new Promise((resolve, reject) => {
           this.promiseResolve = resolve;
        })
     }

     actuallyLoadMore = () => {
        let currentLength = this.state.items.length + 1
        let newItems = generateMoreRows(currentLength);
        console.log('getMore')
        this.setState({ items: this.state.items.concat(newItems)},()=>{
            this.promiseResolve();
        })       
     }

    render() {
        const { selectedCells, items, loading } = this.state;
        return <div className="app">
            <h1>This is example of {items.length} ROWS and {columns.length} COLUMNS</h1>
            {loading && <Spinner />}
            <InfiniteLoader
                isRowLoaded={({ index }) => !!this.state.items[index]}
                loadMoreRows={this.loadMore}
                rowCount={100000000000}
            >
                {({ onRowsRendered, registerChild }) => (
                    <Table
                        width={9999999}
                        height={1000}
                        headerHeight={50}
                        rowHeight={50}
                        rowClassName='table-row'
                        rowCount={items.length}
                        ref={registerChild}
                        rowGetter={({ index }) => items[index]}
                        onRowsRendered={onRowsRendered}
                    >
                        {columns.map(column => {
                            return <Column
                                key={column.name}
                                label={column.name}
                                dataKey={column.key}
                                width={200}
                                cellRenderer={({ cellData, rowIndex, columnIndex }) => {
                                    const selected = findSelected(selectedCells, { rowIndex, columnIndex });
                                    return <Cell
                                        value={cellData}
                                        defaultClick={selected}
                                        onClick={(e) => this.handleSelectedChange(e, { rowIndex, columnIndex })}
                                    />
                                }}
                            />
                        })}
                    </Table>
                )}
            </InfiniteLoader>
        </div>
    }

}

export default App;
