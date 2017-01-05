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

import {log} from '../../shared';
import {Kunde} from '../shared';

/**
 * Komponente f&uuml;r das Tag <code>my-stammdaten</code>
 */
@Component({
    selector: 'my-details-stammdaten',
    // siehe @Input in der Komponenten-Klasse
    // inputs: ['kunde'],
    template: `
        <table class="table table-striped table-hover table-responsive"
               *ngIf="kunde !== null">
            <tbody>
                <tr>
                    <td><label>Nachname</label></td>
                    <td>{{kunde.nachname}}</td>
                </tr>
                <tr>
                    <td><label>Geburtsdatum</label></td>
                    <td>{{kunde.datumFormatted}}</td>
                </tr>
                <tr>
                    <td><label>E-mail</label></td>
                    <td>{{kunde.email}}</td>
                </tr>
                <tr>
                    <td><label>Homepage</label></td>
                    <td>{{kunde.homepage}}</td>
                </tr>
                <tr>
                    <td><label>Geschlecht</label></td>
                    <td>{{kunde.geschlecht}}</td>
                </tr>
                <tr>
                    <td><label>Newsletter</label></td>
                    <td>
                        <div class="checkbox">
                            <input type="checkbox" checked="{{kunde.newsletter}}"
                                disabled class="checkbox">
                        </div>
                    </td>
                </tr>
                <tr>
                    <td><label>Username</label></td>
                    <td>{{kunde.account.username}}</td>
                </tr>
                <tr>
                    <td><label>Umsatz</label></td>
                    <!-- TODO 2 Nachkommastellen. Pipe "| number: '.2'" -->
                    <td>{{kunde.umsatz.betrag | currency: kunde.umsatz.waehrung: true}}</td>
                </tr>
                <tr>
                    <td><label>Adresse</label></td>
                    <td>
                        {{kunde.adresse.plz}}<br/>
                        {{kunde.adresse.ort}}
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export default class DetailsStammdatenComponent implements OnInit {
    // Property Binding: <my-stammdaten [kunde]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input() kunde: Kunde;

    constructor() {
        console.log('DetailsStammdatenComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        console.log('kunde=', this.kunde);
    }

    toString(): string {
        return 'DetailsStammdatenComponent';
    }
}
