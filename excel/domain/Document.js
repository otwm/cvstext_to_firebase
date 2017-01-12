import {Record} from "immutable";

const Document = new Record({
    id: ''
    , display: false
    , age: ''
    , start_year: ''
    , start_month: ''
    , start_day: ''
    , end_year: ''
    , end_month: ''
    , end_day: ''
    , name: ''
    , nameEn: ''
    , type: ''
    , premiere: false
    , source: ''
    , sourceEn: ''
    , people: []
    , city: []
    , locations: []
    , movies: []
});

export default Document;
