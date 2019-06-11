const columnsLength = 15;
const rowsLength = 40;

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

function generate1000Rows() {
    let arr = [];
    for (let r = 0; r < rowsLength; r++) {
        let baseObj = generateObj(r);
        arr.push(Object.assign({}, baseObj))
    }
    return arr;
}

const columns = generateColumns();
const rows = generate1000Rows()

export {
    columns,
    rows
}