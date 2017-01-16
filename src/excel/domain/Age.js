import {Record} from "immutable";

const Age = new Record({
    id: ''
    , display: false
    , main: false
    , age: ''
    , start_year: ''
    , start_month: ''
    , start_day: ''
    , end_year: ''
    , end_month: ''
    , end_day: ''
    , content: ''
    , contentEn: ''
    , source: ''
    , sourceEn: ''
    , people: []
    , city: []
    , locations: []
    , movies: []
});

export default Age;