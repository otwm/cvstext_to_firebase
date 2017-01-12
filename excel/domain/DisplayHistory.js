import {Record} from "immutable";

const DisplayHistory = new Record({
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
    , source: ''
    , sourceEn: ''
    , artworks: []
    , people: []
    , city: []
    , locations: []
    , images: []
    , movies: []

});

export default DisplayHistory;
