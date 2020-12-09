$(document).ready(() => {
	send_message.onclick = () => {
		let test = document.querySelector('#send_message').textContent;
		if (test != "Корзина пуста!") document.location.href = "checkout_complete.html";
		localStorage.clear();
	}
});