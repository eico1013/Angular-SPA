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

import {NgLocalization} from '@angular/common';
import {animate, Component, Input, state, style, transition, trigger} from '@angular/core';
// Bereitgestellt durch das RouterModule (s. Re-Export im SharedModule)
import {Router} from '@angular/router';

import {DETAILS_BUCH_PATH} from '../../app/root.routes';
import {isPresent, log} from '../../shared';
import {Buch} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-gefundene-buecher</code>
 */
@Component({
    selector: 'my-gefundene-buecher',
    template: `
        <!-- Template Binding durch die Direktive ngIf -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div class="card" *ngIf="buecher !== null">
            <div class="card-header">
                <h4><i class="fa fa-folder-open-o"></i> Gefundene B&uuml;cher</h4>
            </div>
            <div class="card-block">
                <table class="table table-striped table-hover table-responsive"
                       [@tableIn]="'in'">
                    <thead class="thead-default">
                        <th>Nr.</th>
                        <th>ID</th>
                        <th>Titel</th>
                        <th>Verlag</th>
                        <th>Schlagw&ouml;rter</th>
                        <th>
                            <span class="sr-only">
                                Spalte f&uuml;r Details
                            </span>
                        </th>
                        <th>
                            <span class="sr-only">
                                Spalte f&uuml;r Entfernen
                            </span>
                        </th>
                    </thead>
                    <tbody>
                        <!-- Template Binding: ngFor -->
                        <!-- Event-Binding: statt (click) auch on-click -->
                        <!-- Animation flyInOut siehe unten -->
                        <tr *ngFor="let b of buecher; let i = index"
                            (click)="onSelect(b)" [@rowOut]="'in'">
                            <td>{{i + 1}}</td>
                            <td>{{b._id}}</td>
                            <td>{{b.titel}}</td>
                            <td>
                                <span [ngSwitch]="b.verlag">
                                    <span *ngSwitchCase="'IWI_VERLAG'">
                                        Iwi Verlag
                                    </span>
                                    <span *ngSwitchCase="'HSKA_VERLAG'">
                                        Hska Verlag
                                    </span>
                                    <span *ngSwitchDefault>unbekannt</span>
                                </span>
                            </td>
                            <td>
                                <span *ngFor="let sw of b.schlagwoerter">
                                    <span [ngSwitch]="sw">
                                        <span *ngSwitchCase="'JAVASCRIPT'">
                                            JavaScript<br>
                                        </span>
                                        <span *ngSwitchCase="'TYPESCRIPT'">
                                            TypeScript
                                        </span>
                                    </span>
                                </span>
                            </td>
                            <td>
                                <!-- Pfad detailsBuch/:id, in root.router.ts -->
                                <!-- modaler Dialog als Alternative: -->
                                <!-- http://v4-alpha.getbootstrap.com/components/modal -->
                                <a [routerLink]="['/detailsBuch', b._id]"
                                   data-toggle="tooltip"
                                   title="Details anzeigen">
                                    <i class="fa fa-search-plus"></i>
                                </a>
                            </td>
                            <td>
                                <a (click)="onRemove(b)" data-toggle="tooltip"
                                   title="Entfernen">
                                    <i class="fa fa-remove"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer">
                <div [ngPlural]="buecher.length">
                    <!-- zu vergleichender Ausdruck -->
                    <template ngPluralCase="=0">
                        <i class="fa fa-info-circle"></i> Es gibt kein Buch
                    </template>
                    <template ngPluralCase="=1">
                        <i class="fa fa-info-circle"></i> Es gibt ein Buch
                    </template>
                    <template ngPluralCase="other">
                        <i class="fa fa-info-circle"></i>
                        Es gibt {{buecher.length}} B&uuml;cher
                    </template>
                </div>

                <i class="fa fa-info-circle"></i>
                Zur Anzeige der JSON-Datens&auml;tze in
                gefundene-buecher.component.ts den Kommentar beim Tag
                &lt;pre&gt; entfernen
            </div>
        </div>

        <!-- Ausgabe des JSON-Datensatzes im Webbrowser statt console.log(...) -->
        <!--
        <pre *ngIf="buecher !== null">{{buecher | json}}</pre>
        -->
    `,
    // https://angular.io/docs/ts/latest/guide/animations.html
    // auf der Basis von des "Web Animations API"
    // alternativ gibt es noch: CSS Transitions und CSS Keyframes
    animations: [
        trigger(
            'tableIn',
            [
              state('in', style({transform: 'translateX(0)'})),
              // Enter, d.h. vom Zustand void kommend
              transition(
                  'void => *',
                  [
                    // von ganz links und zunaechst unsichtbar
                    // https://www.w3.org/TR/css3-transitions/#animatable-properties
                    style({transform: 'translateX(-100%)', opacity: 0}),
                    // Dauer 500ms
                    // http://easings.net Daten kommen zunaechst langsam herein
                    animate('500ms ease-in')
                  ])
            ]),
        trigger(
            'rowOut',
            [
              state('in', style({transform: 'translateX(0)'})),
              // Leave, d.h. Uebergang in den Zustand void
              transition(
                  '* => void', [animate('500ms ease-out', style({
                                            // nach ganz rechts
                                            transform: 'translateX(100%)',
                                            opacity: 0
                                        }))])
            ])
    ]
})
export default class GefundeneBuecherComponent {
    // Property Binding: <my-gefundene-buecher [buecher]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input() buecher: Array<Buch>|null = null;

    constructor(
        private readonly buecherService: BuecherService,
        private readonly router: Router) {
        console.log('GefundeneBuecherComponent.constructor()');
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Buch in der Detailsseite anzeigen.
     * @param buch Das ausgew&auml;hlte Buch
     */
    @log
    onSelect(buch: Buch): void {
        const path: string = `/${DETAILS_BUCH_PATH}/${buch._id}`;
        console.log(`path=${path}`);
        this.router.navigate([path]);
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Buch l&ouml;schen.
     * @param buch Das ausgew&auml;hlte Buch
     */
    @log
    onRemove(buch: Buch): void {
        const errorFn: (status: number) => void = (status: number) => {
            console.error(`Fehler beim Loeschen: status=${status}`);
        };
        this.buecherService.remove(buch, undefined as any, errorFn);
        if (isPresent(this.buecher)) {
            const tmp: Array<Buch> = this.buecher as Array<Buch>;
            this.buecher = tmp.filter((b: Buch) => b._id !== buch._id);
        }
    }

    toString(): String {
        return 'GefundeneBuecherComponent';
    }
}

class AnzahlLocalization extends NgLocalization {
    public getPluralCategory(count: number): string {
        return count === 1 ? 'single' : 'multi';
    }
}
