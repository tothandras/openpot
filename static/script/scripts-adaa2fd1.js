/**
*	@author Andras Toth <andras.toth93@gmail.com>
*	@url https://github.com/tothandras/openpot
*	@license MIT
*/
angular.module("config",[]).constant("RELEASE",!0),angular.module("template",[]).run(["$templateCache",function(e){e.put("home.tpl.html",'<div class="home">\n    <div layout="row" layout-align="center center">\n        <h1>Főoldal</h1>\n    </div>\n</div>\n'),e.put("login.tpl.html",'<md-dialog class="login">\n    <md-content>\n        <h3>Belépés</h3>\n        <form name="loginForm" novalidate>\n            <md-input-container>\n                <label for="email">Email</label>\n                <input id="email" type="email" name="email" ng-model="dialog.email" required>\n                <div ng-messages="loginForm.email.$error" ng-show="loginForm.email.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="password">Jelszó</label>\n                <input id="password" type="password" name="password" ng-model="dialog.password" minlength="8" required>\n                <div ng-messages="loginForm.password.$error" ng-show="loginForm.password.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                    <div ng-message="minlength">Túl rövid!</div>\n                </div>\n            </md-input-container>\n        </form>\n        <div class="error-container">\n            <span class="error" ng-show="dialog.error">Helytelen felhasználónév vagy jelszó.</span>\n        </div>\n    </md-content>\n    <div class="md-actions">\n        <md-button class="md-primary" ng-click="dialog.login()" ng-disabled="loginForm.$invalid">OK</md-button>\n        <md-button ng-click="dialog.closeDialog()">Mégse</md-button>\n    </div>\n</md-dialog>\n'),e.put("menu.tpl.html",'<div class="menu">\n    <md-sidenav md-component-id="left" class="md-sidenav-left">\n        <md-toolbar class="md-default-theme">\n        </md-toolbar>\n        <md-content class="md-padding">\n            <div layout="column">\n                <a ng-repeat="item in ::menu.items" class="md-button md-default-theme" ui-sref="{{ item.sref }}">\n                    {{ item.caption }}\n                </a>\n            </div>\n        </md-content>\n    </md-sidenav>\n</div>\n'),e.put("pots.tpl.html",'<div class="pots">\n    <div layout="row" class="row">\n        <div flex="35" class="info">\n            <ui-gmap-google-map options="pots.map.options" center=\'pots.map.center\' zoom=\'pots.map.zoom\'></ui-gmap-google-map>\n        </div>\n        <div ng-if="pots.pots.length === 0" class="no-pots" layout="row" layout-align="center center">\n            <h1>\n                Jelenleg egy szaftos fazék sincs a környéken.\n                <br/>\n                <span>Nézz vissza később!</span>\n            </h1>\n        </div>\n        <div flex class="list">\n            <md-content>\n                <!--<form name="search" novalidate>-->\n                    <!-- -->\n                <!--</form>-->\n            </md-content>\n            <md-card class="pot" ng-repeat="pot in pots.pots track by pot.id">\n                <h2>{{pot.name}}</h2>\n                <p>\n                    {{pot.description}}\n                </p>\n            </md-card>\n        </div>\n    </div>\n</div>\n'),e.put("register.tpl.html",'<md-dialog class="register">\n    <md-content>\n        <h3>Regisztráció</h3>\n        <form name="registerForm" novalidate>\n            <md-input-container>\n                <label for="email">Email</label>\n                <input id="email" type="email" name="email" ng-model="dialog.email" required>\n                <div ng-messages="registerForm.email.$error" ng-show="registerForm.email.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="password">Jelszó</label>\n                <input id="password" type="password" name="password" ng-model="dialog.password" minlength="8" required>\n                <div ng-messages="registerForm.password.$error" ng-show="registerForm.password.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                    <div ng-message="minlength">Túl rövid!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="firstName">Keresztnév</label>\n                <input id="firstName" type="text" name="firstName" ng-model="dialog.firstName" required>\n                <div ng-messages="registerForm.firstName.$error" ng-show="registerForm.firstName.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="lastName">Vezetéknév</label>\n                <input id="lastName" type="text" name="lastName" ng-model="dialog.lastName" required>\n                <div ng-messages="registerForm.lastName.$error" ng-show="registerForm.lastName.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n        </form>\n        <div class="error-container">\n            <span class="error" ng-show="dialog.error">Ez az email cím már használatban van.</span>\n        </div>\n    </md-content>\n    <div class="md-actions">\n        <md-button class="md-primary" ng-click="dialog.register()" ng-disabled="registerForm.$invalid">OK</md-button>\n        <md-button ng-click="dialog.closeDialog()">Mégse</md-button>\n    </div>\n</md-dialog>\n'),e.put("toolbar.tpl.html",'<div class="toolbar">\n    <md-toolbar class="md-default-theme" layout="row">\n        <h1 class="md-toolbar-tools">\n            <i class="fa fa-bars" ng-click="toolbar.toggleMenu()"/>\n            <p>OpenPot</p>\n            <p>{{this.user.email}}</p>\n        </h1>\n        <h1 class="md-toolbar-tools" layout="row" layout-align="end center">\n            <p ng-if="!toolbar.user.email">\n                <span class="link" ng-click="toolbar.openRegistrationDialog($event)">Regisztráció</span>\n                <span class="link" ng-click="toolbar.openLoginDialog($event)">Belépés</span>\n            </p>\n            <p ng-if="!!toolbar.user.email">\n                <span>{{toolbar.user.firstName}}</span>\n                <i class="fa fa-caret-down" ng-class="{\'fa-rotate-180\': toolbar.dropdown}" ng-click="toolbar.toggleDropdown()"></i>\n            </p>\n        </h1>\n    </md-toolbar>\n    <div ng-show="toolbar.dropdown" class="dropdown md-whiteframe-z1">\n        <ul>\n            <li ng-click="toolbar.goToUser()">Felhasználó</li>\n            <li ng-click="toolbar.newPot()">Új hirdetés</li>\n            <li ng-click="toolbar.logout()">Kijelentkezés</li>\n        </ul>\n    </div>\n</div>\n'),e.put("user.list.tpl.html",'<div class="list">\n    <md-card class="pot" ng-repeat="pot in user.pots track by pot.id">\n        <h2>{{pot.name}}</h2>\n\n        <p>\n            {{pot.description}}\n        </p>\n    </md-card>\n    <md-button class="md-fab" aria-label="Add new" ng-click="user.goToNewpot()">\n        <i class="fa fa-plus"></i>\n    </md-button>\n</div>\n'),e.put("user.newpot.tpl.html",'<h1>\n    <span>Új hírdetés</span>\n</h1>\n<section class="form">\n    <md-content>\n        <form name="newpotForm" novalidate>\n            <md-input-container>\n                <label for="newName">Név</label>\n                <input id="newName" type="text" name="newName" ng-model="user.newName" required>\n                <div ng-messages="newpotForm.newName.$error" ng-show="newpotForm.newName.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="newDescription">Leírás</label>\n                <input id="newDescription" type="text" name="newDescription" ng-model="user.newDescription" minlength="20" required>\n                <div ng-messages="newpotForm.newDescription.$error" ng-show="newpotForm.newDescription.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                    <div ng-message="minlength">Túl rövid!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="newAddress">Cím</label>\n                <input id="newAddress" type="text" name="newAddress" ng-model="user.newAddress" required>\n                <div ng-messages="newpotForm.newAddress.$error" ng-show="newpotForm.newAddress.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n        </form>\n        <div class="error-container">\n            <span class="error" ng-show="user.error">Helytelen adatok.</span>\n        </div>\n    </md-content>\n    <div class="md-actions">\n        <md-button class="md-primary" ng-click="user.newPot()" ng-disabled="newpotForm.$invalid">OK</md-button>\n    </div>\n</section>\n\n<md-button class="md-fab" aria-label="Go back" ng-click="user.goToList()">\n    <i class="fa fa-minus"></i>\n</md-button>\n'),e.put("user.tpl.html",'<div class="user">\n    <div layout="row" class="row">\n        <div flex="25" class="info">\n            <div class="img-container">\n                <img ng-src="{{::user.data.image}}" alt="" class="circle responsive-image"/>\n            </div>\n            <h2 class="firstName">{{::user.data.firstName}}</h2>\n        </div>\n        <div flex class="subview" ui-view></div>\n    </div>\n</div>\n')}]);var op;!function(){"use strict";angular.module("op",["ngMaterial","ngMessages","template","config","op.common","op.home","op.pots","op.toolbar","op.users","ui.router"])}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.common",["ngMaterial","LocalStorageModule"])}(t=e.toolbar||(e.toolbar={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.home",["ui.router"])}(t=e.home||(e.home={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.login",["op.common","ui.router"])}(t=e.login||(e.login={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.menu",["ui.router"])}(t=e.menu||(e.menu={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.pots",["op.common","ui.router","uiGmapgoogle-maps"])}(t=e.pots||(e.pots={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.register",["op.common","ui.router"])}(t=e.register||(e.register={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.toolbar",["ngMaterial","op.menu","op.login","op.register","ui.router"])}(t=e.toolbar||(e.toolbar={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";angular.module("op.users",["op.common","ui.router","angular-md5"])}(t=e.users||(e.users={}))}(op||(op={}));var op;!function(){"use strict";function e(e,t,o,n,i){e.html5Mode(!0),t.otherwise("/"),o.debugInfoEnabled(!i),n.debugEnabled(!i)}e.$inject=["$locationProvider","$urlRouterProvider","$compileProvider","$logProvider","RELEASE"],angular.module("op").config(e)}(op||(op={}));var op;!function(){"use strict";var e=function(){function e(e,t){var o=this;this.name="App Controller",this.titlePrefix="OpenPot",this.title="OpenPot",t.debug(this.name),e.$on("$stateChangeSuccess",function(e,t){angular.isDefined(t.data.title)&&(o.title=o.titlePrefix+" | "+t.data.title)})}return e.$inject=["$scope","$log"],e.$inject=["$scope","$log"],e}();angular.module("op").controller("AppController",e)}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e="/api",t="/auth";angular.module("op.common").constant("API_URL",e).constant("AUTH_URL",t)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e){this.name="Home Controller",e.debug(this.name)}return e.$inject=["$log"],e.$inject=["$log"],e}();angular.module("op.home").controller("HomeController",e)}(t=e.home||(e.home={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.state("home",{url:"/",templateUrl:"home.tpl.html",controller:"HomeController",controllerAs:"home",data:{onMenu:!0,caption:"Főoldal",icon:null}})}e.$inject=["$stateProvider"],angular.module("op.home").config(e)}(t=e.home||(e.home={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t,o,n,i){this.AuthService=e,this.SessionService=t,this.$state=o,this.LoginDialogService=n,this.$log=i,this.name="Login Controller",i.debug(this.name)}return e.$inject=["AuthService","SessionService","$state","LoginDialogService","$log"],e.$inject=["AuthService","SessionService","$state","LoginDialogService","$log"],e.prototype.login=function(){var e=this;this.error=null,this.AuthService.login(this.email,this.password).then(function(t){e.$log.debug(t),e.LoginDialogService.closeDialog()},function(t){e.error=t})},e.prototype.logout=function(){this.SessionService.loggedIn()&&(this.AuthService.logout(),this.LoginDialogService.closeDialog(),this.$state.go("home"))},e.prototype.closeDialog=function(){this.LoginDialogService.closeDialog()},e}();angular.module("op.login").controller("LoginController",e)}(t=e.login||(e.login={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t){this.$log=e,this.$mdDialog=t}return e.$inject=["$log","$mdDialog"],e.$inject=["$log","$mdDialog"],e.prototype.showDialog=function(e){return this.$mdDialog.show({parent:angular.element(document.body),targetEvent:e,templateUrl:"login.tpl.html",controller:"LoginController as dialog"})},e.prototype.closeDialog=function(){return this.$mdDialog.hide()},e}();angular.module("op.login").service("LoginDialogService",e)}(t=e.login||(e.login={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t,o){var n=this;this.$mdSidenav=e,this.name="Menu Controller",this.items=o.getMenuItems(),t.$on("$stateChangeStart",function(){n.close()})}return e.$inject=["$mdSidenav","$rootScope","MenuService"],e.$inject=["$mdSidenav","$rootScope","MenuService"],e.prototype.close=function(){this.$mdSidenav("left").close()},e}();angular.module("op.menu").controller("MenuController",e)}(t=e.menu||(e.menu={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(){this.restrict="E",this.scope={},this.controller="MenuController",this.controllerAs="menu",this.bindToController=!0,this.templateUrl="menu.tpl.html",this.transclude=!1,this.replace=!0}return e.instance=function(){return new e},e}();angular.module("op.menu").directive("opMenu",e.instance)}(t=e.menu||(e.menu={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t){this.$log=e,this.$state=t}return e.$inject=["$log","$state"],e.$inject=["$log","$state"],e.prototype.getMenuItems=function(){for(var e=[],t=this.$state.get(),o=1;o<t.length;o++){var n=t[o],i=n.data;i.onMenu&&e.push({caption:null!=i?i.caption:n.name,sref:n.name,icon:null!=i?i.icon:null})}return this.$log.debug(e),e},e}();angular.module("op.menu").service("MenuService",e)}(t=e.menu||(e.menu={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.configure({v:"3.17",libraries:"geometry,visualization"})}e.$inject=["uiGmapGoogleMapApiProvider"],angular.module("op.pots").config(e)}(t=e.pots||(e.pots={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t){var o=this;this.name="Pots Controller",this.pots=[],this.map={center:{latitude:45,longitude:-73},zoom:8,options:{disableDefaultUI:!0}},e.debug(this.name),t.getPots().then(function(e){o.pots=e})}return e.$inject=["$log","APIService"],e.$inject=["$log","APIService"],e}();angular.module("op.pots").controller("PotsController",e)}(t=e.pots||(e.pots={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.state("pots",{url:"/pots",templateUrl:"pots.tpl.html",controller:"PotsController",controllerAs:"pots",data:{onMenu:!0,caption:"Böngészés",icon:null}})}e.$inject=["$stateProvider"],angular.module("op.pots").config(e)}(t=e.pots||(e.pots={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var t=function(){function t(e,t,o,n){this.$state=e,this.RegisterDialogService=t,this.AuthService=o,this.$log=n,this.name="Register Controller",n.debug(this.name)}return t.$inject=["$state","RegisterDialogService","AuthService","$log"],t.$inject=["$state","RegisterDialogService","AuthService","$log"],t.prototype.register=function(){var t=this;this.error=null;var o=new e.common.RegisterUser;o.email=this.email,o.password=this.password,o.firstName=this.firstName,o.lastName=this.lastName,this.AuthService.register(o).then(function(e){t.$log.debug(e),t.closeDialog()},function(e){t.error=e})},t.prototype.closeDialog=function(){this.RegisterDialogService.closeDialog()},t}();angular.module("op.register").controller("RegisterController",t)}(t=e.register||(e.register={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t){this.$log=e,this.$mdDialog=t}return e.$inject=["$log","$mdDialog"],e.$inject=["$log","$mdDialog"],e.prototype.showDialog=function(e){this.$mdDialog.show({parent:angular.element(document.body),targetEvent:e,templateUrl:"register.tpl.html",controller:"RegisterController as dialog"})},e.prototype.closeDialog=function(){this.$mdDialog.hide()},e}();angular.module("op.register").service("RegisterDialogService",e)}(t=e.register||(e.register={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t,o,n,i,r){var s=this;this.$log=e,this.$mdSidenav=t,this.$state=o,this.LoginDialogService=n,this.RegisterDialogService=i,this.SessionService=r,this.name="Toolbar Controller",this.dropdown=!1,e.debug(this.name),r.getUser().then(function(e){s.user=e})}return e.$inject=["$log","$mdSidenav","$state","LoginDialogService","RegisterDialogService","SessionService"],e.$inject=["$log","$mdSidenav","$state","LoginDialogService","RegisterDialogService","SessionService"],e.prototype.toggleMenu=function(){this.$mdSidenav("left").toggle()},e.prototype.openRegistrationDialog=function(e){this.RegisterDialogService.showDialog(e)},e.prototype.openLoginDialog=function(e){this.LoginDialogService.showDialog(e)},e.prototype.goToUser=function(){this.dropdown=!1,this.$state.transitionTo("user.list")},e.prototype.newPot=function(){this.dropdown=!1,this.$state.transitionTo("user.newpot")},e.prototype.logout=function(){this.dropdown=!1,this.SessionService.unsetUser(),this.$state.transitionTo("home")},e.prototype.toggleDropdown=function(){this.dropdown=!this.dropdown},e}();angular.module("op.toolbar").controller("ToolbarController",e)}(t=e.toolbar||(e.toolbar={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(){this.restrict="E",this.scope={},this.controller="ToolbarController",this.controllerAs="toolbar",this.bindToController=!0,this.templateUrl="toolbar.tpl.html",this.transclude=!1,this.replace=!0}return e.instance=function(){return new e},e}();angular.module("op.toolbar").directive("opToolbar",e.instance)}(t=e.toolbar||(e.toolbar={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e,t,o){e.$on("$stateChangeSuccess",function(){t.ga&&t.ga("send","pageview",{page:o.path()})})}e.$inject=["$rootScope","$window","$location"],angular.module("op.common").run(e)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(e){"use strict";var t=function(){function t(e,t,o){this.$http=e,this.$q=t,this.API_URL=o}return t.$inject=["$http","$q","API_URL"],t.$inject=["$http","$q","API_URL"],t.prototype.getUserData=function(t){var o=this.$q.defer(),n={method:"GET",url:this.API_URL+"/user/"+t};return this.$http(n).success(function(t){var n=new e.User(t);o.resolve(n)}).error(function(e){return o.reject(e)}),o.promise},t.prototype.getPots=function(){var t=this.$q.defer(),o={method:"GET",url:this.API_URL+"/pot"};return this.$http(o).success(function(o){var n=[];angular.isArray(o)&&(o.forEach(function(t){var o=new e.Pot(t);n.push(o)}),t.resolve(n)),t.reject("Response is not an array")}).error(function(e){return t.reject(e)}),t.promise},t.prototype.getUserPots=function(t){var o=this.$q.defer(),n={method:"GET",url:this.API_URL+"/user/"+t+"/pot"};return this.$http(n).success(function(t){var n=[];angular.isArray(t)&&(t.forEach(function(t){var o=new e.Pot(t);n.push(o)}),o.resolve(n)),o.reject("Response is not an array")}).error(function(e){return o.reject(e)}),o.promise},t.prototype.createPot=function(e){var t=this.$q.defer(),o={method:"POST",url:this.API_URL+"/pot",data:e};return this.$http(o).success(function(e){t.resolve(e)}).error(function(e){return t.reject(e)}),t.promise},t}();angular.module("op.common").service("APIService",t)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.decorator("$exceptionHandler",["$delegate","$injector",function(e,t){return function(o,n){e(o,n);var i=t.get("$mdToast");i.show(i.simple().content(o.message).position("bottom right").hideDelay(3e3))}}])}e.$inject=["$provide"],angular.module("op.common").config(e)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(e){var t=function(){function e(e,t){void 0===e&&(e=0),void 0===t&&(t=0),this.lat=e,this.lng=t}return e}();e.Location=t,angular.module("op.common").constant("Location",t)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e,t,o,n,i,r){return{request:function(e){var o=t.get("SessionService"),n=o.tokenObject;return 0===e.url.indexOf(r)&&n&&(e.headers.Authorization="Bearer "+n.token),e}}}function t(t,o){o.setPrefix("op"),t.interceptors.push(e)}var o="event:bad-creditentals",n="event:auth-loginRequired",i="event:auth-forbidden";angular.module("op.common").constant("EVENT_BAD_CREDENTIALS",o).constant("EVENT_LOGIN_REQUIRED",n).constant("EVENT_AUTH_FORBIDDEN",i),e.$inject=["$rootScope","$injector","EVENT_BAD_CREDENTIALS","EVENT_LOGIN_REQUIRED","EVENT_AUTH_FORBIDDEN","API_URL"],t.$inject=["$httpProvider","localStorageServiceProvider"],angular.module("op.common").config(t)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t,o,n,i){this.AUTH_URL=e,this.$window=t,this.$http=o,this.$q=n,this.SessionService=i}return e.$inject=["AUTH_URL","$window","$http","$q","SessionService"],e.$inject=["AUTH_URL","$window","$http","$q","SessionService"],e.prototype.register=function(e){var t=this.$q.defer(),o={method:"POST",url:this.AUTH_URL+"/register",headers:{"Content-Type":"application/json"},data:e};return this.$http(o).success(function(e){t.resolve(e)}).error(function(e){return t.reject(e)}),t.promise},e.prototype.login=function(e,t){var o=this,n=this.$q.defer(),i=this.$window.btoa(e+":"+t),r={method:"POST",url:this.AUTH_URL+"/login",headers:{Authorization:"Basic "+i}};return this.$http(r).success(function(e){var t=e.token;o.SessionService.setUser(e),n.resolve(t)}).error(function(e){return n.reject(e)}),n.promise},e.prototype.logout=function(){this.SessionService.unsetUser()},e}();angular.module("op.common").service("AuthService",e)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(e){var t=function(){function e(e){this.setPot(e)}return e.prototype.setPot=function(e){this.id=e&&e.id,this.cook=e&&e.cook,this.consumer=e&&e.consumer,this.name=e&&e.name,this.description=e&&e.description,this.address=e&&e.address},e}();e.Pot=t,angular.module("op.common").constant("Pot",t)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var e=function(){function e(e,t,o,n){this.$q=e,this.localStorageService=t,this.APIService=o,this.user=n,this.key="user",this.tokenObject=t.get(this.key),this.tokenObject&&this.tokenObject.token&&(this.tokenObject.user?n.setUser(this.tokenObject.user):o.getUserData(this.tokenObject.token).then(function(e){n.setUser(e)}))}return e.$inject=["$q","localStorageService","APIService","user"],e.$inject=["$q","localStorageService","APIService","user"],e.prototype.setUser=function(e){this.tokenObject=e,this.localStorageService.set(this.key,e),this.user.setUser(e.user)},e.prototype.getUser=function(){var e=this.$q.defer();return e.resolve(this.user),e.promise},e.prototype.unsetUser=function(){this.localStorageService.remove(this.key),this.user.unsetUser()},e.prototype.loggedIn=function(){return!!this.user.email},e}();angular.module("op.common").service("SessionService",e)}(t=e.common||(e.common={}))}(op||(op={}));var __extends=this.__extends||function(e,t){function o(){this.constructor=e}for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);o.prototype=t.prototype,e.prototype=new o},op;!function(e){var t;!function(e){"use strict";var t=function(){function e(e,t){this.user=e,this.token=t}return e}();e.Token=t;var o=function(){function e(e){this.setUser(e)}return e.prototype.setUser=function(e){this.id=e&&e.id||"",this.email=e&&e.email||"",this.firstName=e&&e.firstName||"",this.lastName=e&&e.lastName||"",this.description=e&&e.description||"",this.phone=e&&e.phone||"",this.stars=e&&e.stars||1,this.following=e&&e.stars||[]},e.prototype.unsetUser=function(){this.id=this.email=this.firstName=this.lastName=this.description=this.phone=this.image="",this.stars=1,this.following=[]},e}();e.User=o;var n=function(e){function t(){e.apply(this,arguments)}return __extends(t,e),t}(o);e.RegisterUser=n,angular.module("op.common").constant("Token",t).constant("User",o)}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(e){"use strict";function t(){return o||(o=new e.User),o}var o;angular.module("op.common").constant("user",t())}(t=e.common||(e.common={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";var t=function(){function t(e,t,o,n,i,r,s,a){var l=this;this.$state=o,this.APIService=s,this.name="User Controller",t.debug(this.name),r.getUser().then(function(e){l.data=e,l.data.image="http://www.gravatar.com/avatar/"+i.createHash(l.data.email||"")+"?d=mm&s=200",l.getPots(l.data.id)}),r.loggedIn()||a.showDialog(null).then(function(e){t.debug(e),o.transitionTo("home")}),e.$watch("user.data.id",function(e){l.getPots(e)})}return t.$inject=["$scope","$log","$state","$stateParams","md5","SessionService","APIService","LoginDialogService"],t.$inject=["$scope","$log","$state","$stateParams","md5","SessionService","APIService","LoginDialogService"],t.prototype.getPots=function(e){var t=this;this.APIService.getUserPots(e).then(function(e){t.pots=e})},t.prototype.goToNewpot=function(){this.$state.transitionTo("user.newpot")},t.prototype.goToList=function(){this.$state.transitionTo("user.list"),this.getPots(this.data.id)},t.prototype.newPot=function(){var t=this,o=new e.common.Pot({name:this.newName,description:this.newDescription,address:this.newAddress});this.APIService.createPot(o).then(function(){t.$state.transitionTo("user.list")})},t}();angular.module("op.users").controller("UserController",t)}(t=e.users||(e.users={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.state("user.list",{url:"",templateUrl:"user.list.tpl.html",resolve:{},data:{onMenu:!1}})}e.$inject=["$stateProvider"],angular.module("op.users").config(e)}(t=e.users||(e.users={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.state("user.newpot",{templateUrl:"user.newpot.tpl.html",resolve:{},data:{onMenu:!1}})}e.$inject=["$stateProvider"],angular.module("op.users").config(e)}(t=e.users||(e.users={}))}(op||(op={}));var op;!function(e){var t;!function(){"use strict";function e(e){e.state("user",{url:"/user/:id","abstract":!0,templateUrl:"user.tpl.html",controller:"UserController",controllerAs:"user",resolve:{},data:{onMenu:!1}})}e.$inject=["$stateProvider"],angular.module("op.users").config(e)}(t=e.users||(e.users={}))}(op||(op={}));