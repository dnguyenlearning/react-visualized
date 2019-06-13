const columnsLength = 50;
const rowsLength = 200;
const loadmoreRows = 200;

function generateColumns() {
    let arr = [];
    for (let i = 0; i < columnsLength; i++) {
        arr.push({
            key: `key${i}`,
            name: `Column${i}`
        })
    }
    return arr;
}

function generateObj(row){
    let Obj = {};
    for (let i = 0; i < columnsLength; i++) {
        Obj[`key${i}`] = `value[row${row}][column${i}]`;
    }
    return Obj;
}

function generateRows() {
    let arr = [];
    for (let r = 0; r < rowsLength; r++) {
        let baseObj = generateObj(r);
        arr.push(Object.assign({}, baseObj))
    }
    return arr;
}

function generateMoreRows(currentLength){
    let items = []
    for (let i = 0; i < loadmoreRows; i++) {
        items.push(generateObj(currentLength+i))
    }
    return items;
}

const columns = generateColumns();
const rows = generateRows()

export {
    columns,
    rows,
    generateMoreRows
}