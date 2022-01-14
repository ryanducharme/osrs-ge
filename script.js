$(function () {
    
    var itemMapping;
    var itemPriceData;
    let itemNames = [];

    
    $.ajax({
        type: 'GET',
        url: 'https://prices.runescape.wiki/api/v1/osrs/mapping',
        success: function (data) {
            console.log('success (Mapping)', data);
            //console.log('success', data);
            itemMapping = data;
            
           
            for(var i = 0; i < itemMapping.length; i++)
            {
                itemNames.push(itemMapping[i].name);
            } 

            $( "#search-input" ).autocomplete({
                //source: itemNames,
                source: sourceFilterFunc,
                minLength: 2
            });
        }        
    });

    if (false) {
        var request = {
            term: 'air'
        };
        sourceFilterFunc(request, responseFunc);
    }

    function sourceFilterFunc(request, response) {
        // filter the items array by matching request.term
        var filteredItems = itemNames.filter(function (value) {
            return value.indexOf(request.term) >= 0;
        });
        // call response to return the filtered array
        response(filteredItems.slice(0, 10));
    }

    $.ajax({
        type: 'GET',
        url: 'https://prices.runescape.wiki/api/v1/osrs/5m',
        success: function (data) {
            console.log('success (5m prices)', data);
            itemPriceData = data;            
        }
    });

      

    $('#SearchButton').click(function () {
        var searchFor = $('#search-input').val();
        var items = itemMapping.filter(function (item) {
            return item.name.toLowerCase().indexOf(searchFor.toLowerCase()) >= 0;
        });
        
        //Get item ID of item from input by user
        //find item in itemPriceData by its ID
        //compare and presenet the price data if both id's match
        var wantedItem = itemMapping.find(o => o.name.toLowerCase() === searchFor.toLowerCase())
        console.log('Wanted Item: ' + wantedItem.id);
        
        $('#item-name').text('Item: ' + wantedItem.name);
        //$('#current-price').text('Price: ' + wantedItem.value);

   

        var keys = Object.keys(itemPriceData.data);

        for(var i = 0; i < keys.length; i++)
        {
            if(keys[i] == wantedItem.id){
                console.log('Items match!');
                console.log(itemPriceData.data[wantedItem.id]);

                //console.log());

                $('#buy-price').text('Buy: ' + new Intl.NumberFormat().format(itemPriceData.data[wantedItem.id].avgHighPrice));
                $('#sell-price').text('Sell: ' + new Intl.NumberFormat().format(itemPriceData.data[wantedItem.id].avgLowPrice));
            }
            
        }
        
    });
});
