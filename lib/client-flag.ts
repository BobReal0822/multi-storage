(function () {
	interface settingInfo {
		cookie: boolean;
		localStorage: boolean;
		userData: boolean;
		flashCookie: boolean;
        indexedDB: boolean;
	};
	
    var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this;
			
    root.flag = 'this is a flag for test';
    root.setFlag = function() {
        
    }
    
    var _defaultSetting = {
        
    }
    
    var _get = function() {
        
    }
    
    var _set = function() {
        
    }
    
    var _reset = function() {
        
    }
    
    var _clear = function() {
        
    }
    
    var _setCookie = function(name: string, value: string, expires?: Date): boolean {
        if(!name || !value) {
            return false;
        }
        else {
            root.document.cookie = name + '=' + value + (expires ? 'expires=' + expires : null);
            return true;
        }
    }
    
    var _getCookie = function(name: string): string {
        var 
            cookie = root.document.cookie,
            value = '',
            nameIndex: number,
            valueIndex: number;
            
        if(cookie.length > 0) {
            nameIndex = cookie.indexOf(name + '=');
            if(nameIndex > -1) {
                valueIndex = cookie.indexOf(';', nameIndex);
                value = valueIndex > -1 ? cookie.substring(nameIndex + name.length + 1, valueIndex) : '';
            }
        }
        return value;
    }
    
    var _setLocalStorage = function(name: string, value: string): boolean {
        if(!name || !value) {
            return false;
        }
        else {
            root.localStorage.setItem(name,  value);
            return true;
        }
    }
    
    var _getLocalStorage = function(name: string): string {
        return name ? root.localStorage.getItem(name) : '';
    }
    
    var _getUserData = function(name: string): string {
        
    }
    
    var _setUserData = function(name: string, value: string): boolean {
        
    }
    
    var _getFlashCookie = function(name: string): string {
        
    }
    
    var _setFlashCookie = function(name: string, value: string): string {
        
    }
    
}());

	// var setCookieExpires = function() {
	// 	// console.log('set cookie now');
	// 	var now = new Date();
	// 	var time = now.getTime();
	// 	var interval = 30;
	// 	var expireTime = time +  interval * 1000;
	// 	now.setTime(expireTime);
	// 	document.cookie = 'uidExpires='+time+';expires='+now.toGMTString()+';path=/';
	// };