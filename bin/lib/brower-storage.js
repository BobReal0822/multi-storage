/**
 *
 * @author ephoton
 * @link https://github.com/ephoton/client-flag
 */
(function () {
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;
    var BrowerStorage = (function () {
        function BrowerStorage(settings) {
            this._config = {
                flagName: 'flagId',
                userData: {
                    type: 'div',
                    className: 'client-flag'
                },
                indexedDb: {
                    dbName: 'browerStorage',
                    tableName: 'flagTable'
                }
            };
            this._defaultSettings = {
                cookie: true,
                localStorage: true,
                userData: true,
                flash: true,
                indexedDB: true
            };
            settings ? function () {
                for (var key in this._defaultSettings) {
                    this._setting[key] = !!settings[key] ? settings[key] : this._defaultSettings[key];
                }
            }() : this._setting = this._defaultSettings;
        }
        BrowerStorage.prototype.setItem = function (name, value) {
            if (!name || !value) {
                return false;
            }
            this._broadcast({ name: name, value: value }, 'setItem');
        };
        BrowerStorage.prototype.set = function (data) {
            var dataLength = Object.keys(data).length;
            if (dataLength == 1) {
                this._broadcast(data, 'set');
            }
            else if (dataLength > 1) {
                this._broadcast(data, 'setItem');
            }
            return false;
        };
        BrowerStorage.prototype.getItem = function () {
        };
        BrowerStorage.prototype.get = function () {
        };
        BrowerStorage.prototype.clear = function () {
        };
        BrowerStorage.prototype.removeItem = function (name) {
        };
        BrowerStorage.prototype._broadcast = function (data, func) {
            for (var key in this._setting) {
                if (this._setting[key]) {
                    var storageClass = key[0].toUpperCase() + key.substring(1, key.length);
                    storageClass.func.apply(this, data);
                }
            }
        };
        return BrowerStorage;
    })();
    var LocalStorage = (function () {
        function LocalStorage(name, value) {
            this.set(name, value);
        }
        LocalStorage.prototype.set = function (name, value) {
            if (!name || !value) {
                return false;
            }
            else {
                root.localStorage.setItem(name, value);
                return true;
            }
        };
        LocalStorage.prototype.get = function (name) {
            return name ? root.localStorage.getItem(name) : '';
        };
        LocalStorage.prototype.clear = function () {
            root.localStorage.clear();
        };
        return LocalStorage;
    })();
    var Cookie = (function () {
        function Cookie(name, value, expires) {
            this.set(name, value);
        }
        Cookie.prototype.set = function (name, value, expires) {
            if (!name || !value) {
                return false;
            }
            else {
                root.document.cookie = name + '=' + value + (expires ? 'expires=' + expires : null);
                return true;
            }
        };
        Cookie.prototype.get = function (name) {
            var cookie = root.document.cookie, value = '', nameIndex, valueIndex;
            if (cookie.length > 0) {
                nameIndex = cookie.indexOf(name + '=');
                if (nameIndex > -1) {
                    valueIndex = cookie.indexOf(';', nameIndex);
                    value = valueIndex > -1 ? cookie.substring(nameIndex + name.length + 1, valueIndex) : '';
                }
            }
            return value;
        };
        return Cookie;
    })();
    var UserData = (function () {
        function UserData(setting) {
            this._setting = setting;
        }
        UserData.prototype.set = function (name, value) {
            if (name && value) {
                try {
                    var element = root.document.createElement(this._setting.elementName);
                    element.style.visibility = "hidden";
                    element.setAttribute("class", name);
                    document.body.appendChild(element);
                    element.style.behavior = "url(#default#userData)";
                    element.setAttribute(name, value);
                    element.save(name);
                    return true;
                }
                catch (error) {
                    console.log('setUserData error', error);
                    return false;
                }
            }
            return false;
        };
        UserData.prototype.get = function (name) {
            try {
                var element = root.document.getElementsByClassName(this._setting.className);
                element.load(name);
                return element.getAttribute(name) || '';
            }
            catch (error) {
                console.log('error in getFlashCookie', error);
                return '';
            }
        };
        return UserData;
    })();
    var IndexedDB = (function () {
        function IndexedDB(setting) {
            this._settings = setting;
        }
        IndexedDB.prototype.set = function (name, value) {
        };
        IndexedDB.prototype.get = function (name) {
            var localIndexedDB = root.indexedDB = root.indexedDB || root.mozIndexedDB || root.webkitIndexedDB || window.msIndexedDB;
            var dbRequest = localIndexedDB.open(this._settings.dbName);
            dbRequest.onerror = function (event) {
                console.log('error in setIindexedDB:', event);
            };
            dbRequest.onupgradeneeded = function (event) {
                var db = event.target.result;
                var store = db.createObjectStore(this._settings.tableName, {
                    keyPath: "name",
                    unique: false
                });
            };
        };
        return IndexedDB;
    })();
    ;
    var Flash = (function () {
        function Flash(setting) {
            this._setting = setting;
        }
        Flash.prototype.set = function () {
        };
        Flash.prototype.get = function () {
        };
        return Flash;
    })();
    root.BrowerStorage = BrowerStorage;
}());
//# sourceMappingURL=brower-storage.js.map