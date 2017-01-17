import Excel from "exceljs";
import info from "/domain";

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

/**
 * 빈 컬럼에 대한 처리
 * @param iter
 * @param record
 */
const processRestColumn = (iter, record) => {
    const cellInfo = iter.next();
    if (cellInfo.done)return;
    record[cellInfo.value] = null;
    processRestColumn(iter, record);
};

/**
 * 디버그용 오브젝트 스캔
 * @param _value
 */
const scan = (_value) => {
    for (let prop in  _value) {
        console.log(`${prop} ${_value[prop]}`);
        if (typeof _value[prop] == 'object') {
            scan(_value[prop]);
        }
    }
};

/**
 * 밸류가 존재하지 않으면 null 반환
 * 밸류가 RichText 이면 text만 추출
 * @param value
 * @param type
 * @returns {*}
 */
const getValue = (value, type) => {
    if (!value)return null;
    if (type == Excel.ValueType.RichText) {
        const _value = value.richText.map(item => {
            console.log(item.text);
            return item.text;
        }).join('');
        if (_value === '')return null;
        return _value;
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
                    if (rowNumber !== 1) {
                        var iter = new info[domainName]().keys();
                        var record = {};

                        row.eachCell({includeEmpty: true}, cell => {
                            const cellInfo = iter.next();
                            const isValid = (done, key, value) => {
                                if (done)return false;
                                if (value == 'null')return false;
                                if (!value)return false;
                                if (key !== "id")return true;
                                return true;
                            };
                            if (isValid(cellInfo.done, cellInfo.value, cell.value)) {
                                record[cellInfo.value] = getValue(cell.value, cell.type);
                            }
                        });
                        processRestColumn(iter, record);
                        resultRow.push(record);
                    }
                });
                cb(resultRow);
            });
        });
};

export default readExcel;