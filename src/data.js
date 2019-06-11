const columnsLength = 100;
const rowsLength = 1000;

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

function generateObj(column){
    let Obj = {};
    for (let i = 0; i < columnsLength; i++) {
        Obj[`key${i}`] = `value[row${i}][column${column}]`;
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