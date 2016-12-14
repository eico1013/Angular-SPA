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
// Bereitgestellt durch das RouterModule (s. Re-Export im SharedModule)
import {ActivatedRoute, Params} from '@angular/router';

import {IamService, ROLLE_ADMIN} from '../../iam/iam.service';
import {isString, log} from '../../shared';
import {Buch} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-details-buch</code>
 */
@Component({
    selector: 'my-details-buch',
    template: `
        <my-waiting [activated]="waiting"></my-waiting>

        <div class="breadcrumb">
            <span class="breadcrumb-item">
                <a [routerLink]="'/'">Startseite</a>
            </span>
            <span class="breadcrumb-item">
                <a [routerLink]="'/sucheBuecher'">Suche B&uuml;cher</a>
            </span>
            <span class="breadcrumb-item active">Details</span>
        </div>

        <section class="mt-2" *ngIf="buch !== null">
            <h4>Buch {{buch._id}}:</h4>

            <!-- http://v4-alpha.getbootstrap.com/components/navs/#tabs -->
            <ul class="nav nav-tabs mt-2">
                <li class="nav-item">
                    <a class="nav-link active" href="#stammdaten"
                       data-toggle="tab">
                        Stammdaten
                    </a>
                </li>
                <li class="nav-item" *ngIf="buch.hasSchlagwoerter()">
                    <a class="nav-link" href="#schlagwoerter"
                       data-toggle="tab">
                        Schlagw&ouml;rter
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <div class="mt-1">
                        <my-details-stammdaten [buch]="buch">
                        </my-details-stammdaten>
                    </div>
                </div>
                <div class="tab-pane fade" id="schlagwoerter"
                    *ngIf="buch.hasSchlagwoerter()">
                    <div class="mt-1">
                        <my-details-schlagwoerter [values]="buch.schlagwoerter">
                        </my-details-schlagwoerter>
                    </div>
                </div>
            </div>

            <div>
                <a [routerLink]="['/updateBuch', buch._id]"
                   data-toggle="tooltip" title="Bearbeiten" class="ml-1"
                   *ngIf="isAdmin">
                   <i class="fa fa-2x fa-edit"></i>
                </a>
            </div>
        </section>

        <my-error-message [text]="errorMsg"></my-error-message>
    `
})
export default class DetailsBuchComponent implements OnInit {
    waiting: boolean = false;
    buch: Buch|null = null;
    errorMsg: string|null = null;
    isAdmin: boolean;

    constructor(
        private buecherService: BuecherService, private titleService: Title,
        private route: ActivatedRoute, private iamService: IamService) {
        console.log('DetailsBuchComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Die Beobachtung starten, ob es ein zu darzustellendes Buch oder
        // einen Fehler gibt.
        this.observeBuch();
        this.observeError();

        // Pfad-Parameter aus /detailsBuch/:id
        // Mongo-ID ist ein String
        const next: (params: Params) => void = (params) => {
            console.log(`params= ${params}`);
            this.buecherService.findById(params['id']);
        };
        // ActivatedRoute.params ist ein Observable
        this.route.params.subscribe(next);

        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.isAdmin = this.iamService.isAdmin();
        this.observeIsAdmin();
    }

    toString(): string {
        return 'DetailsBuchComponent';
    }

    private observeBuch(): void {
        const next: (buch: Buch) => void = (buch) => {
            this.waiting = false;
            this.buch = buch;
            console.log('DetailsBuchComponent.buch=', this.buch);

            const titel: string =
                this.buch === null ? 'Details' : `Details ${this.buch._id}`;
            this.titleService.setTitle(titel);
        };
        this.buecherService.observeBuch(next);
    }

    private observeError(): void {
        const next: (err: string|number) => void = (err) => {
            this.waiting = false;
            if (err === undefined) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }

            if (isString(err)) {
                this.errorMsg = err as string;
                return;
            }

            switch (err) {
                case 404:
                    this.errorMsg = 'Kein Buch gefunden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`DetailsBuchComponent.errorMsg: ${this.errorMsg}`);

            this.titleService.setTitle('Fehler');
        };

        this.buecherService.observeError(next);
    }

    private observeIsAdmin(): void {
        const next: (event: Array<string>) => void = (event) => {
            this.isAdmin = event.find(r => r === ROLLE_ADMIN) !== undefined;
            console.log('DetailsBuchComponent.isAdmin:', this.isAdmin);
        };
        this.iamService.observeRollen(next);
    }
}
