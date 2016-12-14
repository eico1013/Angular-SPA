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
import {Buch} from '../shared';
import {BuecherService} from '../shared/buecher.service';

/**
 * Komponente f&uuml;r das Tag <code>my-schlagwoerter</code>
 */
@Component({
    selector: 'my-update-schlagwoerter',
    template: `
        <form [formGroup]="form" role="form">
            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" formControlName="javascript">
                            JavaScript
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" formControlName="typescript">
                            TypeScript
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group row">
                <div class="offset-sm-2 col-sm-10">
                    <button class="btn btn-primary" (click)="onUpdate()"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i>
                        <span class="ml-1">Schlagw&ouml;rter aktualisieren</span>
                    </button>
                </div>
            </div>
        </form>
    `
})
export default class UpdateSchlagwoerterComponent implements OnInit {
    // <schlagwoerter [buch]="...">
    @Input() buch: Buch;

    form: FormGroup;
    javascript: FormControl;
    typescript: FormControl;

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly buecherService: BuecherService,
        private readonly router: Router) {
        console.log('UpdateSchlagwoerterComponent.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Schlagwoertern des zu &auml;ndernden Buchs vorbelegen.
     */
    @log
    ngOnInit(): void {
        console.log('buch=', this.buch);

        // Definition und Vorbelegung der Eingabedaten (hier: Checkbox)
        const hasJavaScript: boolean = this.buch.hasSchlagwort('JAVASCRIPT');
        this.javascript = new FormControl(hasJavaScript);
        const hasTypeScript: boolean = this.buch.hasSchlagwort('TYPESCRIPT');
        this.typescript = new FormControl(hasTypeScript);

        this.form = this.formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            javascript: this.javascript,
            typescript: this.typescript
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

        if (isBlank(this.buch)) {
            console.error('buch === undefined/null');
            return;
        }

        this.buch.updateSchlagwoerter(
            this.javascript.value, this.typescript.value);
        console.log('buch=', this.buch);

        const successFn: () => void = () => {
            console.log(
                `UpdateSchlagwoerterComponent: successFn: path: ${HOME_PATH}`);
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
        return 'UpdateSchlagwoerterComponent';
    }
}
