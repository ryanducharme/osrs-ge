$(function () {

    var itemMapping;
    var itemPriceData;
    let itemNames = [];

    //Get item mapping data
    $.ajax({
        type: 'GET',
        url: 'https://prices.runescape.wiki/api/v1/osrs/mapping',
        success: function (data) {
            console.log('success (Mapping)', data);
            itemMapping = data;
            itemNames = itemMapping.map(x => x.name);

            $("#search-input").autocomplete({
                source: function sourceFilterFunc(request, response) {
                    // filter the items array by matching request.term
                    var filteredItems = itemNames.filter(function (itemName) {
                        return itemName.toLowerCase().indexOf(request.term) >= 0;
                    });
                    // call response to return the filtered array
                    response(filteredItems.slice(0, 10));
                },
                minLength: 2
            });
        }
    });

    // $('5m-radio-button').click(function(){
    //     $('5m-radio-button').prop('checked', true)
    // });

    $('#SearchButton').click(function () {
        var searchFor = $('#search-input').val();
        if ($("5m-radio-button").attr("checked", true)) {
            get5MPrices()
                .done(function (data) {
                    console.log('success (5m prices)', data);
                    itemPriceData = data;
                    weGotPrices();
                })
                .fail(function () {
                    // oh shit
                    window.alert('error');
                })
                .always(function () {
                    // console.log()
                });
        }

        function weGotPrices() {
            //get5MPrices();
            //Get item ID of item from input by user
            //find item in itemPriceData by its ID
            //compare and presenet the price data if both id's match
            var wantedItem = itemMapping.find(o => o.name.toLowerCase() === searchFor.toLowerCase())
            $('#item-name').text('Item: ' + wantedItem.name + ' ID:' + wantedItem.id);

            var keys = Object.keys(itemPriceData.data);

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == wantedItem.id) {

                    //IMPLEMENT TAX

                    console.log(itemPriceData.data[wantedItem.id]);
                    var avgHighPrice = itemPriceData.data[wantedItem.id].avgHighPrice;
                    var avgLowPrice = itemPriceData.data[wantedItem.id].avgLowPrice;
                    var margin = avgHighPrice - avgLowPrice;
                    var profit = margin * wantedItem.limit;
                    console.log(wantedItem.id);
                    $('#item-image').attr('src', `https://secure.runescape.com/m=itemdb_oldschool/1641812469448_obj_big.gif?id=${wantedItem.id}`);
                    $('#buy-price').text('Buy: ' + new Intl.NumberFormat().format(avgHighPrice));
                    $('#sell-price').text('Sell: ' + new Intl.NumberFormat().format(avgLowPrice));
                    $('#margin').text('Margin: ' + new Intl.NumberFormat().format(margin));
                    $('#buy-limit').text('Limit: ' + new Intl.NumberFormat().format(wantedItem.limit));
                    $('#profit').text('Potential Profit: ' + new Intl.NumberFormat().format(profit));
                }
            }
        }
    });


    //Get 5m price data
    function get5MPrices() {
        // $.ajax({
        //     type: 'GET',
        //     url: 'https://prices.runescape.wiki/api/v1/osrs/5m',
        //     success: function (data) {
        //         console.log('success (5m prices)', data);
        //         itemPriceData = data;
        //     }
        // });

        return $.ajax({
            type: 'GET',
            url: 'https://prices.runescape.wiki/api/v1/osrs/5m'
        });

    }

    //Get 1h price data
    function get1HPrices() {
        $.ajax({
            type: 'GET',
            url: 'https://prices.runescape.wiki/api/v1/osrs/1h',
            success: function (data) {
                console.log('success (5m prices)', data);
                itemPriceData = data;
            }
        });
    }


    //Get 24h price data
    function get24HPrices() {
        $.ajax({
            type: 'GET',
            url: 'https://prices.runescape.wiki/api/v1/osrs/24h',
            success: function (data) {
                console.log('success (5m prices)', data);
                itemPriceData = data;
            }
        });
    }

});
