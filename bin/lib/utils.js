/**
 * utils for tiny-form
 */
var MAX_SAFE_NUMBER = Math.pow(2, 53) - 1;
var HOP = Object.prototype.hasOwnProperty;
function each(object, iteratee) {
    if (isArrayLike(object)) {
        for (var index = 0, length_1 = object.length; index < length_1; index++) {
            iteratee(object[index], index);
        }
    }
    else {
        var _keys = keys(object);
        for (var index = 0, length_2 = _keys.length; index < length_2; index++) {
            iteratee(object[_keys[index]], _keys[index]);
        }
    }
    return object;
}
exports.each = each;
function map(object, iteratee) {
    var _keys = !isArrayLike(object) && keys(object), length = (_keys || object).length, results = Array(length);
    for (var index = 0; index < length; index++) {
        var key = _keys ? _keys[index] : index;
        results[index] = iteratee(object[key], key);
    }
    return results;
}
exports.map = map;
function keys(object) {
    if (!isObject(object)) {
        return [];
    }
    else if (Object.keys) {
        return Object.keys(object);
    }
    var _keys = [];
    for (var key in object) {
        HOP(key) ? _keys.push(key) : null;
    }
    return _keys;
}
exports.keys = keys;
function isArrayLike(object) {
    var length = object ? object.length : null;
    return length && typeof length == 'number' && length >= 0 && length <= MAX_SAFE_NUMBER ? true : false;
}
exports.isArrayLike = isArrayLike;
function isFunction(object) {
    return typeof object == 'function' || false;
}
exports.isFunction = isFunction;
function isObject(object) {
    return typeof object === 'object' && (object != null);
}
exports.isObject = isObject;
function upperFirstLetter(str) {
    str = str + "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.upperFirstLetter = upperFirstLetter;
//# sourceMappingURL=utils.js.map