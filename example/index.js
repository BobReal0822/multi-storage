
(function () {
    'use strict';
    
    var
        $setData = $('#set-data'),
        $set = $('#set'),
        $setItem = $('#setItem'),
        $get = $('#get'),
        $getItem = $('#getItem'),
        $clear = $('#clear'),
        $remove = $('#remove'),
        $modal = $('#data-modal');

    $set.click(function () {
        var data = $setData.val();
//        data = JSON.parse(data)
        console.log('set-data', data);
        
        if (!data || !data.length) {
            return;
        }
        
        var storage = new BrowerStorage({
            cookie: true,
            localStorage: false,
            userData: false,
            flash: false,
            indexedDB: false
        });
        console.log('storage:', storage);
        storage.set(data);
    });
    

    // test cookie
    var
        testStorage = function () {
            var storage = new BrowerStorage({
                cookie: true,
                localStorage: false,
                userData: false,
                flash: false,
                indexedDB: false
            });
            console.log('storage setItem:\n', storage.setItem('item1', 2));
            console.log('after setItem:', document.cookie);
            console.log('storage set:\n', storage.set({
                set11: '1',
                set22: '2',
                set33: '3',
                set44: '4'
            }));
            console.log('after set:\n', document.cookie);
            
        },
        testCookie = function () {
            var cookie = new Cookie();
            console.log('before test:\n', document.cookie)
            console.log('cookie setItem:\n', cookie.setItem('setItem', 100));
            console.log('after setItem:\n', document.cookie);
            console.log('cookie set:\n', cookie.set({
                set1: '1',
                set2: '2',
                set3: '3',
                set4: '4'
            }));
            console.log('after set:\n', document.cookie);
            console.log('cookie get("set1"):\n', cookie.get('set1'));
            console.log('cookie getAll:\n', cookie.getAll());
            console.log('cookie removeItem("set2"):\n', cookie.removeItem('set2'))
            console.log('after removeItem:\n', document.cookie);
            console.log('console clear:\n', cookie.clear());
            console.log('atfer clear:\n', document.cookie);
        },
        testLocalstorage = function () {
            var localStorage1 = new LocalStorage();
            console.log('before test:\n', self.localStorage);
            console.log('localStorage setItem:\n', localStorage1.setItem('localA', 123));
            console.log('after setItem:\n', localStorage);
            console.log('localStorage set:\n', localStorage1.set({
                set1: '1',
                set2: '2',
                set3: '3',
                set4: '4'
            }));
            console.log('after set:\n', localStorage);
            console.log('localStorage get("set1"):\n', localStorage1.get('set1'));
            console.log('localStorage getAll:\n', localStorage1.getAll());
            console.log('localStorage removeItem("set2"):\n', localStorage1.removeItem('set2'));
            console.log('after removeItem:\n', localStorage);
            console.log('localStorage clear:\n', localStorage1.clear());
            console.log('after clear:\n', localStorage);
            localStorage.clear();
        },
        testIndexedDb = function () {
            
            var request = self.indexedDB.open('test1');
            request.onsuccess = function(event) {
                
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
            request.onupgradeneeded = function(event) {
                console.log('in onupgradeneeded')
                var db = event.target.result;
                var objectStore = db.createObjectStore("students", { keyPath: "ssn" });
                objectStore.createIndex("name", "name", { unique: false });
                objectStore.createIndex("email", "email", { unique: true });
                
                objectStore.transaction.oncomplete = function(event) {
                    var customerObjectStore = db.transaction("students", "readwrite").objectStore("customers");
                    for (var i in customerData) {
                        customerObjectStore.add(customerData[i]);
                    }
                };
            }
        }，
        testUserData = function () {
            var o = document.createElement('input');
            o.type = "hidden";
            o.addBehavior ("#default#userData");
            //UserData.o.style.behavior = "url('#default#userData')" ;
            //上面的语句也是一样的作用
            document.body.appendChild(o);
            o.setAttribute("code", "hello world!");
            o.save("baidu");
            console.log('after set user data:');
            
            
            var a = UserData.a;      
            // 保持对象的一致
            a.load('baidu'); 
            console.log('get user data a:', a);
            console.log('data:', a.getAttribute('code'));
        }
    ;

//    testStorage();
//    testCookie();
//    testLocalstorage();
//    testIndexedDb();
    testUserData();
        
}());
