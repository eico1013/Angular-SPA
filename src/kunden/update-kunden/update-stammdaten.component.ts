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
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {HOME_PATH} from '../../app/root.routes';
import {isBlank, log} from '../../shared';
import {Kunde, KundeValidator} from '../shared';
import {KundenService} from '../shared/kunden.service';

/**
 * Komponente f&uuml;r das Tag <code>my-stammdaten</code>
 */
@Component({
    selector: 'my-update-stammdaten',
    template: `
        <form [formGroup]="form" role="form">
            <div class="form-group row"
                 [class.has-danger]="!nachname.valid && nachname.touched">
                <label for="nachnameInput" class="col-sm-2 form-control-label">
                    Nachname *
                </label>
                <div class="col-sm-10">
                    <input id="nachnameInput"
                        placeholder="Nachname"
                        class="form-control form-control-danger"
                        autofocus
                        type="text"
                        formControlName="nachname">
                    <div class="fa fa-exclamation-circle form-control-feedback"
                        *ngIf="!nachname.valid && nachname.touched">
                        Ein Name muss mit einem Buchstaben beginnen.
                    </div>
                </div>
            </div>

            <div class="form-group row"
                 [class.has-danger]="!homepage.valid && homepage.touched">
                <label for="homepageInput" class="col-sm-2 form-control-label">
                    Homepage
                </label>
                <div class="col-sm-10">
                    <input id="homepageInput"
                        placeholder="Ihre Webseite"
                        class="form-control form-control-danger"
                        autofocus
                        type="text"
                        formControlName="homepage">
                    <div class="fa fa-exclamation-circle form-control-feedback"
                        *ngIf="!homepage.valid && homepage.touched">
                        Ein Name muss mit einem Buchstaben beginnen.
                    </div>
                </div>
            </div>

            <div class="form-group row"
                 [class.has-danger]="!email.valid && email.touched">
                <label for="emailInput" class="col-sm-2 form-control-label">
                    Email *
                </label>
                <div class="col-sm-10">
                    <input id="emailInput"
                        placeholder="max@beispiel.de"
                        class="form-control form-control-danger"
                        autofocus
                        type="text"
                        formControlName="email">
                    <div class="fa fa-exclamation-circle form-control-feedback"
                        *ngIf="!email.valid && email.touched">
                        Email muss eingegeben werden
                    </div>
                </div>
            </div>

            <!--
            <div class="form-group row"
                 [class.has-danger]="!adresse.valid && adresse.touched">
                <label for="adresseInput" class="col-sm-2 form-control-label">
                    Adresse *
                </label>
                <div class="col-sm-10">
                    <input id="adresseInput"
                        placeholder="Adresse"
                        class="form-control form-control-danger"
                        autofocus
                        type="text"
                        formControlName="adresse">
                    <div class="fa fa-exclamation-circle form-control-feedback"
                        *ngIf="!adresse.valid && adresse.touched">
                        Eine Adresse muss eingegeben werden
                    </div>
                </div>
            </div>




            
            <div class="form-group row">
                <label class="col-sm-2 form-control-label">Art *</label>
                <div class="col-sm-10">
                    <select class="form-control" formControlName="art">
                        <option value="DRUCKAUSGABE">Druckausgabe</option>
                        <option value="KINDLE">Kindle</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label class="col-sm-2 form-control-label">Verlag</label>
                <div class="col-sm-10">
                    <select class="form-control" formControlName="verlag">
                        <option value="IWI_VERLAG">Iwi Verlag</option>
                        <option value="HSKA_VERLAG">Hska Verlag</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="ratingInput" class="col-sm-2 form-control-label">
                    Bewertung
                </label>
                <div class="col-sm-10">
                    <input id="ratingInput" type="range" min="0" max="5"
                        formControlName="rating">
                </div>
            </div>

            
            <div class="form-group row">
                <label for="datumInput" class="col-sm-2 form-control-label">
                    Datum
                </label>
                <div class="col-sm-10">
                    <input id="datumInput"
                        class="form-control"
                        type="date"
                        formControlName="datum"/>
                </div>
            </div>
            -->

            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <button class="btn btn-primary" (click)="onUpdate()"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i>
                        <span class="ml-1">Stammdaten aktualisieren</span>
                    </button>
                </div>
            </div>

        </form>
    `
})
export default class UpdateStammdatenComponent implements OnInit {
    // <stammdaten [buch]="...">
    @Input() kunde: Kunde;

    form: FormGroup;
    nachname: FormControl;
    email: FormControl;
    homepage: FormControl;
    // adresse: FormControl;
    // datum: Control;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly kundenService: KundenService,
        private readonly router: Router) {
        console.log('UpdateStammdatenComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Buchs vorbelegen.
     */
    @log
    ngOnInit(): void {
        console.log('kunde=', this.kunde);

        // Definition und Vorbelegung der Eingabedaten
        this.nachname = new FormControl(
            this.kunde.nachname,
            [Validators.required as any, KundeValidator.nachname]);
        this.email = new FormControl(this.kunde.email, Validators.required);
        this.homepage = new FormControl(this.kunde.homepage);
        // this.adresse = new FormControl(this.kunde.adresse);
        // this.datum = new Control(this.buch.datum.toISOString());

        this.form = this.formBuilder.group({
            // siehe formControlName innerhalb von @Component({template: ...})
            nachname: this.nachname,
            email: this.email,
            homepage: this.homepage,
            // adresse: this.adresse
            // datum: this.datum
        });
    }

    /**
     * Die aktuellen Stammdaten f&uuml;r das angezeigte Buch-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    onUpdate(): boolean|undefined {
        if (this.form.pristine) {
            console.log('keine Aenderungen');
            return;
        }

        if (isBlank(this.kunde)) {
            console.error('buch === undefined/null');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.kunde.updateStammdaten(
            this.nachname.value, this.email.value, this.homepage.value);
        console.log('kunde=', this.kunde);
        console.log('Ausgabe1A');
        const successFn: () => void = () => {
            console.log(`UpdateStammdaten: successFn: path: ${HOME_PATH}`);
            this.router.navigate([HOME_PATH]);
        };
        const errorFn: any = undefined;
        this.kundenService.update(this.kunde, successFn, errorFn);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String {
        return 'UpdateStammdatenComponent';
    }
}
