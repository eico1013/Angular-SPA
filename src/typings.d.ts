// .d.ts-Datei fuer fetch() bereitstellen:
/// <reference path="../node_modules/@types/whatwg-fetch/index.d.ts"/>

// bei @Component: templateUrl mit relativen URLs
// https://github.com/angular/angular/issues/6053#issuecomment-222341010
// http://blog.thoughtram.io/angular/2016/06/08/component-relative-paths-in-angular-2.html

// Voraussetzung: CommonJS als Modulsystem
//  moduleId: module.id
//  declare var module: {id: string};

// Voraussetzung: SystemJS
//  moduleId: __moduleName
//  declare var __moduleName: string;
