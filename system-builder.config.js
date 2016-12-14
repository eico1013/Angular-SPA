/*
 * Copyright (C) 2016 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global System */

// https://github.com/systemjs/systemjs/blob/master/docs/overview.md
// https://github.com/systemjs/systemjs/blob/master/docs/config-api.md

// -----------------------------------------------
// Konfiguration der eigenen Module
// -----------------------------------------------
System.config({
    map: {
        'app': 'tmp/app',
        'buecher': 'tmp/buecher',
        'home': 'tmp/home',
        'iam': 'tmp/iam',
        'layout': 'tmp/layout',
        'shared': 'tmp/shared',
    },
    packages: {
        'app': {
            main: 'main.js',
            defaultExtension: 'js'
        },
        'buecher': {
            // Barrel
            main: 'index.js',
            defaultExtension: 'js'
        },
        'buecher/shared': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'home': {
            defaultExtension: 'js'
        },
        'iam': {
            defaultExtension: 'js'
        },
        'layout': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'shared': {
            main: 'index.js',
            defaultExtension: 'js'
        },
    }
});

// -----------------------------------------------
// Konfiguration fuer Angular
// -----------------------------------------------
const barrelsAngular = [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/forms',
    '@angular/http',
    '@angular/router',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic'
];
const packagesAngular = {};
barrelsAngular.forEach((barrelName) => {
    'use strict';
    packagesAngular[barrelName] = {main: 'index', defaultExtension: 'js'};
});
System.config({
    map: {'@angular': 'node_modules/@angular'},
    packages: packagesAngular
});

// -----------------------------------------------
// Konfiguration fuer sonstige Software
// -----------------------------------------------
const configOther = [
    {name: 'rxjs', main: 'Rx.js'},
    {name: 'chart.js', main: 'src/chart.js'},
    {name: 'chartjs-color', main: 'index.js'},
    {name: 'chartjs-color-string', main: 'color-string.js'},
    {name: 'color-convert', main: 'index.js'},
    {name: 'color-name', main: 'index.js'},
    {name: 'lodash', main: 'index.js'},
    {name: 'moment', main: 'moment.js'}
];
const mapOther = {};
const packagesOther = {};
configOther.forEach((config) => {
    'use strict';
    mapOther[config.name] = `node_modules/${config.name}`;
    packagesOther[config.name] = {main: config.main, defaultExtension: 'js'};
});
System.config({map: mapOther, packages: packagesOther});
