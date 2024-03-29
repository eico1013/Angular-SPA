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
import {animate, Component, Input, state, style, transition, trigger} from
'@angular/core';
// Bereitgestellt durch das RouterModule (s. Re-Export im SharedModule)
import {Router} from '@angular/router';

// import {DETAILS_BUCH_PATH} from '../../app/root.routes';
import {DETAILS_KUNDE_PATH} from '../../app/root.routes';
import {isPresent, log} from '../../shared';
import {Kunde} from '../shared';
import {KundenService} from '../shared/kunden.service';

/**
 * Komponente f&uuml;r das Tag <code>my-gefundene-kunden</code>
 */
@Component({
    selector: 'my-gefundene-kunden',
    template: `
        <!-- Template Binding durch die Direktive ngIf -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div class="card" *ngIf="kunden !== null">
            <div class="card-header">
                <h4><i class="fa fa-folder-open-o"></i> Gefundene
                Kunden</h4>
            </div>
            <div class="card-block">
                <table class="table table-striped table-hover
                table-responsive"
                       [@tableIn]="'in'">
                    <thead class="thead-default">
                        <th>Nr.</th>
                        <th>ID</th>
                        <th>Nachname</th>
                  <!--      <th>Verlag</th> -->
                        <th>Interessen</th> 
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
                        <tr *ngFor="let k of kunden; let i = index"
                            (click)="onSelect(k)" [@rowOut]="'in'">
                            <td>{{i + 1}}</td>
                            <td>{{k._id}}</td>
                            <td>{{k.nachname}}</td>
          <!--                  <td>
                                <span [ngSwitch]="b.verlag">
                                    <span *ngSwitchCase="'IWI_VERLAG'">
                                        Iwi Verlag
                                    </span>
                                    <span *ngSwitchCase="'HSKA_VERLAG'">
                                        Hska Verlag
                                    </span>
                                    <span *ngSwitchDefault>unbekannt</span>
                                </span>
                            </td> -->
                            <td>
                                <span *ngFor="let sw of k.interessen">
                                    <span [ngSwitch]="sw">
                                        <span *ngSwitchCase="'S'">
                                            S<br>
                                        </span>
                                        <span *ngSwitchCase="'L'">
                                            L
                                        </span>
                                        <span *ngSwitchCase="'R'">
                                            R
                                        </span>
                                    </span>
                                </span>
                            </td>                               
                            <td>
                                <!-- Pfad detailsKunden/:id, in root.router.ts
                                -->
                                <!-- modaler Dialog als Alternative: -->
                                <!--
                                http://v4-alpha.getbootstrap.com/components/modal
                                -->
                                <a [routerLink]="['/detailsKunde', k._id]"
                                   data-toggle="tooltip"
                                   title="Details anzeigen">
                                    <i class="fa fa-search-plus"></i>
                                </a>
                            </td>
                            <td>
                                <a (click)="onRemove(k)"
                                data-toggle="tooltip"
                                   title="Entfernen">
                                    <i class="fa fa-remove"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="card-footer">
                <div [ngPlural]="kunden.length">
                    <!-- zu vergleichender Ausdruck -->
                    <template ngPluralCase="=0">
                        <i class="fa fa-info-circle"></i> Es gibt keinen Kunden
                    </template>
                    <template ngPluralCase="=1">
                        <i class="fa fa-info-circle"></i> Es gibt einen Kunden
                    </template>
                    <template ngPluralCase="other">
                        <i class="fa fa-info-circle"></i>
                        Es gibt {{kunden.length}} Kunden
                    </template>
                </div>

                <i class="fa fa-info-circle"></i>
                Zur Anzeige der JSON-Datens&auml;tze in
                gefundene-kunden.component.ts den Kommentar beim Tag
                &lt;pre&gt; entfernen
            </div>
        </div>

        <!-- Ausgabe des JSON-Datensatzes im Webbrowser statt
        console.log(...) -->
        <!--
        <pre *ngIf="kunden !== null">{{kunden | json}}</pre>
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
export default class GefundeneKundenComponent {
    // Property Binding: <my-gefundene-buecher [buecher]="...">
    // Decorator fuer ein Attribut. Siehe InputMetadata
    @Input() kunden: Array<Kunde>|null = null;

    constructor(
        private readonly kundenService: KundenService,
        private readonly router: Router) {
        console.log('GefundeneKundenComponent.constructor()');
    }

    /**
     * Der ausgew&auml;hlte bzw. angeklickte Kunde in der Detailsseite
     * anzeigen.
     * @param kunde Der ausgew&auml;hlte Kunde
     */
    @log
    onSelect(kunde: Kunde): void {
        const path: string = `/${DETAILS_KUNDE_PATH}/${kunde._id}`;
        console.log(`path=${path}`);
        this.router.navigate([path]);
    }

    /**
     * Das ausgew&auml;hlte bzw. angeklickte Kunde l&ouml;schen.
     * @param kunde Das ausgew&auml;hlte Kunde
     */
    @log
    onRemove(kunde: Kunde): void {
        const errorFn: (status: number) => void = (status: number) => {
            console.error(`Fehler beim Loeschen: status=${status}`);
        };
        this.kundenService.remove(kunde, undefined as any, errorFn);
        if (isPresent(this.kunden)) {
            const tmp: Array<Kunde> = this.kunden as Array<Kunde>;
            this.kunden = tmp.filter((k: Kunde) => k._id !== kunde._id);
        }
    }

    toString(): String {
        return 'GefundeneKundenComponent';
    }
}

class AnzahlLocalization extends NgLocalization {
    public getPluralCategory(count: number): string {
        return count === 1 ? 'single' : 'multi';
    }
}
