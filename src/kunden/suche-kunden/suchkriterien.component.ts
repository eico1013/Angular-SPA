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

import {Component, EventEmitter, Output} from '@angular/core';

import {log} from '../../shared';
import {KundenService} from '../shared/kunden.service';

// declare type Verlag = 'IWI_VERLAG' | 'HSKA_VERLAG';
// declare type BuchArt = 'KINDLE' | 'DRUCKAUSGABE';

/**
 * Komponente f&uuml;r das Tag <code>my-suchkriterien</code>
 */
@Component({
    selector: 'my-suchkriterien',
    template: `
        <div class="card">
            <div class="card-header bg-primary">
                <h4><i class="fa fa-search"></i> Eingabe der Suchkriterien</h4>
            </div>
            <div class="card-block">
                <!-- Bootstrap 4:
                        xs:      -  480px ("extra small")
                        sm:      -  767px ("small")
                        md:  768 -  991px ("medium")
                        lg:  992 - 1199px ("large")
                        xl: 1200 px       ("extra large")
                    CSS-Klassen von Bootstrap:
                        card-..., form-..., row, btn, bg-primary, ...
                        http://v4-alpha.getbootstrap.com/components/forms
                -->

                <!-- Formulare zur Interaktion mit dem Endbenutzer:
                        * Daten werden modifiziert, z.B. in Suchfelder
                          oder Erfassungs-/Aenderungsformularen
                        * Aenderungen wirken sich auf Teile der Seite aus:
                          Ergebnisse/Fehler anzeigen, Navigationsmoeglichkeiten
                        * Eingaben werden validiert

                     Template-Syntax:
                     (submit)="find()"   fuer Output = Event Binding
                                         d.h. Ereignis submit an find() anbinden
                                         oder on-submit="find"
                     Definition von Attributnamen gemaess HTML: Attribute names
                     must consist of one or more characters other than the
                     space characters, U+0000 NULL, """, "'", ">", "/", "=",
                     the control characters, and any characters that are not
                     defined by Unicode.

                     Das FormsModule (s. Re-Export in SharedModule) stellt
                     ngModel bereit.
                -->

                <form (submit)="onFind()" role="form">
                    <div class="form-group row">
                        <label for="nachnameInput"
                               class="col-sm-2 form-control-label">Nachname</label>
                        <div class="col-sm-10">
                            <!-- type="search" funktioniert nicht mit Bootstrap -->
                            <input id="nachnameInput"
                                placeholder="Den Nachnamen oder einen Teil davon eingeben"
                                class="form-control"
                                [(ngModel)]="nachname" name="nachname">
                        </div>
                    </div>

<!--                    <div class="form-group row">
                        <label class="col-sm-2 form-control-label">Verlag</label>
                        <div class="col-sm-10">
                            <select class="form-control"
                                    [(ngModel)]="verlag" name="verlag">
                                <option value=""></option>
                                <option value="IWI_VERLAG">Iwi Verlag</option>
                                <option value="HSKA_VERLAG">Hska Verlag</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="col-sm-2 form-control-label">Art</label>
                        <div class="col-sm-10">
                            <div class="radio">
                                <label class="radio-inline">
                                    <input type="radio" [(ngModel)]="art"
                                           name="art" value="DRUCKAUSGABE">
                                        Druckausgabe
                                </label>
                            </div>
                            <div class="radio">
                                <label class="radio-inline">
                                    <input type="radio" [(ngModel)]="art"
                                           name="art" value="KINDLE"> Kindle
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label for="schlagwoerterInput"
                               class="col-sm-2 form-control-label">
                            Schlagw&ouml;rter
                        </label>
                        <div class="col-sm-10">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox"
                                           [(ngModel)]="javascript"
                                           name="javascript"/>
                                    JavaScript
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox"
                                           [(ngModel)]="typescript"
                                           name="typescript"/>
                                    TypeScript
                                </label>
                            </div>
                        </div>
                    </div> -->

                    <div class="form-group row">
                        <div class="offset-sm-2 col-sm-10">
                            <i class="fa fa-info-circle"></i>
                            Hinweis: Keine Eingabe liefert alle Kunden.
                        </div>
                    </div> 

                    <div class="form-group row">
                        <div class="offset-sm-2 col-sm-10">
                            <button class="btn btn-primary">
                                <i class="fa fa-search"></i>
                                <!-- margin left -->
                                <span class="ml-1">Suchen</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
})
export default class SuchkriterienComponent {
    nachname: string|null = null;
    // verlag: Verlag|null = null;
    // art: BuchArt|null = null;
    // javascript: boolean = false;
    // typescript: boolean = false;

    // Event Binding: <my-suchkriterien (waiting)="...">
    // Observables = Event-Streaming mit Promises
    @Output() waiting: EventEmitter<boolean> = new EventEmitter<boolean>();

    // Empfehlung: Konstruktor nur fuer DI
    constructor(private readonly kundenService: KundenService) {
        console.log('SuchkriterienComponent.constructor()');
    }

    /**
     * Suche nach Kunden, die den spezfizierten Suchkriterien entsprechen
     * @param suchkriterien: Suchkriterien vom Typ IBuchForm
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    onFind(): boolean {
        const suchkriterien: any = {
            nachname: this.nachname
            // verlag: this.verlag,
            // art: this.art,
            // javascript: this.javascript,
            // typescript: this.typescript
        };
        console.log('suchkriterien=', suchkriterien);

        // Observables = Event-Streaming mit Promises
        this.waiting.emit(true);
        this.kundenService.find(suchkriterien);

        // Inspektion der Komponente mit dem Tag-Namen "app" im Debugger
        // Voraussetzung: globale Variable ng deklarieren (s.o.)
        // const app: any = document.querySelector('app');
        // global.ng.probe(app);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite.
        return false;
    }

    toString(): String {
        return 'SuchkriterienComponent';
    }
}
