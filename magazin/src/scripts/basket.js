$(document).ready(() => {
	
	let quantity_item = Number(localStorage.length) - 1;
	if(quantity_item >= 1) {
		document.getElementById("quantity_item").innerHTML = "<span class=\"quantity\">" + quantity_item + "</span>";
	}

	send_buy.onclick = () => {
		if (localStorage.getItem('basket_items') == null) {
			localStorage.setItem('basket_items', JSON.stringify(""));
		}

		let id = document.querySelector('.item_header').id;
		let name = document.querySelector('.item_header').firstChild.data;
		let color = document.querySelector('input[name="color_button"]:checked').value;
		let size = document.querySelector('input[name="size_button"]:checked').value;
		let price = document.querySelector('#send_buy').textContent;
		price = price.split(',')[1];
		
		let item = {
			name: name,
			id: id,
			color: color,
			size: size,
			price: price
		}

		quantity_item = localStorage.length;
		let item_json = JSON.stringify(item);
		localStorage.setItem('basket_items' + quantity_item, item_json);
		document.getElementById("quantity_item").innerHTML = "<span class=\"quantity\">" + quantity_item + "</span>";
	}
});