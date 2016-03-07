/*globals document, L, window */
/* jshint node: true */
var Rx = require('rx-dom'),
    leafletCss = require('leaflet/dist/leaflet.css'),
    leafletJs = require('leaflet/dist/leaflet.js');

document.addEventListener("DOMContentLoaded", function(event) {
    let QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojsonp',
        map = L.map('map').setView([33.858631, -118.279602], 7);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
    let quakes = Rx.Observable
        .interval(5000)
        .flatMap(() => Rx.DOM.jsonpRequest({
            url: QUAKE_URL,
            jsonpCallback: 'eqfeed_callback'
        }).retry(3))
        .flatMap((result) => Rx.Observable.from(result.response.features))
        .distinct((quake)=> quake.properties.code)
        .map((quake) => ({
            lat: quake.geometry.coordinates[1],
            lng: quake.geometry.coordinates[0],
            size: quake.properties.mag * 10000,
            place: quake.properties.place
        }));

    quakes.subscribe((quake) => {
        let circle = L.circle([quake.lat, quake.lng], quake.size).addTo(map);
        Rx.DOM.mouseover(circle).subscribe((obj) => {
            L.popup().setLatLng([quake.lat, quake.lng])
                .setContent("At " + quake.place + "<br />" + "Magnitude: " + (quake.size / 10000).toString())
                .openOn(map);
        });
    });
});

