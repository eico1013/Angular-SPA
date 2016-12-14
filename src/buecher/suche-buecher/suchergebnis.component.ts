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

import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {isString, log} from '../../shared';
import {Buch} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-suchergebnis</code>, die wiederum aus
 * den Kindkomponenten f&uuml;r diese Tags besteht:
 * <ul>
 *  <li><code>my-waiting</code>
 *  <li><code>my-gefundene-buecher</code>
 *  <li><code>my-error-message</code>
 * </ul>
 */
@Component({
    selector: 'my-suchergebnis',
    // <my-waiting> und <my-error-message> werden aus dem SharedModul genutzt
    template: `
        <section>
            <my-waiting [activated]="waiting"></my-waiting>
            <my-gefundene-buecher [buecher]="buecher"></my-gefundene-buecher>
            <my-error-message [text]="errorMsg"></my-error-message>
        <section>
    `
})
export default class SuchergebnisComponent implements OnInit {
    // Im ganzen Beispiel: lokale Speicherung des Zustands und nicht durch z.B.
    // eine Flux-Bibliothek, wie z.B. Redux http://redux.js.org

    // Property Binding: <my-such-ergebnis [waiting]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input() waiting: boolean;

    buecher: Array<Buch>|null = null;
    errorMsg: string|null = null;

    constructor(
        private readonly buecherService: BuecherService,
        private readonly router: Router) {
        console.log('SuchergebnisComponent.constructor()');
    }

    // Methode zum "LifeCycle Hook" OnInit: wird direkt nach dem Konstruktor
    // aufgerufen. Entspricht @PostConstruct bei Java EE
    // Weitere Methoden zum Lifecycle: ngAfterViewInit(), ngAfterContentInit()
    // https://angular.io/docs/ts/latest/guide/cheatsheet.html
    // Die Ableitung vom Interface OnInit ist nicht notwendig, aber erleichtet
    // IntelliSense bei der Verwendung von TypeScript.
    @log
    ngOnInit(): void {
        this.observeBuecher();
        this.observeError();
    }

    toString(): string {
        return 'SuchergebnisComponent';
    }

    /**
     * Methode, um den injizierten <code>BuecherService</code> zu beobachten,
     * ob es gefundene bzw. darzustellende B&uuml;cher gibt, die in der
     * Kindkomponente f&uuml;r das Tag <code>gefundene-buecher</code>
     * dargestellt werden. Diese private Methode wird in der Methode
     * <code>ngOnInit</code> aufgerufen.
     */
    private observeBuecher(): void {
        const next: (buecher: Array<Buch>) => void = (buecher) => {
            // zuruecksetzen
            this.waiting = false;
            this.errorMsg = null;

            this.buecher = buecher;
            console.log('SuchErgebnisComponent.buecher:', this.buecher);
        };

        // Funktion als Funktionsargument, d.h. Code als Daten uebergeben
        this.buecherService.observeBuecher(next);
    }

    /**
     * Methode, um den injizierten <code>BuecherService</code> zu beobachten,
     * ob es bei der Suche Fehler gibt, die in der Kindkomponente f&uuml;r das
     * Tag <code>error-message</code> dargestellt werden. Diese private Methode
     * wird in der Methode <code>ngOnInit</code> aufgerufen.
     */
    private observeError(): void {
        const next: (err: string|number) => void = (err) => {
            // zuruecksetzen
            this.waiting = false;
            this.buecher = null;

            if (err === null) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }

            if (isString(err)) {
                this.errorMsg = err as string;
                return;
            }

            switch (err) {
                case 404:
                    this.errorMsg = 'Keine Bücher gefunden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`SuchErgebnisComponent.errorMsg: ${this.errorMsg}`);
        };

        this.buecherService.observeError(next);
    }
}
