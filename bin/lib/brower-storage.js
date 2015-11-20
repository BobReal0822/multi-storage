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
            this._setting = this._defaultSettings;
            if (settings) {
                for (var key in this._defaultSettings) {
                    settings[key] === undefined || typeof settings[key] === 'undefined' ? null : this._setting[key] = settings[key];
                }
            }
        }
        BrowerStorage.prototype.setItem = function (name, value) {
            console.log('in setItem:', name, value);
            if (!name || !value) {
                return false;
            }
            this._broadcast({ name: name, value: value }, function setItem() { console.log('test'); });
        };
        BrowerStorage.prototype.set = function (data) {
            var dataLength = Object.keys(data).length;
            if (dataLength == 1) {
            }
            else if (dataLength > 1) {
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
            console.log('in _broadcast:', data, func);
            console.log('this setting:', this._setting);
            for (var key in this._setting) {
                var _class = void 0;
                if (this._setting[key]) {
                    console.log('func', func);
                    console.log('Class', key);
                    switch (key) {
                        case 'cookie':
                            _class = new Cookie();
                            break;
                        case 'localStorage':
                            _class = new LocalStorage();
                            break;
                        case 'userData':
                            _class = new UserData();
                            break;
                        case 'flash':
                            _class = new Flash();
                            break;
                        case 'indexedDB':
                            _class = new IndexedDB();
                            break;
                        default:
                            _class = new Cookie();
                    }
                    for (var key_1 in _class) {
                        console.log('key in cookie:', key_1);
                        if (key_1 == func) {
                        }
                    }
                    console.log('has prop:', func.apply(_class, data));
                }
            }
        };
        return BrowerStorage;
    })();
    var LocalStorage = (function () {
        function LocalStorage(name, value) {
            name && value && this.set(name, value);
        }
        LocalStorage.prototype.set = function (name, value) {
            console.log('in LocalStorage set:', name, value);
            if (!name || !value) {
                return false;
            }
            else {
                root.localStorage.setItem(name, value);
                return true;
            }
        };
        LocalStorage.prototype.get = function (name) {
            console.log('in LocalStorage get:', name);
            return name ? root.localStorage.getItem(name) : '';
        };
        LocalStorage.prototype.clear = function () {
            console.log('in LocalStorage clear:');
            root.localStorage.clear();
        };
        LocalStorage.prototype.removeItem = function (name) {
            console.log('in LocalStorage removeItem:', name);
        };
        return LocalStorage;
    })();
    var Cookie = (function () {
        function Cookie(name, value, expires) {
            name && value && this.set(name, value);
        }
        Cookie.prototype.set = function (name, value, expires) {
            console.log('in Cookie set:', name, value);
            if (!name || !value) {
                return false;
            }
            else {
                root.document.cookie = name + '=' + value + (expires ? 'expires=' + expires : null);
                return true;
            }
        };
        Cookie.prototype.get = function (name) {
            console.log('in Cookie get:', name);
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
        Cookie.prototype.clear = function () {
            root.localStorage.clear();
        };
        Cookie.prototype.removeItem = function (name) {
        };
        return Cookie;
    })();
    var UserData = (function () {
        function UserData(setting) {
            setting ? this._setting = setting : null;
        }
        UserData.prototype.set = function (name, value) {
            console.log('in UserData set:', name, value);
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
            console.log('in UserData get:', name);
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
        UserData.prototype.clear = function () {
            console.log('in userData clear:');
            root.localStorage.clear();
        };
        UserData.prototype.removeItem = function (name) {
            console.log('in UserData removeItem:');
        };
        return UserData;
    })();
    var IndexedDB = (function () {
        function IndexedDB(setting) {
            setting ? this._settings = setting : null;
        }
        IndexedDB.prototype.set = function (name, value) {
            console.log('in IndexedDB set:', name, value);
        };
        IndexedDB.prototype.get = function (name) {
            console.log('in IndexedDB get:', name);
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
        IndexedDB.prototype.clear = function () {
            console.log('in IndexedDB clear:');
            root.localStorage.clear();
        };
        IndexedDB.prototype.removeItem = function (name) {
            console.log('in IndexedDB removeItem:');
        };
        return IndexedDB;
    })();
    ;
    var Flash = (function () {
        function Flash(setting) {
            setting ? this._setting = setting : null;
        }
        Flash.prototype.set = function (name, value) {
            console.log('in Flash set:', name, value);
        };
        Flash.prototype.get = function (name) {
            console.log('in Flash get:', name);
        };
        Flash.prototype.clear = function () {
            console.log('in Flash clear:');
            root.localStorage.clear();
        };
        Flash.prototype.removeItem = function (name) {
            console.log('in Flash removeItem:');
        };
        return Flash;
    })();
    root.BrowerStorage = BrowerStorage;
}());
//# sourceMappingURL=brower-storage.js.map