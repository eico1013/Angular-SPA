# Hinweise zum Programmierbeispiel

<Juergen.Zimmermann@HS-Karlsruhe.de>

> Diese Datei ist in Markdown geschrieben und kann mit `<Strg><Shift>v` in
> Visual Studio Code leicht gelesen werden.
>
> Näheres zu Markdown gibt es in einem [Wiki](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
>
> Das Beispiel in einem Pfad auspacken, der weder Leerzeichen noch
> Umlaute enthält noch im Desktop liegt.
>
> Vor der ersten Übung zu Angular müsseen Installationsprobleme behoben sein.

## Installation, falls es das Unterverzeichnis `node_modules` _nicht_ gibt

* Bei [GitHub](https://github.com) registrieren, falls man dort noch nicht registriert ist.

* [Nur an der _Hochschule_] _Proxy_ für die Installation in einer Eingabeaufforderung konfigurieren:
  * `USERNAME` ist der Platzhalter für die Benutzerkennung für die Poolrechner,
  * `PASSWORD` für das zugehörige Passwort

```CMD
    npm c set proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
    npm c set https-proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
    git config --global http.proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
    git config --global https.proxy http://USERNAME:PASSWORD@proxy.hs-karlsruhe.de:8888
    git config --global url."http://".insteadOf git://
```

* Installation der Fremdsoftware in einer Eingabeaufforderung:

```CMD
    npm i
    npm link @types\chart.js
```

## Kopieren der benötigten Fremdsoftware für die künftige Distribution

```CMD
    gulp initdist
```

## Distribution des eigenen Codes als `bundle.js` im Verzeichnis `dist` erstellen

```CMD
    gulp bundle
```

* Codequalität mit _tslint_ und _clang-format_ prüfen,
* TypeScript durch _tsc_ in das Verzeichnis `ts2js` übersetzen,
* Bundle `bundle.js` im Verzeichnis `dist` erstellen,
* CSS-Dateien durch _Sass_ und _clean-css_ im Verzeichnis `dist` erstellen,
* usw.

Falls es in Zusammenhang mit Sass den Fehler `Error: Missing binding` gibt, dann
muss man in einer Eingabeaufforderung folgendes Kommando eingeben:

```CMD
    npm rebuild node-sass
```

## Künftige Routineaufgaben

### Webserver _browser-sync_ oder _nginx_ starten

```CMD
    gulp browsersync
    gulp nginx
```

Falls _nginx_ verwendet werden soll, muss vor dem ersten Start einmalig
`gulp nginxinit` aufgerufen werden.

Jetzt kann das Beispiel in _Chrome_ mit der Basis-URI `https://localhost` aufgerufen werden.
Für Chrome sind außerdem folgende Erweiterungen empfehlenswert:

* [_Augury_](https://chrome.google.com/webstore/detail/augury/elgalmkoelokbchhkhacckoklkejnhcd)
* [_Recx Security Analyzer_](https://chrome.google.com/webstore/detail/recx-security-analyser/ljafjhbjenhgcgnikniijchkngljgjda)

### bundle.js mit neuen/geänderten Dateien im Verzeichnis `dist` erstellen

```CMD
    gulp bundle
```

Dabei werden auch

* TypeScript-Dateien in das Unterverzeichnis `tmp` übersetzt
* neue/geänderte HTML-Dateien kopiert
* neue/geänderte Sass-Dateien in CSS übersetzt
* neue/geänderte Bilder kopiert

### Evtl. Fehler bzgl. Sass

Falls es in Zusammenhang mit Sass den Fehler `Error: Missing binding` gibt, dann
muss man in einer Eingabeaufforderung folgendes Kommando eingeben:

```CMD
    npm rebuild node-sass
```

## Typische Imports für Angular

```javascript
    import {
        Component,
        NgModule,
        Input,
        Output,
        EventEmitter,
        Inject,
        Injectable,
        OnInit,
        trigger,
        transition,
        ElementRef,
        ViewChild
    } from '@angular/core';
    import {
        RadioButtonState,
        CommonModule
    } from '@angular/common';
    import {
        FormGroup,
        FormBuilder,
        FormControl,
        Validators
    } from '@angular/forms';
    import {
        Routes,
        Router,
        ActivatedRoute,
        CanDeactivate,
        ActivatedRouteSnapshot,
        RouterStateSnapshot
    } from '@angular/router';
    import {
        Http,
        RequestOptions,
        Headers,
        Request,
        RequestMethod
    } from '@angular/http'
    import {Title} from '@angular/platform-browser';
    import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
```

## Empfohlene Code-Konventionen

In Anlehnung an den [Styleguide von Angular](https://angular.io/docs/ts/latest/guide/style-guide.html)
und an den [Styleguide von TypeScript](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines)

* "Feature Filenames": feature.type.ext, z.B.
  * app.module.ts oder
  * create-kunde.component.ts oder
  * kunden.service.ts oder
  * create-kunde.component.html
* _Barrel_ für häufige Imports, z.B.
  * `shared\index.ts` erstellen:
    ```javascript
    export * from './bar';
    export * from './foo';
    ```
  * künftig:
    ```javascript
    import {Foo, Bar} from 'shared';
    ```
* Klassennamen und Enums mit PascalCase
* Attribute und Funktionen mit camelCase,
* private Properties nicht mit vorangestelltem **_**
* Interfaces nicht mit vorangestelltem **I**
* [...].forEach() und [...].filter() statt for-Schleife
* Arrow-Functions statt anonyme Funktionen
* undefined verwenden, nicht: null
* Geschweifte Klammern bei if-Anweisungen
* Präfix für eigene Tags, z.B.
  * `s-suche-artikel` oder
  * `shop-suche-artikel`
* Maximale Dateigröße: 400 Zeilen
* Maximale Funktionsgröße: 75 Zeilen

## Sonstige Hinweise

### Dokumentation zu Chrome DevTools

[Homepage](https://developer.chrome.com/devtools)

### Firefox Developer Edition als Alternative zu Chrome

[Homepage](https://www.mozilla.org/en-US/firefox/developer)

### Projekt-Dokumentation generieren

```CMD
    gulp doc
```

### Proxy-Einstellung künftig ein-/ausschalten

```CMD
    gulp proxy
    gulp noproxy
```

### Umformatieren einer einzelnen Datei mit clang-format

Beispiel:

```CMD
  .\node_modules\clang-format\bin\win32\clang-format -i -style="file" src\...\myfile.ts
```

### Internationalisierung

Das Package _i18n_ innerhalb von Angular 2 ist noch nicht fertig. Bei Bedarf kann
[_ng2-translate_](https://github.com/ocombe/ng2-translate) benutzt werden.
