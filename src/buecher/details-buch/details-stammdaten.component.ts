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
import {Buch} from '../shared';

/**
 * Komponente f&uuml;r das Tag <code>my-stammdaten</code>
 */
@Component({
    selector: 'my-details-stammdaten',
    // siehe @Input in der Komponenten-Klasse
    // inputs: ['buch'],
    template: `
        <table class="table table-striped table-hover table-responsive"
               *ngIf="buch !== null">
            <tbody>
                <tr>
                    <td><label>Titel</label></td>
                    <td>{{buch.titel}}</td>
                </tr>
                <tr>
                    <td><label>Bewertung</label></td>
                    <td>
                        <span *ngFor="let r of buch.ratingArray">
                            <i class="fa fa-star" style="color: yellow;"
                               *ngIf="r === true"></i>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Art</label></td>
                    <td>
                        <span [ngSwitch]="buch.art">
                            <span *ngSwitchCase="'DRUCKAUSGABE'">Druckausgabe</span>
                            <span *ngSwitchCase="'KINDLE'">Kindle</span>
                            <span *ngSwitchDefault>unbekannt</span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Verlag</label></td>
                    <td>
                        <span [ngSwitch]="buch.verlag">
                            <span *ngSwitchCase="'IWI_VERLAG'">Iwi Verlag</span>
                            <span *ngSwitchCase="'HSKA_VERLAG'">Hska Verlag</span>
                            <span *ngSwitchDefault>unbekannt</span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Datum</label></td>
                    <td>
                        {{buch.datumFormatted}}<br/>
                        {{buch.datumFromNow}}
                    </td>
                </tr>
                <tr>
                    <td><label>Preis</label></td>
                    <!-- TODO 2 Nachkommastellen. Pipe "| number: '.2'" -->
                    <td>{{buch.preis | currency: 'EUR': true}}</td>
                </tr>
                <tr>
                    <td><label>Rabatt</label></td>
                    <!-- {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits} -->
                    <!-- default: 1.0-3 -->
                    <!-- siehe number_pipe.ts -->
                    <td>{{buch.rabatt | percent: '.2'}}</td>
                </tr>
                <tr>
                    <td><label>Email</label></td>
                    <td>{{buch.email}}</td>
                </tr>
                <tr>
                    <td><label>Lieferbar?</label></td>
                    <td>
                        <div class="checkbox">
                            <input type="checkbox" checked="{{buch.lieferbar}}"
                                disabled class="checkbox">
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `
})
export default class DetailsStammdatenComponent implements OnInit {
    // Property Binding: <my-stammdaten [buch]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input() buch: Buch;

    constructor() {
        console.log('DetailsStammdatenComponent.constructor()');
    }

    @log
    ngOnInit(): void {
        console.log('buch=', this.buch);
    }

    toString(): string {
        return 'DetailsStammdatenComponent';
    }
}
