import {Record} from "immutable";

const Analects = new Record({
    id: ''
    , display: false
    , age: ''
    , startYear: ''
    , startMonth: ''
    , startDay: ''
    , content: ''
    , contentEn: ''
    , keyword: ''
    , sourceYear: ''
    , sourceMonth: ''
    , sourceDay: ''
    , source: ''
    , sourceEn: ''
    , people: []
});

export default Analects;
