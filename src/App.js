import React, { Component } from 'react';
import { columns, rows, generateMoreRows } from "./data";
import { Column, Table, InfiniteLoader } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { ReactComponent as Spinner } from './images/spinner200px.svg';
import $ from "jquery";
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/selectable.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/selectable';

function findSelected(selectedCells, row) {
    return selectedCells.hasOwnProperty(`row[${row.rowIndex}]column[${row.columnIndex}]`)
}

class Cell extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.defaultClick !== this.props.defaultClick ||
            nextProps.value !== this.props.value
    }
    render() {
        const { value, defaultClick, onClick, columnIndex, rowIndex } = this.props;
        return <span
            className={defaultClick ? 'selected default' : "default"}
            onClick={onClick}
            data-row={rowIndex}
            data-column={columnIndex}
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

        this.tempItems = Object.assign({});
        this.timeOut = 0;
    }

    componentDidMount() {
        this.registerSelect();
    }

    registerSelect = () => {
        $('#tableWrapper').selectable({
            filter: "span.default",
            start: (event, ui) => {
                $('span.default').removeClass('selected');
                this.tempItems = Object.assign({});
            },
            selected: (event, ui) => {
                let $selectedElem = $(ui.selected);
                let rowIndex = $selectedElem.data('row');
                let columnIndex =$selectedElem.data('column');
                $selectedElem.addClass('selected');
                let index = `row[${rowIndex}]column[${columnIndex}]`;
                this.tempItems[index] = true;
            },
            stop: (event, ui)=>{
                this.setState({
                    selectedCells: this.tempItems
                })
            },
            autoRefresh: false
        })
    }

    reset = () => {
        $('#tableWrapper').selectable('destroy')
    }
    
    handleScroll = () => {
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.reset();
            this.registerSelect()
        }, 300);
    }

    componentWillUnmount() {
        this.reset();
        if(this.timeOut) clearTimeout(this.timeOut);
    }

    handleSelectedChange = (e, { rowIndex, columnIndex }) => {
       
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
        this.setState({ items: this.state.items.concat(newItems) }, () => {
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
                    <div
                        id="tableWrapper"
                        className={"noselect"}
                    >
                        <Table
                            width={99999990999}
                            height={1000}
                            headerHeight={50}
                            rowHeight={50}
                            onScroll={this.handleScroll}
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
                                            rowIndex={rowIndex}
                                            columnIndex={columnIndex}
                                            onClick={(e) => this.handleSelectedChange(e, { rowIndex, columnIndex })}
                                        />
                                    }}
                                />
                            })}
                        </Table>
                    </div>
                )}
            </InfiniteLoader>
        </div>
    }

}

export default App;
