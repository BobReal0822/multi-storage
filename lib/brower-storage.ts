/**
 * 
 * @author ephoton
 * @link https://github.com/ephoton/client-flag
 */
    
(function () {

    var root = typeof self == 'object' && self.self === self && self ||
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
    
    interface BrowerStorageInfo {
        [key: string]: boolean;
        cookie: boolean;
        localStorage: boolean;
        userData: boolean;
        flash: boolean;
        indexedDB: boolean;
    }

    class BrowerStorage {

        _config = {
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
        
       _defaultSettings = <BrowerStorageInfo>{
            cookie: true,
            localStorage: true,
            userData: true,
            flash: true,
            indexedDB: true
        }
        
        _setting: BrowerStorageInfo;
        
        constructor (settings?: BrowerStorageInfo) {
            settings ? function(){for(let key in this._defaultSettings) {
                this._setting[key] = !!settings[key] ? settings[key] : this._defaultSettings[key];
            }}(): this._setting = this._defaultSettings;
        }
        
        setItem (name: string, value: string) {
            if(!name || !value) {
                return false;
            }
            this._broadcast({name, value}, 'setItem');
        }
        
        set (data: {[key: string] : any}) {
            let dataLength = Object.keys(data).length;
            if (dataLength == 1) {
                this._broadcast(data, 'set');
            }
            else if (dataLength > 1) {
                this._broadcast(data, 'setItem');
            }
            return false;
        }
        
        getItem () {
            
        }
        
        get () {
            
        }
        
        clear () {
            
        }
        
        removeItem (name: string): void {
            
        }
        
        _broadcast (data: {[key: string] : any}, func: string) {
            for (let key in this._setting) {
                if (this._setting[key]) {
                    let storageClass = key[0].toUpperCase() + key.substring(1, key.length);
                    storageClass.func.apply(this, data);
                }
            }
        }
        
    }

    // class localStorage
    class LocalStorage {
        
        constructor (name: string, value: string) {
            this.set(name, value);
        }
        
        set (name: string, value: string): boolean {
            if(!name || !value) {
                return false;
            }
            else {
                root.localStorage.setItem(name,  value);
                return true;
            }
        }
        
        get (name: string): string {
            return name ? root.localStorage.getItem(name) : '';
        }
        
        clear (): void {
            root.localStorage.clear();
        }
        
    }
    
    class Cookie {
        
        constructor (name: string, value: string, expires?: Date) {
            this.set(name, value);
        }
        
        set (name: string, value: string, expires?: Date): boolean {
            if(!name || !value) {
                return false;
            }
            else {
                root.document.cookie = name + '=' + value + (expires ? 'expires=' + expires : null);
                return true;
            }
        }
        
        get (name: string): string {
            var 
                cookie = root.document.cookie,
                value = '',
                nameIndex: number,
                valueIndex: number;
                
            if (cookie.length > 0) {
                nameIndex = cookie.indexOf(name + '=');
                if (nameIndex > -1) {
                    valueIndex = cookie.indexOf(';', nameIndex);
                    value = valueIndex > -1 ? cookie.substring(nameIndex + name.length + 1, valueIndex) : '';
                }
            }
            return value;
        }
    }
    
    class UserData {
        
        _setting: UserDataInfo;
        
        constructor (setting: UserDataInfo) {
            this._setting = setting;
        }
        
        set (name: string, value: string): boolean {
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
        
    }
    
    class IndexedDB {
        
        _settings: IndexedDBInfo;
        
        constructor (setting: IndexedDBInfo) {
            this._settings = setting;
        }
        
        set (name:string, value: string) {
            
        }
        
        get (name: string) {
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
        
    };
    
    class Flash {
        
        _setting: FlashCookieInfo;
        
        constructor (setting: FlashCookieInfo) {
            this._setting = setting;
        }
        
        set () {
            
        }
        
        get () {
            
        }
    }
    
    root.BrowerStorage = BrowerStorage;
}());
