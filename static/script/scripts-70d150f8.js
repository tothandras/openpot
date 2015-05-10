/**
*	@author Andras Toth <andras.toth93@gmail.com>
*	@url https://github.com/tothandras/openpot
*	@license MIT
*/
angular.module("config",[]).constant("RELEASE",!0),angular.module("template",[]).run(["$templateCache",function(t){t.put("home.tpl.html",'<div class="home">\n    <img src="img/home.png" alt="" class="responsive-image">\n</div>\n'),t.put("login.tpl.html",'<md-dialog class="login">\n    <md-content>\n        <h3>Belépés</h3>\n        <form name="loginForm" novalidate>\n            <md-input-container>\n                <label for="email">Email</label>\n                <input id="email" type="email" name="email" ng-model="dialog.email" required>\n                <div ng-messages="loginForm.email.$error" ng-show="loginForm.email.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="password">Jelszó</label>\n                <input id="password" type="password" name="password" ng-model="dialog.password" minlength="8" required>\n                <div ng-messages="loginForm.password.$error" ng-show="loginForm.password.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                    <div ng-message="minlength">Túl rövid!</div>\n                </div>\n            </md-input-container>\n        </form>\n        <div class="error-container">\n            <span class="error" ng-show="dialog.error">Helytelen felhasználónév vagy jelszó.</span>\n        </div>\n    </md-content>\n    <div class="md-actions">\n        <md-button class="md-primary" ng-click="dialog.login()" ng-disabled="loginForm.$invalid">OK</md-button>\n        <md-button ng-click="dialog.closeDialog()">Mégse</md-button>\n    </div>\n</md-dialog>\n'),t.put("menu.tpl.html",'<div class="menu">\n    <md-sidenav md-component-id="left" class="md-sidenav-left">\n        <md-toolbar class="md-default-theme">\n        </md-toolbar>\n        <md-content class="md-padding">\n            <div layout="column">\n                <a ng-repeat="item in ::menu.items" class="md-button md-default-theme" ui-sref="{{ item.sref }}">\n                    {{ item.caption }}\n                </a>\n            </div>\n        </md-content>\n    </md-sidenav>\n</div>\n'),t.put("pots.tpl.html",'<div class="pots">\n    <div layout="row" class="row">\n        <div flex="35" class="info">\n            <ui-gmap-google-map options="pots.map.options" center=\'pots.map.center\' zoom=\'pots.map.zoom\' pan="true">\n                <ui-gmap-markers models="pots.markers" coords="\'self\'" icon="\'icon\'">\n                </ui-gmap-markers>\n            </ui-gmap-google-map>\n        </div>\n        <div ng-if="pots.pots.length === 0" class="no-pots" layout="row" layout-align="center center">\n            <h1>\n                Jelenleg egy szaftos fazék sincs a környéken.\n                <br/>\n                <span>Nézz vissza később!</span>\n            </h1>\n        </div>\n        <div flex class="list">\n            <md-content>\n                <form name="search" novalidate>\n                    <md-input-container>\n                        <label for="name">Név</label>\n                        <input id="name" type="text" ng-model="pots.search"/>\n                    </md-input-container>\n                </form>\n            </md-content>\n            <op-pot ng-repeat="pot in pots.pots | filter:pots.search track by pot.id"\n                    ng-mouseenter="pots.mouseEnter(pot.id)"\n                    ng-mouseleave="pots.mouseLeave(pot.id)"\n                    pot="pot">\n            </op-pot>\n        </div>\n    </div>\n</div>\n'),t.put("register.tpl.html",'<md-dialog class="register">\n    <md-content>\n        <h3>Regisztráció</h3>\n        <form name="registerForm" novalidate>\n            <md-input-container>\n                <label for="email">Email</label>\n                <input id="email" type="email" name="email" ng-model="dialog.email" required>\n                <div ng-messages="registerForm.email.$error" ng-show="registerForm.email.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="password">Jelszó</label>\n                <input id="password" type="password" name="password" ng-model="dialog.password" minlength="8" required>\n                <div ng-messages="registerForm.password.$error" ng-show="registerForm.password.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                    <div ng-message="minlength">Túl rövid!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="firstName">Keresztnév</label>\n                <input id="firstName" type="text" name="firstName" ng-model="dialog.firstName" required>\n                <div ng-messages="registerForm.firstName.$error" ng-show="registerForm.firstName.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n            <md-input-container>\n                <label for="lastName">Vezetéknév</label>\n                <input id="lastName" type="text" name="lastName" ng-model="dialog.lastName" required>\n                <div ng-messages="registerForm.lastName.$error" ng-show="registerForm.lastName.$dirty">\n                    <div ng-message="required">Kötelező megadni!</div>\n                </div>\n            </md-input-container>\n        </form>\n        <div class="error-container">\n            <span class="error" ng-show="dialog.error">Ez az email cím már használatban van.</span>\n        </div>\n    </md-content>\n    <div class="md-actions">\n        <md-button class="md-primary" ng-click="dialog.register()" ng-disabled="registerForm.$invalid">OK</md-button>\n        <md-button ng-click="dialog.closeDialog()">Mégse</md-button>\n    </div>\n</md-dialog>\n'),t.put("toolbar.tpl.html",'<div class="toolbar">\n    <md-toolbar class="md-default-theme" layout="row">\n        <h1 class="md-toolbar-tools">\n            <i class="fa fa-bars" ng-click="toolbar.toggleMenu()"/>\n            <p>OpenPot</p>\n            <p>{{this.user.email}}</p>\n        </h1>\n        <h1 class="md-toolbar-tools" layout="row" layout-align="end center">\n            <p ng-if="!toolbar.user.email">\n                <span class="link" ng-click="toolbar.openRegistrationDialog($event)">Regisztráció</span>\n                <span class="link" ng-click="toolbar.openLoginDialog($event)">Belépés</span>\n            </p>\n            <p ng-if="!!toolbar.user.email">\n                <span>{{toolbar.user.firstName}}</span>\n                <i class="fa fa-caret-down" ng-class="{\'fa-rotate-180\': toolbar.dropdown}" ng-click="toolbar.toggleDropdown()"></i>\n            </p>\n        </h1>\n    </md-toolbar>\n    <div ng-show="toolbar.dropdown" class="dropdown md-whiteframe-z1">\n        <ul>\n            <li ng-click="toolbar.goToUser()">Felhasználó</li>\n            <li ng-click="toolbar.newPot()">Új hirdetés</li>\n            <li ng-click="toolbar.logout()">Kijelentkezés</li>\n        </ul>\n    </div>\n</div>\n'),t.put("pot.tpl.html",'<md-card class="pot sm">\n    <h2 ng-click="pot.toggleDescription()">{{pot.pot.name}}</h2>\n    <section class="details" ng-show="pot.showDescription">\n        <p>{{pot.pot.description}}</p>\n        <div class="img-container">\n            <img ng-src="{{pot.gravatar(pot.user.email)}}" alt="" class="circle responsive-image"/>\n        </div>\n    </section>\n</md-card>\n\n'),t.put("user.list.tpl.html",'<div class="list">\n    <div layout="row" layout-wrap>\n        <div class="wrapper" ng-repeat="pot in user.pots track by pot.id" flex="50">\n            <md-card class="pot">\n                <div class="image" ng-style="{\'background-image\':\'url({{user.S3.url + pot.id + \'.jpg\'}})\'}"></div>\n                <div class="text">\n                    <h2>{{pot.name}}</h2>\n                    <p>\n                        {{pot.description}} - {{pot.address}}\n                    </p>\n                </div>\n                <md-button class="delete-button" ng-click="user.deletePot(pot.id, $event)">\n                    <i class="fa fa-times"></i>\n                </md-button>\n            </md-card>\n        </div>\n    </div>\n    <md-button class="md-fab" aria-label="Add new" ng-click="user.goToNewpot()" ng-show="user.myUser">\n        <i class="fa fa-plus"></i>\n    </md-button>\n</div>\n'),t.put("user.newpot.tpl.html",'<div class="new-pot">\n    <h1>\n        <span>Új hírdetés</span>\n    </h1>\n    <section class="form">\n        <div layout="row" class="row">\n            <md-content flex="60">\n                <form name="newpotForm" novalidate>\n                    <md-input-container>\n                        <label for="newName">Név</label>\n                        <input id="newName" type="text" name="newName" ng-model="user.newName" required>\n\n                        <div ng-messages="newpotForm.newName.$error" ng-show="newpotForm.newName.$dirty">\n                            <div ng-message="required">Kötelező megadni!</div>\n                        </div>\n                    </md-input-container>\n                    <md-input-container>\n                        <label for="newDescription">Leírás</label>\n                        <input id="newDescription" type="text" name="newDescription" ng-model="user.newDescription"\n                               minlength="20" required>\n\n                        <div ng-messages="newpotForm.newDescription.$error" ng-show="newpotForm.newDescription.$dirty">\n                            <div ng-message="required">Kötelező megadni!</div>\n                            <div ng-message="minlength">Túl rövid!</div>\n                        </div>\n                    </md-input-container>\n                    <md-input-container>\n                        <label for="newAddress">Cím</label>\n                        <input id="newAddress" type="text" name="newAddress" ng-model="user.newAddress" required>\n\n                        <div ng-messages="newpotForm.newAddress.$error" ng-show="newpotForm.newAddress.$dirty">\n                            <div ng-message="required">Kötelező megadni!</div>\n                        </div>\n                    </md-input-container>\n                </form>\n                <div class="error-container">\n                    <span class="error" ng-show="user.error">Helytelen adatok.</span>\n                </div>\n            </md-content>\n            <div class="drop-box" flex ngf-drop ngf-select ng-model="user.newImage"\n                 ngf-change="user.fileDropped($files, $event, $rejectedFiles)"\n                 ngf-drag-over-class="dragover"\n                 ngf-accept="\'image/*\'"\n                 ngf-max-size=\'100000000\'>\n                <i class="fa fa-camera fa-2x"></i>\n                <div class="image-container">\n                    <img ngf-src="user.newImage[0]" ngf-accept="\'image/*\'">\n                </div>\n            </div>\n        </div>\n\n        <div class="md-actions">\n            <md-button class="md-primary" ng-click="user.newPot()" ng-disabled="newpotForm.$invalid || !user.newImage">OK</md-button>\n        </div>\n    </section>\n\n    <md-button class="md-fab" aria-label="Go back" ng-click="user.goToList()">\n        <i class="fa fa-minus"></i>\n    </md-button>\n</div>\n'),t.put("user.tpl.html",'<div class="user">\n    <div layout="row" class="row">\n        <div flex="25" class="info">\n            <div class="img-container">\n                <img ng-src="{{::user.data.image}}" alt="" class="circle responsive-image"/>\n            </div>\n            <h2 class="firstName">{{::user.data.firstName}}</h2>\n\n            <h3 class="lastName">{{::user.data.lastName}}</h3>\n\n            <div ng-switch on="user.data.stars">\n                <p ng-switch-when="0">\n                    <i class="fa fa-star-o"></i>\n                </p>\n\n                <p ng-switch-default>\n                    <i class="fa fa-star" ng-repeat="star in app.range(user.data.stars)"></i>\n                </p>\n            </div>\n        </div>\n        <div flex class="subview" ui-view></div>\n    </div>\n</div>\n')}]);var op;!function(){"use strict";angular.module("op",["ngMaterial","ngMessages","template","config","op.common","op.home","op.pots","op.toolbar","op.users","ui.router"])}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.common",["ngMaterial","LocalStorageModule","ngFileUpload"])}(e=t.toolbar||(t.toolbar={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.home",["ui.router"])}(e=t.home||(t.home={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.login",["op.common","ui.router"])}(e=t.login||(t.login={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.menu",["ui.router"])}(e=t.menu||(t.menu={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.pots",["op.common","ui.router","uiGmapgoogle-maps"])}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.register",["op.common","ui.router"])}(e=t.register||(t.register={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.toolbar",["ngMaterial","op.menu","op.login","op.register","ui.router"])}(e=t.toolbar||(t.toolbar={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";angular.module("op.users",["op.common","ui.router","angular-md5"])}(e=t.users||(t.users={}))}(op||(op={}));var op;!function(){"use strict";function t(t,e,o,n,i){t.html5Mode(!0),e.otherwise("/"),o.debugInfoEnabled(!i),n.debugEnabled(!i)}t.$inject=["$locationProvider","$urlRouterProvider","$compileProvider","$logProvider","RELEASE"],angular.module("op").config(t)}(op||(op={}));var op;!function(){"use strict";var t=function(){function t(t){var e=this;this.name="App Controller",this.titlePrefix="OpenPot",this.title="OpenPot",t.$on("$stateChangeSuccess",function(t,o){angular.isDefined(o.data.title)&&(e.title=e.titlePrefix+" | "+o.data.title)})}return t.$inject=["$scope","$log"],t.$inject=["$scope","$log"],t.prototype.range=function(t){return new Array(t)},t}();angular.module("op").controller("AppController",t)}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t="/api",e="/auth";angular.module("op.common").constant("API_URL",t).constant("AUTH_URL",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t){this.name="Home Controller",t.debug(this.name)}return t.$inject=["$log"],t.$inject=["$log"],t}();angular.module("op.home").controller("HomeController",t)}(e=t.home||(t.home={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.state("home",{url:"/",templateUrl:"home.tpl.html",controller:"HomeController",controllerAs:"home",data:{onMenu:!0,caption:"Főoldal",icon:null}})}t.$inject=["$stateProvider"],angular.module("op.home").config(t)}(e=t.home||(t.home={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o,n,i){this.AuthService=t,this.SessionService=e,this.$state=o,this.LoginDialogService=n,this.$log=i,this.name="Login Controller",i.debug(this.name)}return t.$inject=["AuthService","SessionService","$state","LoginDialogService","$log"],t.$inject=["AuthService","SessionService","$state","LoginDialogService","$log"],t.prototype.login=function(){var t=this;this.error=null,this.AuthService.login(this.email,this.password).then(function(e){t.$log.debug(e),t.LoginDialogService.closeDialog()},function(e){t.error=e})},t.prototype.logout=function(){this.SessionService.loggedIn()&&(this.AuthService.logout(),this.LoginDialogService.closeDialog(),this.$state.go("home"))},t.prototype.closeDialog=function(){this.LoginDialogService.closeDialog()},t}();angular.module("op.login").controller("LoginController",t)}(e=t.login||(t.login={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e){this.$log=t,this.$mdDialog=e}return t.$inject=["$log","$mdDialog"],t.$inject=["$log","$mdDialog"],t.prototype.showDialog=function(t){return this.$mdDialog.show({parent:angular.element(document.body),targetEvent:t,templateUrl:"login.tpl.html",controller:"LoginController as dialog"})},t.prototype.closeDialog=function(){return this.$mdDialog.hide()},t}();angular.module("op.login").service("LoginDialogService",t)}(e=t.login||(t.login={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o){var n=this;this.$mdSidenav=t,this.name="Menu Controller",this.items=o.getMenuItems(),e.$on("$stateChangeStart",function(){n.close()})}return t.$inject=["$mdSidenav","$rootScope","MenuService"],t.$inject=["$mdSidenav","$rootScope","MenuService"],t.prototype.close=function(){this.$mdSidenav("left").close()},t}();angular.module("op.menu").controller("MenuController",t)}(e=t.menu||(t.menu={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(){this.restrict="E",this.scope={},this.controller="MenuController",this.controllerAs="menu",this.bindToController=!0,this.templateUrl="menu.tpl.html",this.transclude=!1,this.replace=!0}return t.instance=function(){return new t},t}();angular.module("op.menu").directive("opMenu",t.instance)}(e=t.menu||(t.menu={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e){this.$log=t,this.$state=e}return t.$inject=["$log","$state"],t.$inject=["$log","$state"],t.prototype.getMenuItems=function(){for(var t=[],e=this.$state.get(),o=1;o<e.length;o++){var n=e[o],i=n.data;i.onMenu&&t.push({caption:null!=i?i.caption:n.name,sref:n.name,icon:null!=i?i.icon:null})}return this.$log.debug(t),t},t}();angular.module("op.menu").service("MenuService",t)}(e=t.menu||(t.menu={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.configure({v:"3.17",libraries:"geometry,visualization"})}t.$inject=["uiGmapGoogleMapApiProvider"],angular.module("op.pots").config(t)}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var e=function(){function e(t,e,o,n){var i=this;this.name="Pots Controller",this.pots=[],this.markers=[],t.debug(this.name),n.then(function(t){i.map={center:o.getLastLocation(),zoom:12,options:{disableDefaultUI:!0,zoomControl:!0,zoomControlOptions:{style:t.ZoomControlStyle.SMALL,position:t.ControlPosition.LEFT_BOTTOM},streetViewControl:!0}},o.getLocation().then(function(t){i.map.center=t})}),e.getPots().then(function(t){i.pots=t,t.forEach(function(t){o.geocode(t.address).then(function(e){var o={id:t.id,latitude:e.latitude,longitude:e.longitude,title:t.name};i.markers.push(o)})})})}return e.$inject=["$log","APIService","LocationService","uiGmapGoogleMapApi"],e.$inject=["$log","APIService","LocationService","uiGmapGoogleMapApi"],e.prototype.mouseEnter=function(e){for(var o=0;o<this.markers.length;o++){var n=this.markers[o];n.id===e&&(this.map.center=new t.common.Location(n.latitude,n.longitude))}},e}();angular.module("op.pots").controller("PotsController",e)}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.state("pots",{url:"/pots",templateUrl:"pots.tpl.html",controller:"PotsController",controllerAs:"pots",data:{onMenu:!0,caption:"Böngészés",icon:null}})}t.$inject=["$stateProvider"],angular.module("op.pots").config(t)}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var e=function(){function e(t,e,o,n){this.$state=t,this.RegisterDialogService=e,this.AuthService=o,this.$log=n,this.name="Register Controller",n.debug(this.name)}return e.$inject=["$state","RegisterDialogService","AuthService","$log"],e.$inject=["$state","RegisterDialogService","AuthService","$log"],e.prototype.register=function(){var e=this;this.error=null;var o=new t.common.RegisterUser;o.email=this.email,o.password=this.password,o.firstName=this.firstName,o.lastName=this.lastName,this.AuthService.register(o).then(function(t){e.$log.debug(t),e.closeDialog()},function(t){e.error=t})},e.prototype.closeDialog=function(){this.RegisterDialogService.closeDialog()},e}();angular.module("op.register").controller("RegisterController",e)}(e=t.register||(t.register={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e){this.$log=t,this.$mdDialog=e}return t.$inject=["$log","$mdDialog"],t.$inject=["$log","$mdDialog"],t.prototype.showDialog=function(t){this.$mdDialog.show({parent:angular.element(document.body),targetEvent:t,templateUrl:"register.tpl.html",controller:"RegisterController as dialog"})},t.prototype.closeDialog=function(){this.$mdDialog.hide()},t}();angular.module("op.register").service("RegisterDialogService",t)}(e=t.register||(t.register={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o,n,i,r){var s=this;this.$log=t,this.$mdSidenav=e,this.$state=o,this.LoginDialogService=n,this.RegisterDialogService=i,this.SessionService=r,this.name="Toolbar Controller",this.dropdown=!1,r.getUser().then(function(t){s.user=t})}return t.$inject=["$log","$mdSidenav","$state","LoginDialogService","RegisterDialogService","SessionService"],t.$inject=["$log","$mdSidenav","$state","LoginDialogService","RegisterDialogService","SessionService"],t.prototype.toggleMenu=function(){this.$mdSidenav("left").toggle()},t.prototype.openRegistrationDialog=function(t){this.RegisterDialogService.showDialog(t)},t.prototype.openLoginDialog=function(t){this.LoginDialogService.showDialog(t)},t.prototype.goToUser=function(){this.dropdown=!1,this.$state.transitionTo("user.list")},t.prototype.newPot=function(){this.dropdown=!1,this.$state.transitionTo("user.newpot")},t.prototype.logout=function(){this.dropdown=!1,this.SessionService.unsetUser()},t.prototype.toggleDropdown=function(){this.dropdown=!this.dropdown},t}();angular.module("op.toolbar").controller("ToolbarController",t)}(e=t.toolbar||(t.toolbar={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(){this.restrict="E",this.scope={},this.controller="ToolbarController",this.controllerAs="toolbar",this.bindToController=!0,this.templateUrl="toolbar.tpl.html",this.transclude=!1,this.replace=!0}return t.instance=function(){return new t},t}();angular.module("op.toolbar").directive("opToolbar",t.instance)}(e=t.toolbar||(t.toolbar={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t,e,o){t.$on("$stateChangeSuccess",function(){e.ga&&e.ga("send","pageview",{page:o.path()})})}t.$inject=["$rootScope","$window","$location"],angular.module("op.common").run(t)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){"use strict";var e=function(){function e(t,e,o,n,i,r){this.$http=t,this.$q=e,this.$log=o,this.API_URL=n,this.Upload=i,this.S3=r}return e.$inject=["$http","$q","$log","API_URL","Upload","S3"],e.$inject=["$http","$q","$log","API_URL","Upload","S3"],e.prototype.getUserData=function(e){var o=this.$q.defer(),n={method:"GET",url:this.API_URL+"/user/"+e};return this.$http(n).success(function(e){var n=new t.User(e);o.resolve(n)}).error(function(t){return o.reject(t)}),o.promise},e.prototype.getPots=function(){var e=this.$q.defer(),o={method:"GET",url:this.API_URL+"/pot"};return this.$http(o).success(function(o){var n=[];angular.isArray(o)&&(o.forEach(function(e){var o=new t.Pot(e);n.push(o)}),e.resolve(n)),e.reject("Response is not an array")}).error(function(t){return e.reject(t)}),e.promise},e.prototype.getUserPots=function(e){var o=this.$q.defer(),n={method:"GET",url:this.API_URL+"/user/"+e+"/pot"};return this.$http(n).success(function(e){var n=[];angular.isArray(e)&&(e.forEach(function(e){var o=new t.Pot(e);n.push(o)}),o.resolve(n)),o.reject("Response is not an array")}).error(function(t){return o.reject(t)}),o.promise},e.prototype.createPot=function(t){var e=this,o=this.$q.defer(),n={method:"POST",url:this.API_URL+"/pot",data:t};return this.$http(n).success(function(n){var i=n+"."+t.image.name.split(".").pop();e.Upload.upload({url:e.S3.url,method:"POST",fields:{key:i,AWSAccessKeyId:e.S3.key,acl:e.S3.acl,policy:e.S3.policy,signature:e.S3.signature,"Content-Type":t.image.type,filename:i},file:t.image}).then(function(){o.resolve(n)},function(t){e.deletePot(n),o.reject(t)})}).error(function(t){return o.reject(t)}),o.promise},e.prototype.deletePot=function(t){var e=this.$q.defer(),o={method:"DELETE",url:this.API_URL+"/pot/"+t};return this.$http(o).success(function(t){e.resolve(t)}).error(function(t){return e.reject(t)}),e.promise},e.prototype.upload=function(){var t=this.$q.defer();return t.promise},e}();angular.module("op.common").service("APIService",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){var e=function(){function t(t,e,o){var n=this,i={method:"GET",url:o+"/s3policy"};e(i).success(function(t){n.policy=t.policy,n.signature=t.signature,n.key=t.key,n.url=t.url}),this.acl="public-read"}return t.$inject=["$log","$http","API_URL"],t.$inject=["$log","$http","API_URL"],t}();t.S3=e,angular.module("op.common").service("S3",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.decorator("$exceptionHandler",["$delegate","$injector",function(t,e){return function(o,n){t(o,n);var i=e.get("$mdToast");i.show(i.simple().content(o.message).position("bottom right").hideDelay(3e3))}}])}t.$inject=["$provide"],angular.module("op.common").config(t)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){"use strict";var e=function(){function t(t){this.md5=t}return t.$inject=["md5"],t.$inject=["md5"],t.prototype.gravatar=function(t){return"http://www.gravatar.com/avatar/"+this.md5.createHash(t||"")+"?d=mm&s=200"},t}();t.GravatarService=e,angular.module("op.common").service("GravatarService",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){var e=function(){function t(t,e){void 0===t&&(t=0),void 0===e&&(e=0),this.latitude=t,this.longitude=e}return t}();t.Location=e,angular.module("op.common").constant("Location",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(e){"use strict";var o=function(){function o(t,o,n,i,r){var s=this;this.$log=t,this.$q=o,this.localStorageService=n,this.uiGmapGoogleMapApi=i,this.location=new e.Location,this.key="lastLocation",this.deferred=o.defer(),"geolocation"in r.navigator?(this.geolocation=r.navigator.geolocation,this.geolocation.getCurrentPosition(function(t){return s.success(t)},function(){return s.error()})):this.error()}return o.$inject=["$log","$q","localStorageService","uiGmapGoogleMapApi","$window"],o.$inject=["$log","$q","localStorageService","uiGmapGoogleMapApi","$window"],o.prototype.success=function(t){this.location.latitude=t.coords.latitude,this.location.longitude=t.coords.longitude,this.localStorageService.set(this.key,this.location),this.deferred.resolve(this.location)},o.prototype.error=function(){var t="Unable to retrieve the user's location";this.$log.error(t),this.deferred.reject(t)},o.prototype.getLocation=function(){return this.deferred.promise},o.prototype.getLastLocation=function(){return this.localStorageService.get(this.key)},o.prototype.geocode=function(e){var o=this.$q.defer();return this.uiGmapGoogleMapApi.then(function(n){var i=new n.Geocoder;i.geocode({address:e},function(e,i){if(i===n.GeocoderStatus.OK){var r=new t.common.Location(e[0].geometry.location.lat(),e[0].geometry.location.lng());o.resolve(r)}else o.reject()})}),o.promise},o}();angular.module("op.common").service("LocationService",o)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t,e,o,n,i,r,s){return{request:function(t){var o=e.get("SessionService"),n=o.tokenObject;return 0===t.url.indexOf(r)&&n&&(t.headers.Authorization="Bearer "+n.token),t},response:function(t){return t},responseError:function(e){switch(e.status){case 400:t.$broadcast(o,e);break;case 401:t.$broadcast(n,e);break;case 403:t.$broadcast(i,e)}return s.reject(e)}}}function e(e,o){o.setPrefix("op"),e.interceptors.push(t)}var o="event:bad-creditentals",n="event:auth-loginRequired",i="event:auth-forbidden";angular.module("op.common").constant("EVENT_BAD_CREDENTIALS",o).constant("EVENT_LOGIN_REQUIRED",n).constant("EVENT_AUTH_FORBIDDEN",i),t.$inject=["$rootScope","$injector","EVENT_BAD_CREDENTIALS","EVENT_LOGIN_REQUIRED","EVENT_AUTH_FORBIDDEN","API_URL","$q"],e.$inject=["$httpProvider","localStorageServiceProvider"],angular.module("op.common").config(e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o,n,i){this.AUTH_URL=t,this.$window=e,this.$http=o,this.$q=n,this.SessionService=i}return t.$inject=["AUTH_URL","$window","$http","$q","SessionService"],t.$inject=["AUTH_URL","$window","$http","$q","SessionService"],t.prototype.register=function(t){var e=this.$q.defer(),o={method:"POST",url:this.AUTH_URL+"/register",headers:{"Content-Type":"application/json"},data:t};return this.$http(o).success(function(t){e.resolve(t)}).error(function(t){return e.reject(t)}),e.promise},t.prototype.login=function(t,e){var o=this,n=this.$q.defer(),i=this.$window.btoa(t+":"+e),r={method:"POST",url:this.AUTH_URL+"/login",headers:{Authorization:"Basic "+i}};return this.$http(r).success(function(t){var e=t.token;o.SessionService.setUser(t),n.resolve(e)}).error(function(t){return n.reject(t)}),n.promise},t.prototype.logout=function(){this.SessionService.unsetUser()},t}();angular.module("op.common").service("AuthService",t)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){var e=function(){function t(t){this.setPot(t)}return t.prototype.setPot=function(t){this.id=t&&t.id,this.cook=t&&t.cook,this.consumer=t&&t.consumer,this.name=t&&t.name,this.description=t&&t.description,this.address=t&&t.address,this.image=t&&t.image},t}();t.Pot=e,angular.module("op.common").constant("Pot",e)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o,n,i,r,s){var a=this;this.$rootScope=t,this.$state=e,this.$q=o,this.localStorageService=n,this.APIService=i,this.user=r,this.EVENT_LOGIN_REQUIRED=s,this.key="user",this.tokenObject=n.get(this.key),this.tokenObject&&this.tokenObject.token&&(this.tokenObject.user?r.setUser(this.tokenObject.user):i.getUserData(this.tokenObject.token).then(function(t){r.setUser(t)})),t.$on(s,function(){return a.unsetUser()})}return t.$inject=["$rootScope","$state","$q","localStorageService","APIService","user","EVENT_LOGIN_REQUIRED"],t.$inject=["$rootScope","$state","$q","localStorageService","APIService","user","EVENT_LOGIN_REQUIRED"],t.prototype.setUser=function(t){this.tokenObject=t,this.localStorageService.set(this.key,t),this.user.setUser(t.user)},t.prototype.getUser=function(){var t=this.$q.defer();return t.resolve(this.user),t.promise},t.prototype.unsetUser=function(){this.localStorageService.remove(this.key),this.user.unsetUser(),this.$state.transitionTo("home")},t.prototype.loggedIn=function(){return!!this.user.email},t}();angular.module("op.common").service("SessionService",t)}(e=t.common||(t.common={}))}(op||(op={}));var __extends=this.__extends||function(t,e){function o(){this.constructor=t}for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);o.prototype=e.prototype,t.prototype=new o},op;!function(t){var e;!function(t){"use strict";var e=function(){function t(t,e){this.user=t,this.token=e}return t}();t.Token=e;var o=function(){function t(t){this.setUser(t)}return t.prototype.setUser=function(t){this.id=t&&t.id||"",this.email=t&&t.email||"",this.firstName=t&&t.firstName||"",this.lastName=t&&t.lastName||"",this.description=t&&t.description||"",this.phone=t&&t.phone||"",this.stars=t&&t.stars||1,this.following=t&&t.stars||[]
},t.prototype.unsetUser=function(){this.id=this.email=this.firstName=this.lastName=this.description=this.phone=this.image="",this.stars=1,this.following=[]},t}();t.User=o;var n=function(t){function e(){t.apply(this,arguments)}return __extends(e,t),e}(o);t.RegisterUser=n,angular.module("op.common").constant("Token",e).constant("User",o)}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(t){"use strict";function e(){return o||(o=new t.User),o}var o;angular.module("op.common").constant("user",e())}(e=t.common||(t.common={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(t,e,o){this.GravatarService=e,this.APIService=o,this.showDescription=!1}return t.$inject=["$log","GravatarService","APIService"],t.$inject=["$log","GravatarService","APIService"],t.prototype.toggleDescription=function(){var t=this;this.showDescription=!this.showDescription,this.showDescription&&!angular.isDefined(this.user)&&this.APIService.getUserData(this.pot.cook).then(function(e){t.user=e})},t.prototype.gravatar=function(t){return this.GravatarService.gravatar(t)},t}();angular.module("op.pots").controller("PotController",t)}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var t=function(){function t(){this.restrict="E",this.scope={pot:"="},this.controller="PotController",this.controllerAs="pot",this.bindToController=!0,this.templateUrl="pot.tpl.html",this.transclude=!1}return t.instance=function(){return new t},t}();angular.module("op.pots").directive("opPot",t.instance)}(e=t.pots||(t.pots={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";var e=function(){function e(t,e,o,n,i,r,s,a,l){var c=this;this.$log=t,this.$state=e,this.$mdDialog=n,this.APIService=s,this.S3=l,this.name="User Controller";var u=o.id;r.getUser().then(function(t){c.myUser=""===u||t.id===u,c.myUser?(r.getUser().then(function(t){c.data=t,c.data.image="http://www.gravatar.com/avatar/"+i.createHash(c.data.email||"")+"?d=mm&s=200",c.getPots(c.data.id)}),r.loggedIn()||a.showDialog(null).then(function(){e.transitionTo("home")})):s.getUserData(u).then(function(t){c.data=t,c.data.image="http://www.gravatar.com/avatar/"+i.createHash(c.data.email||"")+"?d=mm&s=200",c.getPots(c.data.id)},function(){return c.$state.transitionTo("home")})})}return e.$inject=["$log","$state","$stateParams","$mdDialog","md5","SessionService","APIService","LoginDialogService","S3"],e.$inject=["$log","$state","$stateParams","$mdDialog","md5","SessionService","APIService","LoginDialogService","S3"],e.prototype.getPots=function(t){var e=this;this.APIService.getUserPots(t).then(function(t){e.pots=t})},e.prototype.goToNewpot=function(){this.$state.transitionTo("user.newpot")},e.prototype.goToList=function(){this.$state.transitionTo("user.list"),this.getPots(this.data.id)},e.prototype.newPot=function(){var e=this,o=new t.common.Pot({name:this.newName,description:this.newDescription,address:this.newAddress,image:this.newImage[0]});this.APIService.createPot(o).then(function(){e.$state.transitionTo("user.list"),e.getPots(e.data.id),e.newName="",e.newDescription="",e.newAddress="",e.newImage=null})},e.prototype.deletePot=function(t,e){var o=this;this.$mdDialog.show(this.$mdDialog.confirm().title("Törlés").content("Biztosan törölni szeretné?").ok("Igen").cancel("Mégse").targetEvent(e)).then(function(){o.APIService.deletePot(t).then(function(){for(var e=0;e<o.pots.length;e++)o.pots[e].id===t&&o.pots.splice(e,1)},function(t){o.$log.debug(t)})})},e.prototype.fileDropped=function(t,e,o){this.$log.debug(t),this.$log.debug(o)},e}();angular.module("op.users").controller("UserController",e)}(e=t.users||(t.users={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.state("user.list",{url:"",templateUrl:"user.list.tpl.html",resolve:{},data:{onMenu:!1}})}t.$inject=["$stateProvider"],angular.module("op.users").config(t)}(e=t.users||(t.users={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.state("user.newpot",{templateUrl:"user.newpot.tpl.html",resolve:{},data:{onMenu:!1}})}t.$inject=["$stateProvider"],angular.module("op.users").config(t)}(e=t.users||(t.users={}))}(op||(op={}));var op;!function(t){var e;!function(){"use strict";function t(t){t.state("user",{url:"/user/:id","abstract":!0,templateUrl:"user.tpl.html",controller:"UserController",controllerAs:"user",resolve:{},data:{onMenu:!1}})}t.$inject=["$stateProvider"],angular.module("op.users").config(t)}(e=t.users||(t.users={}))}(op||(op={}));