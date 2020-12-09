$(document).ready(() => {
	let checkout = [];
	for (var i = 0; i < localStorage.length; i++) {
		checkout[i] = JSON.parse(localStorage.getItem('basket_items' + i));
	}

	let checkout_html = "<div class=\"checkout_price\" id=\"" + checkout[1].id + "\" ><img src=\"assets/img/catalog/" + checkout[1].id + ".jpg\">";
	checkout_html += "<div><h3><a href=\"item.html\">" + checkout[1].name + "</a></h3><p>Кроссовки</p>";
	checkout_html += "<h3 class=\"price\">" + checkout[1].price + "</h3></div>";
	checkout_html += "</div>"

	for (var i = 2; i < checkout.length; i++) {
		checkout_html += "<div class=\"checkout_price\" id=\"" + checkout[i].id + "\" ><img src=\"assets/img/catalog/" + checkout[i].id + ".jpg\">";
		checkout_html += "<div><h3><a href=\"item.html\">" + checkout[i].name + "</a></h3><p>Кроссовки</p>";
		checkout_html += "<h3 class=\"price\">" + checkout[i].price + "</h3></div>";
		checkout_html += "</div>"
	}
	
	let int_num = 0;
	for (var i = 1; i < checkout.length; i++) {
		int_num = int_num + parseInt(checkout[i].price.replace(/\D+/g,""));
		//console.log(int_num);
	}

	let summ_html = "";
	summ_html = int_num.toString();
	summ_html = summ_html.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ");
	summ_html = summ_html + " ₽";

	document.getElementById("checkout_basket").innerHTML = checkout_html;
	document.getElementById("checkout_summ").innerHTML = summ_html;
	document.getElementById("send_message").innerText = "Оформить заказ, " + summ_html;
});