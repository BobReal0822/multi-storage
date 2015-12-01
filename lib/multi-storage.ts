/**
 * 
 * @author ephoton
 * @link https://github.com/ephoton/multi-storage
 * 
 */
    
import * as Utils from './utils';

(function () {
    'use strict';
    
    let root = typeof self == 'object' && self.self === self && self ||
        typeof global == 'object' && global.global === global && global ||
        this;
    const MAX_SAFE_NUMBER = Math.pow(2, 53) - 1;

    interface IndexedDBInfo {
        [key: string]: string;
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
    
    interface MultiStorageInfo {
        [key: string]: boolean;
        cookie: boolean;
        localStorage: boolean;
        userData: boolean;
        flash: boolean;
        indexedDB: boolean;
    }
    
    enum MultiStorageStatus {
        //
    }
    
    class MultiStorage {
        
        private _data: string[] = [];
        
        private _config = {
            flagName: 'flagId',
            userData: {
                type: 'div',
                className: 'client-flag'
            },
            indexedDb: {
                dbName: 'MultiStorage',
                tableName: 'flagTable'
            }
        }
        
        private _defaultSettings = <MultiStorageInfo>{
            cookie: true,
            localStorage: true,
            userData: true,
            flash: true,
            indexedDB: true
        }
        
        private _setting: MultiStorageInfo;
        
        constructor (settings?: MultiStorageInfo) {
            this._setting = this._defaultSettings;
            settings ? 
                Utils.each(Utils.keys(this._defaultSettings), key => {
                    settings[key] === undefined || typeof settings[key] === 'undefined' ? null : this._setting[key] = settings[key];
                }) : null;
            
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
            return Utils.intersection(this._broadcastGet('get'));
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
            
            // use each & keys to optimize
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
        
        private _config: IndexedDBInfo = {
            dbName: 'MultiStorageDB',
            tableName: 'MultiStorage'
        };
        
        private _settings: IndexedDBInfo; 
        
        private _defaultSettings: IndexedDBInfo = {
            dbName: 'MultiStorageDB',
            tableName: 'MultiStorage'
        };
        
        private openDB (name: string, callback: (result: any) => any): any {
            let request = root.indexedDB.open(name);
            request.onerror = function(event: any){
                console.log('open error');
            };
            request.onsuccess = function(event: any): any{
                console.log('open success')
                return  callback.call(this, event.target.result);
            };
        }
        
        constructor (settings?: IndexedDBInfo) {
            this._settings = this._defaultSettings;
            if(settings) {
                for(let key in this._defaultSettings) {
                    settings[key] === undefined || typeof settings[key] === 'undefined' ? null : this._settings[key] = settings[key];
                }
            }
        }
        
        set () {
            console.log('in IndexedDB set:');
            let localIndexedDB = root.indexedDB = root.indexedDB || root.mozIndexedDB || root.webkitIndexedDB || window.msIndexedDB;
            let result = this.openDB('test', function(result) {
                console.log('result:', result);
            });
            const customerData = [
                { ssn: "aa", name: "Bill", age: 35, email: "bill@company.com" },
                { ssn: "bb", name: "Donna", age: 32, email: "donna@home.org" }
            ];
            console.log('indexedDb set result:', result);
            
            var request = self.indexedDB.open('test1');
            request.onsuccess = function(event: any) {
                
                var db = event.target.result;
                console.log('in onsuccess:', db);
                var transaction = //db.createObjectStore("students", { keyPath: "ssn" }) ||
                    db.transaction(["students"], "readwrite");;
//                objectStore.createIndex("name", "name", { unique: false });
//                objectStore.createIndex("email", "email", { unique: true });
                
//                transaction.oncomplete = function(event) {
//                    var customerObjectStore = db.transaction("students", "readwrite").objectStore("customers");
                var customerData = [
                    { ssn: "aa", name: "Bill", age: 35, email: "bill@company.com" },
                    { ssn: "bb", name: "Donna", age: 32, email: "donna@home.org" }
                ];
                var store = transaction.objectStore('students');
                    console.log('in transaction omcomplete:', customerData)
                    for (var index = 0, length = customerData.length; index < length; index ++) {
                        console.log('customerData:', customerData, index);
                        store.add(customerData[index]);
                    }
//                };
                console.log('onsuccess in IndexedDB get:', db, transaction);
            };
        }
        
        get (name: string) {
            console.log('in IndexedDB get:', name );
            var request = self.indexedDB.open('test1');
            request.onsuccess = function(event: any) {
                
                var db = event.target.result;
                console.log('in onsuccess:', db);
                var transaction = //db.createObjectStore("students", { keyPath: "ssn" }) ||
                    db.transaction(["students"], "readwrite");;
//                objectStore.createIndex("name", "name", { unique: false });
//                objectStore.createIndex("email", "email", { unique: true });
                
//                transaction.oncomplete = function(event) {
//                    var customerObjectStore = db.transaction("students", "readwrite").objectStore("customers");
                var customerData = [
                    { ssn: "aa", name: "Bill", age: 35, email: "bill@company.com" },
                    { ssn: "bb", name: "Donna", age: 32, email: "donna@home.org" }
                ];
                var store = transaction.objectStore('students');
                var dataRequest=store.get('value');
                dataRequest.onsuccess = function(event: any) {
                   console.log('request result:', request.result);
                }
                console.log('onsuccess in IndexedDB get:', db, transaction);
            };
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
    
    root.MultiStorage = MultiStorage;
    // root.Cookie = Cookie;
    // root.LocalStorage = LocalStorage;
    // root.Flash = Flash;
    // root.BSIndexedDB = IndexedDB;
}());
