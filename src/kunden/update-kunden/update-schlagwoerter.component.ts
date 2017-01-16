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
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {HOME_PATH} from '../../app/root.routes';
import {isBlank, log} from '../../shared';
import {Kunde} from '../shared';
import {KundenService} from '../shared/kunden.service';

/**
 * Komponente f&uuml;r das Tag <code>my-interessen</code>
 */
@Component({
    selector: 'my-update-interessen',
    template: `
        <form [formGroup]="form" role="form">
            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" formControlName="R">
                            R
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" formControlName="L">
                            L
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" formControlName="S">
                            S
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <button class="btn btn-primary" (click)="onUpdate()"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i>
                        <span class="ml-1">Interessen aktualisieren</span>
                    </button>
                </div>
            </div>
        </form>
    `
})
export default class UpdateInteressenComponent implements OnInit {
    // <interessen [buch]="...">
    @Input() kunde: Kunde;

    form: FormGroup;
    S: FormControl;
    R: FormControl;
    L: FormControl;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly kundenService: KundenService,
        private readonly router: Router) {
        console.log('UpdateInteressenComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Schlagwoertern des zu &auml;ndernden Buchs vorbelegen.
     */
    @log
    ngOnInit(): void {
        console.log('kunde=', this.kunde);

        // Definition und Vorbelegung der Eingabedaten (hier: Checkbox)
        const hasR: boolean = this.kunde.hasInteresse('R');
        this.R = new FormControl(hasR);
        const hasL: boolean = this.kunde.hasInteresse('L');
        this.L = new FormControl(hasL);
        const hasS: boolean = this.kunde.hasInteresse('S');
        this.S = new FormControl(hasS);

        this.form = this.formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            S: this.S,
            R: this.R,
            L: this.L
        });
    }

    /**
     * Die aktuellen Schlagwoerter f&uuml;r das angezeigte Buch-Objekt
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
            console.error('kunde === undefined/null');
            return;
        }

        this.kunde.updateInteressen(this.S.value, this.R.value, this.L.value);
        console.log('kunde=', this.kunde);

        const successFn: () => void = () => {
            console.log(
                `UpdateInteressenComponent: successFn: path: ${HOME_PATH}`);
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
        return 'UpdateInteressenComponent';
    }
}
