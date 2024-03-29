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

import {AbstractControl} from '@angular/forms';
import {isBlank} from '../../shared';

/**
 * Beispiel f&uuml;r eine Klasse mit eigenen Validierungsfunktionen.
 * Die Validierungsfunktionen sind f&uuml;r Formulare, in denen Daten erfasst
 * oder ge&auml;ndert werden.
 */
export class KundeValidator {
    // Rueckgabewert null bedeutet valid

    /**
     * Validierung, ob der Nachname eines Kunden plausibel ist.
     * @param control Das Control-Objekt innerhalb eines Formulars
     * @return null, wenn der Nachname valide ist. Ansonsten ein JSON-Objekt
     *         mit den Verst&ouml;&szlig;en.
     */
    /*
    export interface ValidatorFn {
    (c: AbstractControl): {
        [key: string]: any;
    };
}
*/
    static nachname(control: AbstractControl): {[key: string]: boolean}|null {
        const value: any = control.value;
        if (isBlank(value)) {
            return null;
        }
        // Das 1. Zeichen muss ein Buchstabe, Ziffer oder _ sein
        const invalid: boolean = value.match(/^\w.*/) === null;
        return invalid ? {invalidTitel: true} : null;
    }


    /**
     * Validierung, ob die Email zum Kunden plausibel ist.
     * @param control Das Control-Objekt innerhalb eines Formulars
     * @return null, wenn die Email valide ist. Ansonsten ein JSON-Objekt
     *         mit den Verst&ouml;&szlig;en.
     */
    static email(control: AbstractControl): {[key: string]: boolean}|null {
        const value: any = control.value;
        if (isBlank(value)) {
            return null;
        }
        // http://tools.ietf.org/html/rfc22
        // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address
        const invalid: boolean =
            value.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)
            === null;
        return invalid ? {invalidEmail: true} : null;
    }
}
