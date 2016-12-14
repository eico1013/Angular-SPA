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

/* eslint-enable quotes: [2, "single"] */

export const host = '127.0.0.1';
export const portWebServer = 443;

export const srcDir = 'src';
export const distDir = 'dist';

export const dir = {
    layout: `${srcDir}/layout`,
    layoutDist: `${distDir}/layout`,
    img: `${srcDir}/img`,
    css: `${distDir}/css`,
    fonts: `${distDir}/fonts`,
    imgDist: `${distDir}/img`,
    js: `${distDir}/js`,
    tmp: 'tmp',
    nginx: `C:/Zimmermann/nginx`,
    webserverConfig: `config/webserver`,

    baseWeb: distDir
};

export const dateien = {
    ts: `${srcDir}/**/*.ts`,
    html: `${srcDir}/**/*.html`,
    ico: `${srcDir}/*.ico`,
    sassLayout: `${dir.layout}/*.scss`,
    minCssLayout: `${dir.layoutDist}/*.min.css*`,
    img: `${dir.img}/*`,
    js: [
        'node_modules/zone.js/dist/zone.js',
        // 'node_modules/zone.js/dist/zone.min.js',
        'node_modules/zone.js/dist/long-stack-trace-zone.js',
        'node_modules/reflect-metadata/Reflect.js*',
        'node_modules/systemjs/dist/system.js*',
        // 'node_modules/systemjs/dist/system.src.js',

        'node_modules/chart.js/dist/Chart.bundle.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery/dist/jquery.min.map',
        'node_modules/tether/dist/js/tether.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ],
    css: [
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css.map',
        'node_modules/font-awesome/css/font-awesome.min.css',
        'node_modules/font-awesome/css/font-awesome.css.map'
    ],
    fonts: [
        'node_modules/font-awesome/fonts/*'
    ],
    bundle: `${dir.js}/bundle.js`
};

export const minifiedBundle = false;
