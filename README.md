# Issue Tracker

Egy REST API amely Spring Boot segítségével készül el MVC pattern alapján, valamint egy Angular frontend, amely a felhasználói felületet biztosítja, törekszünk az MVVM pattern megtartására. Az adatokat H2 adatbázisban tárljuk a memóriában

### Feladat

Készítsünk egy webes alkalmazást, amellyel bejelentezett felhasználóként olyan hibákat jelenthetünk be, amelyek az ELTE egyes termeiben találhatóak (pl. elromlott projektor), a bejelentett hibáinkat megtekinthetjük, ezekhez megjegyszést írhatunk.
Adminként mindenki hibáját megtekinthetjük, változtathatjuk a hibák státuszát, és válaszolhatunk a felhasználók üzeneteire.
Látogatóként csak statisztikát látunk, és regisztrálhatunk.  

### További részek
    
[2. óra - REST API, Authentikáció, JOIN](./README2.md)

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
* https://medium.freecodecamp.org/app.model-view-controller-mvc-explained-through-ordering-drinks-at-the-bar-efcba6255053

### Model

Az MVC ben az M a Model-t jelenti. Ebben a rétegben írjuk le az adatbázisban található entitásokat és ezek kapcsolatait

* Készítsünk egy app.model package-et az issuetracker package-en belül
* Minden entitásnak szüksége lesz ID és Version mezőkre, ezért készítünk egy BaseEntity-t

```java
package hu.elte.alkfejl.issuetracker.app.model;

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
package hu.elte.alkfejl.issuetracker.app.model;

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

Készítsünk egy új felhasználót a /src/main/schema.sql fájlban: `INSERT INTO USERS (ID, VERSION, USERNAME, EMAIL, PASSWORD, ROLE) VALUES (0, 0, 'admin', 'admin@gmail.com', 'admin', 'ADMIN');`. Ez létrehoz egy felhasználót ID:0, Version: 0, username:'admin', email:'admin@gmail.com' password: 'admin', role: 'ADMIN'.
Később titkosítjuk majd a jelszót.

A `select SQL from information_schema.tables where table_name = 'USERS';` parancs kiadásával a H2 konzolban az eredmány az az sql parancs, amit a JPA kiadott a tábla létrehozásához.

Még visszatérünk majd a modelre és kiegészítjük a többi osztállyal.

### Controller

A Controller feladata a beérkező HTTP kéréseket feldolgozni, és ezekre válaszolni. Végpontokat definiálunk, amelyeket a külvilág (Angular) alkalmazás elér HTTP kérésekkel és ezekre választ kap.
Gyakran készítünk egy Service réteget is a Controller mellé, hogy mg jobban szétválasszuk a felelősségi köröket: A controller csak a kérések fogadásával és a válasz adással foglalkozik, a Service réteg a kérés és válasz közötti adat feldolgozással, adatbázissal való kommunikációval.
 
Készítsünk el egy UserController-t, amellyel bejelentkeztetünk, regisztrálhatunk:

* az issuetracker package-en belül hozzunk létre egy controller package-et 
* és abban egy UserController osztályt

```java
package hu.elte.alkfejl.issuetracker.controller;

import hu.elte.alkfejl.issuetracker.app.model.User;
import hu.elte.alkfejl.issuetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import static hu.elte.alkfejl.issuetracker.app.model.User.Role.USER;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/greet")
    public String greeting(@RequestParam(value = "name", required = false, defaultValue = "World") String name, Model app.model) {
        app.model.addAttribute("name", name);
        return "greeting";
    }

    @GetMapping("/login")
    public String login(Model app.model) {
        app.model.addAttribute(new User());
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute User user, Model app.model) {
        if (userService.isValid(user)) {
            return redirectToGreeting(user);
        }
        app.model.addAttribute("loginFailed", true);
        return "login";
    }

    @GetMapping("/register")
    public String register(Model app.model) {
        app.model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute User user) {
        user.setRole(USER);
        userService.register(user);

        return redirectToGreeting(user);
    }

    private String redirectToGreeting(@ModelAttribute User user) {
        return "redirect:/user/greet?name=" + user.getUsername();
    }
}
```

Itt már rengeteg dolog történik: 
* A @Controller annotációval jelezzük, hogy ez egy kontroller lesz, ez többek között egy Spring Bean-t készít az osztályból.
* A Spring Bean olyan osztály, amiket a Spring Dependenxy Injectionben használ, nem kell kézzel new-val létrehoznunk, a Spring akkor létrehozza amikor szüksége van rá
* A @RequestMapping("/user") annotáció megmondja a Springnek, hogy a /user alatt hallgasson minden végpont, minden HTTP metódusra
* Bár a UserService osztály még nem íruk meg - ez lesz a következő feladat - itt már támaszkodunk rá. Ez egy service lesz, amely mint már említettem a kontrolelrekben található üzleti logikát tartalmazza. Spring Beanként hozzuk majd létre, ezért tudjuk az @Autowired annotációval beinjektálni
* A @GetMapping("/greeting") azt állítja be, hogy a metódus a GET HTTP metódus hatására hívódjon meg méghozzá a /greet url-en, DE mivel az egész osztályra rátettük a @RequestMapping("/user")-t ezért a /user alá kerül be és lesz belőle /user/greet.
* A @RequestParam segítségével érjük el a GET requestek paraméterét és alapértelmezett értéket is tudunk adni nekik. A `Model app.model` paraméter segítségével tudunk adatokat juttatni a felületre. Itt például a paraméterként érkező nevet juttatjuk a nézetbe. A metódus visszatérési értéke a template, amelyet megjeleníteni szeretnénk, erről a View részben lesz szó
* A @PostMapping jelzi azt, hogy a metódus egy POST requestet fog kezelni a megadott route-on pl. /register vagy /login a @ModelAttribute a post metódusban érkező form adatokat parseolja fel és értelmezi User-ként, ehhez szükséges, hogy megefelelő legyen a mezők elnevezése a form-ban
* Lehetőségünk van az átirányításra is ennek a mintáját látjuk a redirectToGreeting metódusban

### Service
A Service réteg szigorúbban véve a Controllerhez tartozik, az üzleti logikát tartamazza. A mi feladatunkban például a felhasználók validálásának menetét és a regisztárlást fogja tartalmazni.

Azért is érdemes kivenni az ilyen logikát a controllerből és áthelyezni a Service-be mert lehet, hogy több helyről is akarjuk ugyanazokat a folyamatokat használni. Például ha egy REST API-t írunk az alkalmazáshoz, de  megtartjuk az  eredeti MVC appot is, akkor nem kell kétszer leírnunk ugyanazokat a logikákat (felhasználó bejelentkezésének folyamata, stb.) így a kódduplikációt szürhetjük ki, azaz ha megváltozik a logika a bejelentkeztetés mögött (pl. felhasználónév helyett email alapú lesz), akkor csak egy helyen kell módosítani: a service-ben.


Készítsük el a UserService-t a service package-ben:

```java
package hu.elte.alkfejl.issuetracker.service;

import hu.elte.alkfejl.issuetracker.app.model.User;
import hu.elte.alkfejl.issuetracker.repository.UserRepoitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepoitory userRepoitory;

    public void register(User user) {
        userRepoitory.save(user);
    }

    public boolean isValid(User user) {
        return userRepoitory.findByUsernameAndPassword(user.getUsername(), user.getPassword()).isPresent();
    }
}

```
* A @Service annotációval jelezzük, hogy az osztályunk egy Spring Bean, így tudjuk majd injectelni az @Autowired segítségével más osztályokba, a Spring kezeli az életciklusát
* Használunk egy UserRepository nevű SpringBean-t ezt még meg kell írnunk. Ő foglalkozi az adatok perzisztálásával, és lekérdezésével, lényegében az adatbázissal kommunikál

### Data Access Layer 

Lényegében a Model-be tartozik, de csak most jutottunk el a használatához, ezért mutatom itt be.

A DAL egy absztrakt fogalom, azokat az osztályokat értjük bele, amelyek kapcsolatot teremtenek az adatbázissal.
Az Entitásokkal ismerkedtünk meg eddik, ők leírják a Spring-nek, hogy milyen formában kell létrehozni a táblákat és a belőlük létrehozott objektumokkal dolgozunk az alkalmazásban/kommunikálunk az adatbázissal (bejelentkezünk és elküldjük a felhasználó adatait, regisztrációval új felhasználó vehető fel).
Ahhoz, hogy elérjük az adatbázist szükségünk van még olyan osztályokra amelyek a kommunikációt írják le, eléggé absztrakt, ahhoz, hogy szinte bármilyen relációs adatbázissal működjön: 

* Kapcsolat nyitása
* Lekérdezések futtatása
* Adatok visszaadása
* Kapcsolat lezárása

A DAL rétegünket felépítő osztályokat Springben Repositorynak hívjuk (Java EE-ben DAO, bár az kicsit más). 
Általában nekünk kell ezeket az adatbázis lekérdezéseket megírnunk, JDBC ben vagy valamilyen absztrakt ORM-ben pl. Hibernate, Querydsl

Ilyenkor általában nagyon hasonló kódok születnek, kb. midnig hasonlóan kell kapcsolatot teremteni egy adatbázissal, perzisztálni entitásokat stb.
Itt most nem ez a helyzet. A [spring-data-jpa](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/) egy olyan eszközkészletet ad a kezünkbe, mely segítségével ezeket rábízhatjuk a Spring-re. A Spring konkrétan le generálja ezeket a kódokat, de ehhez egy megkötött formában kéri megadni a Reopsitoryt. FIGYELEM! Magic következik:
  
Készítsük el tehát a UserRepository-t:

```java
package hu.elte.alkfejl.issuetracker.repository;

import hu.elte.alkfejl.issuetracker.app.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepoitory extends CrudRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndPassword(String username, String password);
}
``` 

* A @Repository annotáció egy injektálható Spring Bean-t hoz létre, amely egy Repository lesz (DAL-ba tartozó osztály).
* Származtassunk egy **interface**-t a CrudRepository interface-ből
* Az első generikus paraméter azt írja el, milyen entitáshoz akarjuk majd használni a repositoryt, a második az ID típusát.

A CrudRepository egy olyan speciális repository amely definiálja a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) műveletekhez szükséges metódusokat. Ezt kapjuk meg mi is, ha innen származtatjuk az interface-ünket

### View

A View rétegbe kerülnek azok a fájlok, amelyek a megjelenést biztosítják, tehát esetünkbe a html fájlok, amelyekbet a böngésző értelmezni fog.

A Controllernél említettem, hogy az egyes metódusok át tudnak irányítani, vagy visszaadnak egy stringet, amellyel megmondják, melyik html fájlt kell renderelni.
Ezeket a fájlokat az src/main/resources/remplates mappában helyezzük el, ilyenkor egyszerűen csak a nevüket kell visszaadni a controllerből pl. a greeting.html esetén greeting.
Ha mélyebben lévő fájlt szeretnénk visszaadni azt is megtehetjük pl. templates/a/b.html esetén a/b -t kell visszaadnia a kontrollernek.

Az eredeti HTML fájlok statikusak, ahogy megírjuk őket azok, úgy renderelődnek. Nekünk ez ebben az esetben nem jó, kellene valamilyen módszer, hogy adatokat tudjunk átadni nekik (dinamikus megjelenés kedvéért). 

Ehhez használjuk a [Thymeleaf](http://www.thymeleaf.org/doc/tutorials/2.1/usingthymeleaf.html)-et.

Lássunk egy példát a login oldalra:

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
    <head>
        <title>Login</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body>
        <h1>Login</h1>
        <h2 th:if="${loginFailed}">Invalid user data!</h2>
        <form action="#" th:action="@{/user/login}" th:object="${user}" method="post">
            <div id="username">
                <label for="username">Username:</label>
                <input type="text" name="username" placeholder="username" th:field="*{username}" />
            </div>
            <div id="password">
                <label for="password">Password:</label>
                <input type="password" name="password" placeholder="password" th:field="*{password}" />
            </div>
            <input type="submit" value="Submit!" />
            <button type="reset">Cancel</button>
        </form>
    </body>
</html>
``` 

Mint láthatjuk nem egy egyszerű html-lel van dolgunk, találunk itt xmlns namespace-t (th) és ilyen fura dolgokat, mint @{}, ${}, *{}.

* @{} - link megjelenítésére használjuk
* ${} - egy kifejezés kiértékelésére használjuk pl. változó kiírása
* *{} - szintén kifejezés kiértékelésére használjuk, de mélyebb szinten pl. mivel a *{username}-t bentebbi szinten haszáljuk mint a ${user}-t ezért őt a ${user} fieldjeként kezeli. Itt a *{username} megegyezik a ${user.username} kifejezéssel
* th:object - használatával a conrollerben látott @ModelAttribute-ba kötjük bele a form adatait
* th:field - ezt a fieldet "belekötjük" a ModelAttribute-ba


 