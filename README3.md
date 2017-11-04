# Issue Tracker

Egy REST API amely Spring Boot segítségével készül el MVC pattern alapján, valamint egy Angular frontend, amely a felhasználói felületet biztosítja, törekszünk az MVVM pattern megtartására. Az adatokat H2 adatbázisban tárljuk a memóriában

### Feladat

Készítsünk egy webes alkalmazást, amellyel bejelentezett felhasználóként olyan hibákat jelenthetünk be, amelyek az ELTE egyes termeiben találhatóak (pl. elromlott projektor), a bejelentett hibáinkat megtekinthetjük, ezekhez megjegyszést írhatunk.
Adminként mindenki hibáját megtekinthetjük, változtathatjuk a hibák státuszát, és válaszolhatunk a felhasználók üzeneteire.
Látogatóként csak statisztikát látunk, és regisztrálhatunk.  

### További részek
    
[1. óra - Spring Boot, MVC, HTTP, H2](./README.md)

[2. óra - ](./README2.md)

### Előkészületek

- Telepítsük fel a [Node.js](https://nodejs.org/en/)-t (ezzel együtt az npm-et).
- Az npm segítségével konzolból telepítsük az [Angular CLI](https://github.com/angular/angular-cli)-t globálisan: `npm install -g @angular/cli`
- Hozzunk létre egy új projektet (akár a szerverünk mellett is egy új könyvtárban): `ng new issue-tracker` és lépjünk is be: `cd issue-tracker`
- Telepítsük fel a Material Design komponensekhez szükséges dependenciákat. Kövessük ezt a tutorialt: https://material.angular.io/guide/getting-started

Az Angular CLI létrehozza az elinduláshoz szükséges fájlokat. Amikkel mi foglalkozunk mind az `issue-tracker/issue-tracker/src` könyvtárban találhatóak.



