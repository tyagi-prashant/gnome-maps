/* -*- Mode: JS2; indent-tabs-mode: nil; js2-basic-offset: 4 -*- */
/* vim: set et ts=4 sw=4: */
/*
 * Copyright (c) 2015 Marcus Lundblad.
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
 * Author: Marcus Lundblad <ml@update.uu.se>
 */

const OSM_TYPE_MAP = [
    /* amenities */
    {key: 'amenity', value: 'pub', title: _("Pub")},
    {key: 'amenity', value: 'bar', title: _("Bar")},
    {key: 'amenity', value: 'atm', title: _("ATM")},
    {key: 'amenity', value: 'restaurant', title: _("Restaurant")},
    {key: 'amenity', value: 'school', title: _("School")},
    {key: 'amenity', value: 'kindergarden', title: _("Kindergarden")},
    {key: 'amenity', value: 'pharmacy', title: _("Pharmacy")},

    /* shops */
    {key: 'shop', value: 'supermarket', title: _("Supermarket")}
];

/* Sort function comparing two type values accoring to the locale-specific
   comparison of the type title */
function _sortType(t1, t2) {
    return t1.title.toLocaleLowerCase().localeCompare(t2.title.toLocaleLowerCase());
}

function findMatches(prefix, maxMatches) {
    let numMatches = 0;
    let prefixLength = prefix.length;
    let normalized = prefix.toLocaleLowerCase();
    let matches = [];

    for (let i = 0; i < OSM_TYPE_MAP.length && numMatches < maxMatches; i++) {
        let item = OSM_TYPE_MAP[i];

        if (item.title.substring(0, prefixLength).toLocaleLowerCase() === normalized) {
            numMatches++;
            matches.push(item);
        }
    }

    return matches.sort(_sortType);
}
