
$("input[type='number']").change( ()=>{

    let filterValues = $("input[type='number']").map(function(){
	    return this.value;
	}).get();
	filterCoins(coinData, filterValues);
});

let filterCoins = (coins, filters) =>{
	let filteredCoins;

	if(filters[0] > 0){
		filteredCoins = coins.filter((coin) => {
			return coin['market_cap_usd'] > filters[1] * 1000000;
		});
	}
	if(filters[1] > 0){
		filteredCoins = coins.filter((coin) => {
			return Math.round(coin['price_usd']) > filters[1];
		});
	}
	if (filters[1] < filters[2]) {
		filteredCoins = filteredCoins.filter((coin) => {
			return Math.round(coin['price_usd']) < filters[2];
		});
	}

	$('#table').remove();
	createTable(filteredCoins);
}