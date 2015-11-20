
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
    var storage = new BrowerStorage({
        cookie: true,
        localStorage: false,
        userData: false,
        flash: false,
        indexedDB: false
    });
    console.log('storage:', storage);
    storage.setItem('a', 1);
    
}());
