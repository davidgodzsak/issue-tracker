# Issue Tracker

Egy alkalmazás az ELTE tantermeiben található hibák követésére, jelentésére. Egy REST API amely Spring Boot segítségével készül el, valamint egy Angular frontend, amely a felhasználói felületet biztosítja. Az adatokat H2 adatbázisban tárljuk a memóriában

## Előkészületek

Előkészítjük a Spring Boot projetünket a [Spring Initializer](https://start.spring.io/) eszközzel:
 
* Felül a lenyíló listákban:
  * maven
  * java
  * 1.5.7  
* Group: hu.elte.alkfejl
* Artifact: issue-tracker
* Dependencies: 
  * H2 - in memory database
  * JPA - spring-data-jpa -> repositoryk használatához
  * Lombok - automatikus getter, setter, constructor generálás
  * Thymeleaf - nézet generálása
  * DevTools - fejlesztéshez segítség
* Töltsük le a projektet és nyissuk meg a kedvenc IDE-ben. 
* Indítsunk egy git repot: `git init`
* Commitoljuk az alapokat `git add . && git commit -m "setup"`