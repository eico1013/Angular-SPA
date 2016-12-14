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

import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params} from '@angular/router';

import {isString, log} from '../../shared';
import {Buch} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-update-buch</code> mit Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>my-stammdaten</code>
 *  <li> <code>my-schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'my-update-buch',
    template: `
        <section *ngIf="buch !== null">
            <h4>Buch {{buch._id}}:</h4>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten"
                       data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
                <li class="nav-item" *ngIf="buch.schlagwoerter.length !== 0">
                    <a class="nav-link" href="#schlagwoerter"
                       data-toggle="tab">
                        Schlagw&ouml;rter
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <div class="mt-1">
                        <my-update-stammdaten [buch]="buch">
                        </my-update-stammdaten>
                    </div>
                </div>
                <div class="tab-pane fade" id="schlagwoerter">
                    <div class="mt-1">
                        <my-update-schlagwoerter [buch]="buch">
                        </my-update-schlagwoerter>
                    </div>
                </div>
            </div>
        </section>

        <my-error-message [text]="errorMsg"></my-error-message>
    `
})
export default class UpdateBuchComponent implements OnInit {
    buch: Buch|null = null;
    errorMsg: string|null = null;

    constructor(
        private readonly buecherService: BuecherService,
        private readonly titleService: Title,
        private readonly route: ActivatedRoute) {
        console.log('UpdateBuchComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Die Beobachtung starten, ob es ein zu aktualisierendes Buch oder
        // einen Fehler gibt.
        this.observeBuch();
        this.observeError();

        // Pfad-Parameter aus /updateBuch/:id
        const next: (params: Params) => void = (params) => {
            console.log(`params= ${params}`);
            this.buecherService.findById(params['id']);
        };

        // ActivatedRoute.params is an Observable
        this.route.params.subscribe(next);
        this.titleService.setTitle('Aktualisieren');
    }

    toString(): string {
        return 'UpdateBuchComponent';
    }

    /**
     * Beobachten, ob es ein zu aktualisierendes Buch gibt.
     */
    private observeBuch(): void {
        const next: (buch: Buch) => void = (buch) => {
            this.errorMsg = null;
            this.buch = buch;
            console.log('UpdateBuch.buch=', this.buch);
        };

        this.buecherService.observeBuch(next);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private observeError(): void {
        const next: (err: string|number) => void = (err) => {
            this.buch = null;

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
                    this.errorMsg = 'Kein Buch vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateBuchComponent.errorMsg: ${this.errorMsg}`);
        };

        this.buecherService.observeError(next);
    }
}
