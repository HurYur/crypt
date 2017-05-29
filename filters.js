
$("input[type='number']").change( ()=>{

    let filterValues = $("input[type='number']").map(function(){
	    return this.value;
	}).get();
	filterCoins(coinData, filterValues);
});

let filterCoins = (coins, filters) =>{
	let filteredCoins;

	filters.forEach( (filter)=>{
		if (filteredCoins) {
			filteredCoins = filteredCoins.filter((coin) => {
				return Math.round(coin['price_usd']) > filter;
			});
		}else{
			filteredCoins = coinData.filter((coin) => {
				return Math.round(coin['price_usd']) > filter;
			});
		}
	});

	console.log(filteredCoins);

	$('#table').remove();
	createTable(filteredCoins);
}