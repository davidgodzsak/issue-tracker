# Issue Tracker

Egy alkalmazás az ELTE tantermeiben található hibák követésére, jelentésére. Egy REST API amely Spring Boot segítségével készül el MVC pattern alapján, valamint egy Angular frontend, amely a felhasználói felületet biztosítja, törekszünk az MVVM pattern megtartására. Az adatokat H2 adatbázisban tárljuk a memóriában

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
* Töltsük le a projektet

A H2 adatbázisunkat a böngészőből tudjuk majd nézegetni, debugolni fejlesztés közben, ehhez:
* Nyissuk meg a projektet a kedvenc IDE-ben
* Keressük meg az src/main/resources/application.properties fájlt
* Helyezzük el benne ezt a két sor:
 
 ```
 spring.datasource.platform=h2
 spring.h2.console.path=/h2
 ```
  
* Indítsunk egy git repot: `git init`
* Commitoljuk az eddig elkészülteket `git add . && git commit -m "setup"`


## MVC

Az MVC egy olyan struktúra amely segítségével a szoftverünk szerepköreit szétválasztjuk, az egyes rétegeket egymástól külön kezeljük.

A struktúra megtartásával az egyes rétegek könnyebben cserélhetőek, kiegészíthetőek, a szoftver jól struktúrált lesz és átlátható. Az újabb funkciók implementációja során a megoldandó problémát is kissebb részekre tudjuk így bontani.

Mi az az MVC: 
* https://www.youtube.com/watch?v=1IsL6g2ixak
* https://medium.freecodecamp.org/model-view-controller-mvc-explained-through-ordering-drinks-at-the-bar-efcba6255053

### Model

Az MVC ben az M a Model-t jelenti. Ebben a rétegben írjuk le az adatbázisban található entitásokat és ezek kapcsolatait

* Készítsünk egy model package-et az issuetracker package-en belül
* Minden entitásnak szüksége lesz ID és Version mezőkre, ezért készítünk egy BaseEntity-t

```java
package hu.elte.alkfejl.issuetracker.model;

import lombok.Data;

import javax.persistence.*;

@Data
@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private String id;

    @Version
    private int version;
}
```

A @MappedSuperclass annotáció mondja meg a JPA-nak, hogy ezt az osztályt nem fogjuk önmagában entitásként kezelni, csak felhasználjuk más entitásoknál. A @Data annotáció a Lombok-ból jön, segítségévle automatikusan kigenerálódnak a getterek, setterek equals, és hashcode metódusok.
Az @Id mondja meg, hogy a mező fogja azonosítani az egyes entitásokat, és automatikusan generáljuk az értékeit egy inkrementális stratégiával.
A @Version használatára azért van szükség, mert egyszerre több felhasználó is módosíthatja az adatokat, ilyenkor ez a változó segíti a fennakadás mentes munkát( minden a háttérben történik, ezzel nem kell foglalkoznunk) 

* Elkészítjük a User táblát is

```java
package hu.elte.alkfejl.issuetracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "USERS")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private Role role;

    private enum Role {
        GUEST, USER, ADMIN
    }
}
```
Az @Entity annotációval mondjuk meg, hogy ez az osztály egy entitás lesz. Az előbb elkészített BaseEntityből szárámazik. Lombok segítségével legeneráljuk a konstruktorait (@AllArgsConstructor, @NoargsConstructor), valamint jelezzük, hogy az equals és a hashcode generálásakor vegye figyelembe az ősosztálybeli mezők értékeit is.
A @Column annotáció használata nem kötelező, a JPA minden entitás beli oszlopot elment (kivéve ha használjuk a @Transient annotációt), viszont segítségével tudjuk az unique és a null constrainteket érvényesíteni a mezőn.
Az @Enumerated annotációval jelezzük, hogy az ENUM típúsú mezőket milyen módon szeretnénk persistálni. Itt Stringként, érték szerint fogjuk ezt tenni.

Ha most elindítjuk az alkalmazást `mvn spring-boot:run` és megnyitjuk a `localhost:8080/h2` -t akkor látjuk a H2 conosle ban, hogy sikeresen létrehozta az entitás leírása alapján a Spring Boot a JPA segítségével a táblánkat.

Mivel a H2 adatbázis a memóriába ment, ezért minden alkalommal, mikor leállítjuk törlődnek az adataink. Ahhoz hogy legyenek adataink az induláskor az adatbázisban a Spring Boot segítségét vesszük.
a src/main/resources mappában elkészítjük a data.sql-t(adatok insertálása).Ezt futtatja majd a Spring Boot, amikor az alakalmazásunkat indítjuk.

Készítsünk egy új felhasználót a /src/main/schema.sql fájlban: `INSERT INTO USERS VALUES (0, 0, 'admin', 'admin@gmail.com', 'admin', 'ADMIN')`. Ez létrehoz egy felhasználót ID:0, Version: 0, username:'admin', email:'admin@gmail.com' password: 'admin', role: 'ADMIN'.
Később titkosítjuk majd a jelszót.

A `select SQL from information_schema.tables where table_name = 'USERS';` parancs kiadásával a H2 konzolban az eredmány az az sql parancs, amit a JPA kiadott a tábla létrehozásához.

Még visszatérünk majd a modelre és kiegészítjük a többi osztállyal.

### Controller

A Controller feladata a beérkező HTTP kéréseket feldolgozni, és ezekre válaszolni. Végpontokat definiálunk, amelyeket a külvilág (Angular) alkalmazás elér HTTP kérésekkel és ezekre választ kap.
Gyakran készítünk egy Service réteget is a Controller mellé, hogy mg jobban szétválasszuk a felelősségi köröket: A controller csak a kérések fogadásával és a válasz adással foglalkozik, a Service réteg a kérés és válasz közötti adat feldolgozással, adatbázissal való kommunikációval.
 
Készítsünk el egy UserController-t:

* az issuetracker package-en belül hozzunk létre egy controller package-et 
* és abban egy UserController osztályt



