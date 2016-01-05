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

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Lang = imports.lang;

const OSMTypeListRow = imports.osmTypeListRow;
const PropagatingSearchPopover = imports.propagatingSearchPopover;

const OSMTypeSearchPopover = new Lang.Class({
    Name: 'OSMTypeSearchPopover',
    Extends: PropagatingSearchPopover.PropagatingSearchPopover,
    Template: 'resource:///org/gnome/Maps/ui/osm-type-search-popover.ui',
    Signals : {
        /* signal emitted when selecting a type, indicates OSM key and value
           and display title */
        'selected' : { param_types: [ GObject.TYPE_STRING,
                                      GObject.TYPE_STRING,
                                      GObject.TYPE_STRING ] }
    },
    InternalChildren: ['list'],

    _init: function(props) {
        this.parent(props);

        this._list.connect('row-activated', (function(list, row) {
            if (row)
                this.emit('selected', row.key, row.value, row.title);
        }).bind(this));
    },

    showMatches: function(matches) {
        this._list.forall(function(row) {
            row.destroy();
        });

        matches.forEach((function(type) {
            this._addRow(type);
        }).bind(this));
        this.show();
    },

    _addRow: function(type) {
        let row = new OSMTypeListRow.OSMTypeListRow({ type: type,
                                                      can_focus: true });
        this._list.add(row);
    }
 });
 
