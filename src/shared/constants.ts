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

const USER: string = 'admin';
const PASSWORD: string = 'p';
const AT: string = '@';

// const SCHEME: string = 'https';
const SCHEME: string = 'http';
// const PORT: number = 8443;
const PORT: number = 8081;
const SERVERNAME: string = 'localhost';
const BASE_PATH: string = '/';



/**
 * Basis-URI, wenn der eigentliche Server verwendet wird.
 * http://admin:p@localhost….
 */
export const BASE_URI: string =
    `${SCHEME}://${USER}${PASSWORD}${AT}${SERVERNAME}:${PORT}${BASE_PATH}`;

/**
 * Pfad f&uuml;r den Zugriff auf B&uuml;cher, ausgehend von der Basis-URI.
 */
export const PATH_BUECHER: string = `buecher`;

/**
 * Pfad f&uuml;r den Zugriff auf Kunden, ausgehend von der Basis-URI.
 */
// export const PATH_KUNDEN: string = `kunden`;
export const PATH_KUNDEN: string = `kunden/v1`;

export const TIMEZONE_OFFSET_MS: number =
    new Date().getTimezoneOffset() * 60 * 1000;
