/* -*- Mode: JS2; indent-tabs-mode: nil; js2-basic-offset: 4 -*- */
/* vim: set et ts=4 sw=4: */
/*
 * Copyright (c) 2014 Jonas Danielsson
 *
 * GNOME Maps is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * GNOME Maps is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with GNOME Maps; if not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Jonas Danielsson <jonas@threetimestwo.org>
 */

const Geocode = imports.gi.GeocodeGlib;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Location = imports.location;
const Translations = imports.translations;

const Place = new Lang.Class({
    Name: 'Place',
    Extends: Geocode.Place,

    _init: function(params) {
        this._population = params.population;
        delete params.population;

        this._wiki = params.wiki;
        delete params.wiki;

        this._openingHours = params.openingHours;
        delete params.openingHours;

        /* Determines if the place should be added to the place store */
        if (typeof(params.store) === 'undefined') {
            this._store = true;
        } else {
            this._store = params.store;
            delete params.store;
        }

        this._wheelchair = params.wheelchair;
        delete params.wheelchair;

        if (params.place) {
            params = { osm_id: params.place.osm_id,
                       osm_type: params.place.osm_type,
                       name: params.place.name,
                       location: params.place.location,
                       bounding_box: params.place.bounding_box,
                       place_type: params.place.place_type,
                       street_address: params.place.street_address,
                       street: params.place.street,
                       building: params.place.building,
                       postal_code: params.place.postal_code,
                       area: params.place.area,
                       town: params.place.town,
                       state: params.place.state,
                       county: params.place.county,
                       country: params.place.country,
                       country_code: params.place.contry_code,
                       continent: params.place.continent };
        }

        for (let prop in params)
            if (!params[prop])
                delete params[prop];

        this.parent(params);
    },

    set store(v) {
        this._store = v;
    },

    get store() {
        return this._store;
    },

    get uniqueID() {
        return this.osm_type + '-' + this.osm_id;
    },

    set population(v) {
        this._population = v;
    },

    get population() {
        return this._population;
    },

    set wiki(v) {
        this._wiki = v;
    },

    get wiki() {
        return this._wiki;
    },

    set openingHours(v) {
        this._openingHours = v;
    },

    get openingHours() {
        return this._openingHours;
    },

    get openingHoursTranslated() {
        return Translations.translateOpeningHours(this._openingHours);
    },

    set wheelchair(v) {
        this._wheelchair = v;
    },

    get wheelchair() {
        return this._wheelchair;
    },

    get wheelchairTranslated() {
        return this._translateWheelchair(this._wheelchair);
    },

    _translateWheelchair: function(string) {
        switch(string) {
            /* Translators:
             * This means wheelchairs have full unrestricted access.
             */
            case 'yes': return _("yes");

            /* Translators:
             * This means wheelchairs have partial access (e.g some areas
             * can be accessed and others not, areas requiring assistance
             * by someone pushing up a steep gradient).
             */
            case 'limited': return _("limited");

            /* Translators:
             * This means wheelchairs have no unrestricted access
             * (e.g. stair only access).
             */
            case 'no': return _("no");

            /* Translators:
             * This means that the way or area is designated or purpose built
             * for wheelchairs (e.g. elevators designed for wheelchair access
             * only). This is rarely used.
             */
            case 'designated': return _("designated");

            default: return null;
        }
    },


    toJSON: function() {
        let bounding_box = null;

        if (this.bounding_box) {
            bounding_box = { top: this.bounding_box.top,
                             bottom: this.bounding_box.bottom,
                             left: this.bounding_box.left,
                             right: this.bounding_box.right };
        }

        let location = { latitude: this.location.latitude,
                         longitude: this.location.longitude,
                         altitude: this.location.altitude,
                         accuracy: this.location.accuracy };

        return { id: this.osm_id,
                 osm_type: this.osm_type,
                 name: this.name,
                 bounding_box: bounding_box,
                 this_type: this.this_type,
                 location: location,
                 street_address: this.street_address,
                 street: this.street,
                 building: this.building,
                 postal_code: this.postal_code,
                 area: this.area,
                 town: this.town,
                 state: this.state,
                 county: this.county,
                 country: this.country,
                 country_code: this.contry_code,
                 continent: this.continent,
                 population: this.population,
                 wiki: this.wiki,
                 wheelchair: this.wheelchair,
                 openingHours: this.openingHours };
    },

    match: function(searchString) {
        let name = this.name;
        if (!name)
            return false;

        searchString = GLib.utf8_normalize(searchString, -1, GLib.NormalizeMode.ALL);
        if (searchString === null)
            return false;

        if (searchString.length === 0)
            return true;

        name = GLib.utf8_normalize(name, -1, GLib.NormalizeMode.ALL);
        if (name === null)
            return false;

        return name.toLowerCase().search(searchString.toLowerCase()) !== -1;
    }
});

Place.fromJSON = function(obj) {
    let props = { };

    for (let key in obj) {
        let prop = obj[key];

        switch(key) {
            case 'id':
                props.osm_id = prop;
                break;

            case 'location':
                props.location = new Location.Location(prop);
                break;

            case 'bounding_box':
                if (prop)
                    props.bounding_box = new Geocode.BoundingBox(prop);
                break;

            default:
                if (prop !== null && prop !== undefined)
                    props[key] = prop;
                break;
        }
    }
    return new Place(props);
};
