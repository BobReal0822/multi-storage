
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
        console.log('set-data', data);
        
        if (!data || !data.length) {
            return;
        }
        
        var flag = new clientFlag();
        console.log('client flag', flag);
    });
    
}());