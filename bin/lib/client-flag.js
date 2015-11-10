(function () {
    ;
    var root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;
    root.flag = 'this is a flag for test';
    root.setFlag = function () {
    };
    var _defaultSetting = {};
    var _get = function () {
    };
    var _set = function () {
    };
    var _reset = function () {
    };
    var _clear = function () {
    };
    var _setCookie = function (name, value, expires) {
        if (!name || !value) {
            return false;
        }
        else {
            root.document.cookie = name + '=' + value + (expires ? 'expires=' + expires : null);
            return true;
        }
    };
    var _getCookie = function (name) {
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
    var _setLocalStorage = function (name, value) {
        if (!name || !value) {
            return false;
        }
        else {
            root.localStorage.setItem(name, value);
            return true;
        }
    };
    var _getLocalStorage = function (name) {
        return name ? root.localStorage.getItem(name) : '';
    };
}());
//# sourceMappingURL=client-flag.js.map