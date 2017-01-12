import Excel from "exceljs";
import info from "./domain";

const readProcess = (workbook, cb) => {
    var isRead = false;
    console.log(workbook);
    workbook.eachSheet(function (worksheet) {
        if (!isRead) {
            cb(worksheet);
            isRead = true;
        }
    });
};

const processRestColumn = (iter, record) => {
    const cellInfo = iter.next();
    if (cellInfo.done)return;
    record[cellInfo.value] = '';
    processRestColumn(iter, record);
};

const scan = (_value) => {
    console.log('scan!!!')
    for (let prop in  _value) {
        console.log(`${prop} ${_value[prop]}`);
        if (typeof _value[prop] == 'object') {
            scan(_value[prop]);
        }
    }
};

const getValue = (value, type) => {
    if (!value)return '';
    if (type == Excel.ValueType.RichText) {
        console.log(value.richText);
        return value.richText.map(item => {
            console.log(item.text);
            return item.text;
        }).join('');
    }
    return value;
};
const readExcel = (filename, domainName, cb) => {
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filename)
        .then(function () {
            readProcess(workbook, (sheet) => {
                var resultRow = [];
                sheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
                    // if (rowNumber !== 1) {
                    var iter = new info[domainName]().keys();
                    var record = {};

                    row.eachCell({includeEmpty: true}, cell => {
                        const cellInfo = iter.next();
                        const isValid = (done, key, value) => {
                            if (done)return false;
                            if (key !== "id")return true;
                            if (value == 'null')return false;
                            if (!value)return false;
                            return true;
                        };
                        if (isValid(cellInfo.done, cellInfo.value, cell.value)) {
                            record[cellInfo.value] = getValue(cell.value, cell.type);
                        }
                    });

                    processRestColumn(iter, record);
                    resultRow.push(record);
                    // }
                });
                cb(resultRow);
            });
        });
};

export default readExcel;