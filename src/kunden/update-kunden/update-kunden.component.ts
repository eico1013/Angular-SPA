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
import {Kunde} from '../shared';
import {KundenService} from '../shared/kunden.service';

/**
 * Komponente f&uuml;r das Tag <code>my-update-kunde</code> mit Kindkomponenten
 * f&uuml;r die folgenden Tags:
 * <ul>
 *  <li> <code>my-stammdaten</code>
 *  <li> <code>my-schlagwoerter</code>
 * </ul>
 */
@Component({
    selector: 'my-update-kunde',
    template: `
        <section *ngIf="kunde !== null">
            <h4>Kunde {{kunde._id}}:</h4>

            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten"
                       data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
                <li class="nav-item" *ngIf="kunde.schlagwoerter.length !== 0">
                    <a class="nav-link" href="#schlagwoerter"
                       data-toggle="tab">
                        Schlagw&ouml;rter
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <div class="mt-1">
                        <my-update-stammdaten [kunde]="kunde">
                        </my-update-stammdaten>
                    </div>
                </div>
                <div class="tab-pane fade" id="schlagwoerter">
                    <div class="mt-1">
                        <my-update-schlagwoerter [kunde]="kunde">
                        </my-update-schlagwoerter>
                    </div>
                </div>
            </div>
        </section>

        <my-error-message [text]="errorMsg"></my-error-message>
    `
})
export default class UpdateKundeComponent implements OnInit {
    kunde: Kunde|null = null;
    errorMsg: string|null = null;

    constructor(
        private readonly kundenService: KundenService,
        private readonly titleService: Title,
        private readonly route: ActivatedRoute) {
        console.log('UpdateKundeComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Die Beobachtung starten, ob es ein zu aktualisierendes Buch oder
        // einen Fehler gibt.
        this.observeKunde();
        this.observeError();

        // Pfad-Parameter aus /updateBuch/:id
        const next: (params: Params) => void = (params) => {
            console.log(`params= ${params}`);
            this.kundenService.findById(params['id']);
        };

        // ActivatedRoute.params is an Observable
        this.route.params.subscribe(next);
        this.titleService.setTitle('Aktualisieren');
    }

    toString(): string {
        return 'UpdateKundeComponent';
    }

    /**
     * Beobachten, ob es ein zu aktualisierendes Buch gibt.
     */
    private observeKunde(): void {
        const next: (kunde: Kunde) => void = (kunde) => {
            this.errorMsg = null;
            this.kunde = kunde;
            console.log('UpdateKundeComponent.buch=', this.kunde);
        };

        this.kundenService.observeKunde(next);
    }

    /**
     * Beobachten, ob es einen Fehler gibt.
     */
    private observeError(): void {
        const next: (err: string|number) => void = (err) => {
            this.kunde = null;

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
                    this.errorMsg = 'Kein Kunde vorhanden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`UpdateKundeComponent.errorMsg: ${this.errorMsg}`);
        };

        this.kundenService.observeError(next);
    }
}
