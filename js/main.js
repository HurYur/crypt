let coinData;
$.ajax({
  	url: "https://api.coinmarketcap.com/v1/ticker/?limit=200",
  	context: document.body
}).done(function(data) {
	// Create table with coins
	coinData = data;
	createTable(coinData);
});

let createTable = (data) =>{
	let table = document.createElement('table');
 		isTitleCreated = false;
 	table.id = "table";
	document.body.appendChild(table);

	// Row coin
 	for(var coin in data){
 		let tr = document.createElement('tr'),
 		propertiesName = ['Rank', 'Market capitalization $', 'Name','Symbol', 'Price $'];
 		properties = ['rank', 'market_cap_usd', 'name' ,'symbol' , 'price_usd'];

 		chooseCoin(tr);

		if(!isTitleCreated){
			createTitles(propertiesName);
		}

		createCells(tr,properties, data[coin]);

  	};
}

let createTitles = (propertiesName) =>{
 	let tr = document.createElement('tr')

	// Cell coin title
	propertiesName.forEach((property) => {
	 	let th = document.createElement('th');
	 	th.innerText = property;
	 	tr.appendChild(th);
	 	isTitleCreated = true;
	 });
 	table.appendChild(tr);
}

let createCells = (tr ,properties , coin) =>{
	properties.forEach((property) => {
		let td = document.createElement('td');
		if (property === "market_cap_usd") {
			td.innerText = (coin[property]/1000000).toFixed(2) + " M";
		}else {
			td.innerText = coin[property];
		}
		
		tr.appendChild(td);
	});

 	table.appendChild(tr);
}


let chooseCoin = (tr) =>{
	tr.addEventListener("click", (e) => {
		let $clickedRow = e.target.parentNode;
		if ($clickedRow.classList.value !== "active") {
		//open tab and download data

			let coinName = $clickedRow.childNodes[3].innerText,
				currentPrice;
				$coinsCotainerRow = document.createElement('tr');
				$coinsCotainer = document.createElement('td');
				$coinsCotainerRow.appendChild($coinsCotainer);
				$coinsCotainer.className = "coins-container";
				$coinsCotainer.colSpan = "5";

			// download data from API
			getCurrentPrice(coinName, prices =>{
				currentPrice = prices;
			}).then(() =>{
				getPricesByMonths(currentPrice, coinName);
			});

			$clickedRow.after($coinsCotainer)
		}else {
		//close tab
			$clickedRow.nextSibling.remove()
		}

		$clickedRow.classList.toggle("active");
	});
}

let getPricesByMonths = (currentPrice, coinName) => {

	let pricesByMonths = [];
	let monthes = [1 ,3 ,6 ,9 ,12, 18, 24];

	monthes.forEach( (month)=>{
		let ts = moment().subtract(month, 'months').unix();

		uploadInfoByMonth(coinName, ts, prices =>{
			let priceObj = {};
			priceObj[month] = prices['USD']
			pricesByMonths.push(priceObj);

		}).then(()=>{
			if (pricesByMonths.length === monthes.length ) {
				buildPriceInfoBlock(pricesByMonths, currentPrice);
			}
		});
	});
}
let buildPriceInfoBlock = (pricesByMonths, currentPrice)=>{
	pricesByMonths.sort(function(a, b) {
	  return Object.keys(a)[0] - Object.keys(b)[0];
	});

	pricesByMonths.forEach((price)=>{
		let div = document.createElement('div');
		div.className = "coin-price";
		let month = Object.keys(price)[0];
		div.innerHTML = `${month} months: <br/>${price[month]}$ <br/> x${ (currentPrice['USD']/price[month]).toFixed(1)}`
		$coinsCotainer.appendChild(div);
	});
}

let uploadInfoByMonth = (coin, time, handleData) => {
	return $.ajax({
		url: "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + coin + "&tsyms=BTC,USD&ts="+ time,
		success: function(info) {
			handleData(info[coin]);
		}
	});
}

let getCurrentPrice = (coin, handleData) => {
	return $.ajax({
		url: "https://min-api.cryptocompare.com/data/price?fsym=" + coin + "&tsyms=BTC,USD",
		success: function(info) {
			handleData(info);
		}
	});
}