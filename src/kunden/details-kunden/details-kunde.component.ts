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
import {Kunde} from '../shared';
import {KundenService} from '../shared/kunden.service';

/**
 * Komponente f&uuml;r das Tag <code>my-details-buch</code>
 */
@Component({
    selector: 'my-details-kunden',
    template: `
        <my-waiting [activated]="waiting"></my-waiting>

        <div class="breadcrumb">
            <span class="breadcrumb-item">
                <a [routerLink]="'/'">Startseite</a>
            </span>
            <span class="breadcrumb-item">
                <a [routerLink]="'/sucheKunden'">Suche Kunden</a>
            </span>
            <span class="breadcrumb-item active">Details</span>
        </div>

        <section class="mt-2" *ngIf="kunde !== null">
            <h4>Kunde {{kunde._id}}:</h4>

            <!-- http://v4-alpha.getbootstrap.com/components/navs/#tabs -->
            <ul class="nav nav-tabs mt-2">
                <--! <li class="nav-item">
                    <a class="nav-link active" href="#interessen"
                       data-toggle="tab">
                        Interessen
                    </a>
                </li> -->
                <li class="nav-item" *ngIf="buch.hasInteressen()">
                    <a class="nav-link" href="#interessen"
                       data-toggle="tab">
                        Interessen
                    </a>
                </li>
            </ul>

            <div class="tab-content">
                <--! <div class="tab-pane fade in active" id="interessen">
                    <div class="mt-1">
                       
                    </div>
                </div> -->
                <div class="tab-pane fade" id="interessen"
                    *ngIf="buch.hasInteressen()">
                    <div class="mt-1">
                        <my-details-interessen [values]="kunde.interessen">
                        </my-details-interessen>
                    </div>
                </div>
            </div>

            <div>
                <a [routerLink]="['/updateKunde', kunde._id]"
                   data-toggle="tooltip" title="Bearbeiten" class="ml-1"
                   *ngIf="isAdmin">
                   <i class="fa fa-2x fa-edit"></i>
                </a>
            </div> 
        </section>

        <my-error-message [text]="errorMsg"></my-error-message>
    `
})
export default class DetailsKundeComponent implements OnInit {
    waiting: boolean = false;
    kunde: Kunde|null = null;
    errorMsg: string|null = null;
    isAdmin: boolean;

    constructor(
        private kundenService: KundenService, private titleService: Title,
        private route: ActivatedRoute, private iamService: IamService) {
        console.log('DetailsKundeComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        // Die Beobachtung starten, ob es ein zu darzustellendes Buch oder
        // einen Fehler gibt.
        this.observeKunde();
        this.observeError();

        // Pfad-Parameter aus /detailsBuch/:id
        // Mongo-ID ist ein String
        const next: (params: Params) => void = (params) => {
            console.log(`params= ${params}`);
            this.kundenService.findById(params['id']);
        };
        // ActivatedRoute.params ist ein Observable
        this.route.params.subscribe(next);

        // Initialisierung, falls zwischenzeitlich der Browser geschlossen wurde
        this.isAdmin = this.iamService.isAdmin();
        this.observeIsAdmin();
    }

    toString(): string {
        return 'DetailsKundeComponent';
    }

    private observeKunde(): void {
        const next: (kunde: Kunde) => void = (kunde) => {
            this.waiting = false;
            this.kunde = kunde;
            console.log('DetailsKundeComponent.buch=', this.kunde);

            const titel: string =
                this.kunde === null ? 'Details' : `Details ${this.kunde._id}`;
            this.titleService.setTitle(titel);
        };
        this.kundenService.observeKunde(next);
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
                    this.errorMsg = 'Kein Kunde gefunden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`DetailsBuchComponent.errorMsg: ${this.errorMsg}`);

            this.titleService.setTitle('Fehler');
        };

        this.kundenService.observeError(next);
    }

    private observeIsAdmin(): void {
        const next: (event: Array<string>) => void = (event) => {
            this.isAdmin = event.find(r => r === ROLLE_ADMIN) !== undefined;
            console.log('DetailsKundeComponent.isAdmin:', this.isAdmin);
        };
        this.iamService.observeRollen(next);
    }
}
