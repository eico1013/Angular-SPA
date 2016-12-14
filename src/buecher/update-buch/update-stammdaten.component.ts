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
import {Buch, BuchValidator} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-stammdaten</code>
 */
@Component({
    selector: 'my-update-stammdaten',
    template: `
        <form [formGroup]="form" role="form">
            <div class="form-group row"
                 [class.has-danger]="!titel.valid && titel.touched">
                <label for="titelInput" class="col-sm-2 form-control-label">
                    Titel *
                </label>
                <div class="col-sm-10">
                    <input id="titelInput"
                        placeholder="Titel"
                        class="form-control form-control-danger"
                        autofocus
                        type="text"
                        formControlName="titel">
                    <div class="fa fa-exclamation-circle form-control-feedback"
                        *ngIf="!titel.valid && titel.touched">
                        Ein Buchtitel muss mit einem Buchstaben oder einer Ziffer
                        beginnen.
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

            <!--
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
    @Input() buch: Buch;

    form: FormGroup;
    titel: FormControl;
    art: FormControl;
    verlag: FormControl;
    rating: FormControl;
    // datum: Control;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly buecherService: BuecherService,
        private readonly router: Router) {
        console.log('UpdateStammdatenComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Buchs vorbelegen.
     */
    @log
    ngOnInit(): void {
        console.log('buch=', this.buch);

        // Definition und Vorbelegung der Eingabedaten
        this.titel = new FormControl(
            this.buch.titel, [Validators.required as any, BuchValidator.titel]);
        this.art = new FormControl(this.buch.art, Validators.required);
        this.verlag = new FormControl(this.buch.verlag);
        this.rating = new FormControl(this.buch.rating);
        // this.datum = new Control(this.buch.datum.toISOString());

        this.form = this.formBuilder.group({
            // siehe formControlName innerhalb von @Component({template: ...})
            titel: this.titel,
            art: this.art,
            verlag: this.verlag,
            rating: this.rating
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

        if (isBlank(this.buch)) {
            console.error('buch === undefined/null');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.buch.updateStammdaten(
            this.titel.value, this.art.value, this.verlag.value,
            this.rating.value, this.buch.datum, this.buch.preis,
            this.buch.rabatt);
        console.log('buch=', this.buch);

        const successFn: () => void = () => {
            console.log(`UpdateStammdaten: successFn: path: ${HOME_PATH}`);
            this.router.navigate([HOME_PATH]);
        };
        const errorFn: any = undefined;
        this.buecherService.update(this.buch, successFn, errorFn);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String {
        return 'UpdateStammdatenComponent';
    }
}
