let coinData;
$.ajax({
  	url: "https://api.coinmarketcap.com/v1/ticker/?limit=10",
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

	 	tr.addEventListener("click", (e) => {
			e.target.parentNode.classList.toggle("active");
			let coinName = e.target.parentNode.childNodes[3].innerText;
			uploadInfo(coinName);

			let d = new Date();
			let monthes = [1 ,3 ,6 ,12];

			monthes.forEach( (month)=>{
				var myDate="26-02-2016";
				myDate=myDate.split("-");
				var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];


				uploadInfoByMonth(coinName, new Date(newDate).getTime());
			});
		});

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

let uploadInfo = (coin) => {
	$.ajax({
		url: "https://min-api.cryptocompare.com/data/price?fsym=" + coin + "&tsyms=BTC,USD",
		context: document.body
	}).done(function(coinPrice) {
		// Create table with coins
		console.log(coinPrice);
	});
}

let uploadInfoByMonth = (coin, time) => {
	$.ajax({
		url: "https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + coin + "&tsyms=USD&ts="+ time,
		context: document.body
	}).done(function(coinPrice) {
		// Create table with coins
		console.log(coinPrice[coin]);
	});
}