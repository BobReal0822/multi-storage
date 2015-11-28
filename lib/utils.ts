/**
 * utils for tiny-form
 */

const MAX_SAFE_NUMBER = Math.pow(2, 53) - 1;
const HOP = Object.prototype.hasOwnProperty;

export function each (object: any | Object, iteratee: (item: any, index: string | number) => any ) {
	if (isArrayLike(object)) {
		for (let index = 0, length = (<any>object).length; index < length; index ++) {
			iteratee((<any>object)[index], index);
		}
	} else {
		let _keys = keys(object);
		for (let index = 0, length = _keys.length; index < length; index ++) {
			iteratee((<any>object)[_keys[index]], _keys[index]);
		}
	}
    return object;
}


// debug
export function map (object: Array<any> | Object, iteratee: (item: any, index: string| number) => any ) {
    let _keys = !isArrayLike(object) && keys(object),
        length = (_keys || <any>object).length,
        results = Array(length);
    for (let index = 0; index < length; index++) {
      let key = _keys ? _keys[index] : index;
      results[index] = iteratee((<any>object)[key], key);
    }
    return results;
}

// 兼容Object.keys
export function keys (object: any): string[] {
	
	if(!isObject(object)) {
		return [];
	}
	else if(Object.keys) {
		return Object.keys(object);
	}
	
	let _keys = <any>[];
	
	for(let key in object) {
		HOP(key) ? _keys.push(key) : null;
	}
	
	return _keys;
}

    // if (!_.isObject(obj)) return [];
    // if (nativeKeys) return nativeKeys(obj);
    // let keys = [];
    // for (let key in obj) if (_.has(obj, key)) keys.push(key);
    // // Ahem, IE < 9.
    // if (hasEnumBug) collectNonEnumProps(obj, keys);
    // return keys;

export function isArrayLike (object: any) {
	let length = object ? object.length : null;
	return length && typeof length == 'number' && length >= 0 && length <= MAX_SAFE_NUMBER ? true : false;
}
export function isFunction (object: any) {
	return typeof object == 'function' || false; 
}

export function isObject (object: any) {
    return  typeof object === 'object' && (object != null);
}

export function upperFirstLetter(str: string) {
    str = str + "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function intersection(array: Array<any>[]) {
	let result = <any>[];
	let argsLength = arguments.length;
	
	for (let i = 0, length = array.length; i < length; i++) {
		let item = array[i];
		if (result.indexOf(item) > -1) {
			continue;
		}
		let j: any;
		for (j = 1; j < argsLength; j++) {
			if (!(arguments[j].indexOf(item) > -1)) {
				break;
			}
		}
		if (j === argsLength) {
			result.push(item);
		}
	}
	return result;
};