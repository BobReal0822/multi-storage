/**
 * 
 * @author ephoton
 * @link https://github.com/ephoton/client-flag
 */
    
(function () {
    'use strict';
    
    let root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;
    
    interface IndexedDBInfo {
        dbName: string,
        tableName: string,
    }
    
    interface UserDataInfo {
        elementName: string;
        className: string;
    }
    
    interface FlashCookieInfo {
        swfPath: string;
    }
    
    interface JsonInfo {
        name: string;
        value: string;
    }
    
    interface BrowerStorageInfo {
        [key: string]: boolean;
        cookie: boolean;
        localStorage: boolean;
        userData: boolean;
        flash: boolean;
        indexedDB: boolean;
    }

    // 优化
    let forEach = Array.prototype.forEach;
    let map = Array.prototype.map;

    class BrowerStorage {
        
        private _data: string[] = [];
        
        private _config = {
            flagName: 'flagId',
            userData: {
                type: 'div',
                className: 'client-flag'
            },
            indexedDb: {
                dbName: 'browerStorage',
                tableName: 'flagTable'
            }
        }
        
       private _defaultSettings = <BrowerStorageInfo>{
            cookie: true,
            localStorage: true,
            userData: true,
            flash: true,
            indexedDB: true
        }
        
        private _setting: BrowerStorageInfo;
        
        constructor (settings?: BrowerStorageInfo) {
            this._setting = this._defaultSettings;
            if(settings) {
                for(let key in this._defaultSettings) {
                    settings[key] === undefined || typeof settings[key] === 'undefined' ? null : this._setting[key] = settings[key];
                }
            }
        }
        
        setItem (name: string, value: string): boolean {
            return this._broadcast('setItem', {name, value});
        }
        
        set (data: {[key: string] : any}) {
            return this._broadcast('set', data);
        }
        
        getItem (name: string): string {
            return this._broadcastGet('getItem', name);
        }
        
        get (): {} | {[key: string]: string}  {
            return this._broadcastGet('get');
        }
        
        removeItem (name: string): boolean {
            return this._broadcast('removeItem', name);
        }
        
        clear (): boolean {
            return this._broadcast('clear');
        }
        
        private getClassByName(name: string): Cookie | LocalStorage | Flash | UserData | IndexedDB {
            let _class: Cookie | LocalStorage | Flash | UserData | IndexedDB;
            if (this._setting[name]) {
                switch(name) {
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
            }
            return _class;
        }
        
        private _broadcast (func: string, data?: {[key: string] : any}): any {
            let resultStatus = false;
            for (let key in this._setting) {
                let _class = this.getClassByName(key);
                (data ? (<any>_class)[func].call(this, data) : (<any>_class)[func].call(this)) ? resultStatus = true : null; 
            }
            return resultStatus;
        }
        
        private _broadcastGet (func: string, data?: {[key: string] : any}): any {
            let resultData: string | {} | {[key: string]: string};
            for (let key in this._setting) {
                let _class = this.getClassByName(key);
                data ? (<any>_class)[func].call(this, data) : (<any>_class)[func].call(this); 
            }
        }
    }

    class Cookie {
        
        private _data: string[] = [];
        
        constructor (name?: string, value?: string, expires?: Date) {
            name && value && this.setItem(name, value);
        }
        
        setItem (name: string | {}, value?: string, expires?: Date): boolean {
            
            let localValue = value || '',
                localName = '';
                
            if(typeof name === 'object' && !value) {
                localName = (<any>name)['name'];
                localValue = (<any>name)['value'];
            }
            if(!localName && !localValue) {
                return false;
            }
            
            root.document.cookie = localName + '=' + localValue + (expires ? 'expires=' + expires : '');
            this._data.push(localName);
            
            return true;
        }
        
        set (data: {[key: string] : any}): boolean {
            let setStatus = true,
                keys = Object.keys(data),
                dataLength = keys.length;
            keys.forEach(key => {
                !this.setItem(key, data[key]) ? setStatus = false : null;
            });
            return setStatus;
        }
        
        get (name: string): string {
            var 
                cookie = root.document.cookie,
                value = '',
                nameIndex: number,
                valueIndex: number;
                
            if (cookie.length > 0 && this._data.indexOf(name) >= 0) {
                nameIndex = cookie.indexOf(name + '=');
                if (nameIndex > -1) {
                    valueIndex = cookie.indexOf(';', nameIndex);
                    value = valueIndex > -1 ? cookie.substring(nameIndex + name.length + 1, valueIndex) : '';
                }
            }
            return value;
        }
        
        getAll (): {} | {[key: string]: string} {
            let result: {[key: string] : any} = {};
            this._data.forEach(dataItem => {
                result[dataItem] = this.get(dataItem);
            })
            return result;
        }
        
        removeItem (name: string): boolean {
            if (name && this._data.indexOf(name) >= 0) {
                let localCookie = name + '=' + this.get(name) + '; expires=' + new Date(0);
                root.document.cookie = localCookie;
                return true;
            }
            return false;
        }
        
        clear (): boolean {
            let clearStatus = true;
            this._data.forEach(dataItem => {
                !this.removeItem(dataItem) ? clearStatus = false : null;
            })
            return clearStatus;
        }
    }
    
    class LocalStorage {
        
        private _data: string[] = [];
        
        constructor (name?: string, value?: string) {
            name && value && this.setItem(name, value);
        }
        
        setItem (name: string, value: string, expires?: Date): boolean {
            if(!name || !value) {
                return false;
            }
            else {
                root.localStorage.setItem(name, value);
                this._data.push(name);
                return true;
            }
        }
        
        set (data: {[key: string] : any}): boolean {
            let setStatus = true,
                keys = Object.keys(data),
                dataLength = keys.length;
            keys.forEach(key => {
                !this.setItem(key, data[key]) ? setStatus = false : null;
            });
            return setStatus;
        }
        
        get (name: string): string {
            return name ? root.localStorage.getItem(name) : '';
        }
        
        getAll (): {} | {[key: string]: string} {
            let result: {[key: string] : any} = {};
            this._data.forEach(dataItem => {
                result[dataItem] = this.get(dataItem);
            })
            return result;
        }
        
        removeItem (name: string): boolean {
            if (name && this._data.indexOf(name) >= 0) {
                root.localStorage.removeItem(name);
                return true;
            }
            return false;
        }
        
        clear (): boolean {
            let clearStatus = true;
            this._data.forEach(dataItem => {
                !this.removeItem(dataItem) ? clearStatus = false : null;
            })
            return clearStatus;
        }
    }
    
    class UserData {
        
        _setting: UserDataInfo;
        
        constructor (setting?: UserDataInfo) {
            setting ? this._setting = setting : null;
        }
        
        set (name: string, value: string): boolean {
            console.log('in UserData set:', name , value);
            if (name && value) {
                try {
                    var element = root.document.createElement(this._setting.elementName)
                    element.style.visibility = "hidden";
                    // element.style.position = "absolute";
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
        }
        
        get (name: string): string {
            console.log('in UserData get:', name);
            try {
                var element = root.document.getElementsByClassName(this._setting.className);
                element.load(name);
                return element.getAttribute(name) || '';
            }
            catch(error) {
                console.log('error in getFlashCookie', error);
                return '';
            }
        }
        
        clear (): void {
            console.log('in userData clear:');
            root.localStorage.clear();
        }
        
        removeItem (name: string): void {
            console.log('in UserData removeItem:');
            
        }
    }
    
    class IndexedDB {
        
        _settings: IndexedDBInfo;
        
        constructor (setting?: IndexedDBInfo) {
            setting ? this._settings = setting : null;
        }
        
        set (name:string, value: string) {
            console.log('in IndexedDB set:', name , value);
            
        }
        
        get (name: string) {
            console.log('in IndexedDB get:', name );
            var localIndexedDB = root.indexedDB = root.indexedDB || root.mozIndexedDB || root.webkitIndexedDB || window.msIndexedDB;
            var dbRequest = localIndexedDB.open(this._settings.dbName);
            dbRequest.onerror = function(event: any) {
                console.log('error in setIindexedDB:', event);
            }
            dbRequest.onupgradeneeded = function(event: any) {
                var db = event.target.result;
                var store = db.createObjectStore(this._settings.tableName, {
                    keyPath: "name",
                    unique: false
                })
    
            }
            // dbRequest.onsuccess = function(event: any) {
            //     var idb = event.target.result;
            //     if (idb.objectStoreNames.contains("evercookie")) {
            //         var tx = idb.transaction(["evercookie"], "readwrite");
            //         var objst = tx.objectStore("evercookie");
            //         var qr = objst.put({
            //             "name": name,
            //             "value": value
            //         })
            //     } idb.close();
            // }
        }
        
        clear (): void {
            console.log('in IndexedDB clear:');
            root.localStorage.clear();
        }
        
        removeItem (name: string): void {
            console.log('in IndexedDB removeItem:');
        }
    };
    
    class Flash {
        
        _setting: FlashCookieInfo;
        
        constructor (setting?: FlashCookieInfo) {
            setting ? this._setting = setting : null;
        }
        
        set (name: string, value: string) {
            console.log('in Flash set:', name , value);
        }
        
        get (name: string) {
            console.log('in Flash get:', name);
        }
        
        clear (): void {
            console.log('in Flash clear:');
            root.localStorage.clear();
        }
        
        removeItem (name: string): void {
            console.log('in Flash removeItem:');
        }
    }
    
    root.BrowerStorage = BrowerStorage;
    root.Cookie = Cookie;
    root.LocalStorage = LocalStorage;
    root.Flash = Flash;
    root.IndexedDB = IndexedDB;
}());
