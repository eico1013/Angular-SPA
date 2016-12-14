/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
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

// fuer die Produktion
// import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import AppModule from './app.module';
// Konfiguration des Routings fuer die Komponente "App":
// Bookmarks, Refresh der aktuellen Seite, ...

function isForOfSupported(): boolean {
    'use strict';
    try {
        // tslint:disable-next-line:no-eval
        eval('for (let elem of ["a"]) {}');  // analog zu Java
        console.info(
            'ES 2015 wird zumindest teilweise durch den Webbrowser unterstuetzt.');
    } catch (e) {
        console.error('ES 2015 wird durch den Webbrowser NICHT unterstuetzt.');
        return false;
    }
    return true;
}
isForOfSupported();

// Fuer die Produktion
// enableProdMode();

// dynamisches Bootstrapping, d.h. Just-In-Time Compiler (JIT) aufrufen
platformBrowserDynamic()
    // Start des "Root-Moduls" als Einstiegspunkt in die Webanwendung
    .bootstrapModule(AppModule)
    .then(
        () => window.console.info(
            'Das Bootstrapping fuer Angular ist abgeschlossen'),
        (err: any) => {
            console.warn('Das Bootstrapping fuer Angular ist fehlgeschlagen:');
            console.error(err);
        });
