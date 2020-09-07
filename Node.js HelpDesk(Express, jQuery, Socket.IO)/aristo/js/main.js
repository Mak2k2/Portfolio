$(function(){
	var dialogNam = 2;
	var socket = io();
	var idButton;
	window.idButton = 0;
	var executor;
	window.executor = 0;
	window.category = 0;
	window.active = 0;
	window.avtorization = 0;
	var checkNewTicket = 0;
	var otpravka = 0;
	var idleTime = 0;
	window.otpravka = 0;
	window.checkNewTicket = sessionStorage.getItem('checkNewTicket');

	// Autocomplete
	var countryList = ["Russia"];
	$("#countries").autocomplete({
		source: countryList
	});

	function cookieRead() {
		if ($.cookie('activeTicket') != null) {
			window.active = parseInt($.cookie('activeTicket'), 10);
		}
	}

	function ticketUpdate() {
		cookieRead();
		window.loginSend = $.cookie('login');
		//console.log("PROVERKA " + $.cookie('login'));
		var socket = io();
		socket.emit('ticket', window.loginSend);
		socket.on('ticket', function (data) {
			if (data == "0") $('#login').dialog('open');
			else var authorization = 1;
			if (data == "") data = "<div><h2><p>?????? ???</p></h2></div>";
			document.getElementById('ticket1').innerHTML = data;
			$(".accordion").accordion({
				heightStyle: "content",
				active: window.active,
				collapsible: true,
				header: "h3"
			});

			for (var i = 0; i < 300; i++){
				$('#message_missioner' + i).button().click(function(){
					clickButtonExecutor(this.id);
				});
				$('#close_ticket' + i).button().click(function(){
					clickButtonClose(this.id);
				});
				$('#message_ticket' + i).button().click(function(){
					clickButtonMessage(this.id);
				});
				$('#message_category' + i).button().click(function(){
					clickButtonCategory(this.id);
				});
			}
		});
		
		socket.emit('statistics', "");
		socket.on('statistics', function (data) {
			var header = "\n";
			var count = 0;
			var statName = "";
			var nameExecutor1 = document.getElementById('radio1').value;
			var nameExecutor2 = document.getElementById('radio2').value;
			var nameExecutor3 = document.getElementById('radio3').value;
			var nameExecutor4 = document.getElementById('radio4').value;
			var nameExecutorStat1 = 0;
			var nameExecutorStat2 = 0;
			var nameExecutorStat3 = 0;
			var nameExecutorStat4 = 0;
			
			for (var i in data) {
				header += "<a id=\"openticket" + i + "\"" + " name=\"" + data[i].content + "\"" + " href=\"#\">" + data[i].fullname + "</a></br>"
				if (nameExecutor1 == data[i].executor) nameExecutorStat1 += 1;
				if (nameExecutor2 == data[i].executor) nameExecutorStat2 += 1;
				if (nameExecutor3 == data[i].executor) nameExecutorStat3 += 1;
				if (nameExecutor4 == data[i].executor) nameExecutorStat4 += 1;
				count = i;
			}
			
			var content1 = "<h2>???????? ???????: " + count + "</h2>" + header + "</br>";
			document.getElementById('statistics1').innerHTML = content1;
			var content2 = "<h4>" + nameExecutor1 + ": " + nameExecutorStat1 + "<h4>";
			content2 += "<h4>" + nameExecutor2 + ": " + nameExecutorStat2 + "<h4>";
			content2 += "<h4>" + nameExecutor3 + ": " + nameExecutorStat3 + "<h4>";
			content2 += "<h4>" + nameExecutor4 + ": " + nameExecutorStat4 + "<h4>";
			document.getElementById('statistics2').innerHTML = content2;
			for (var i = 0; i < 300; i++){
				$("#openticket" + i).click(function(event) {
					document.getElementById('content_message').innerHTML = this.name;
					$('#content').dialog('open');
				});
			}
		});
	}

	function mode() {
		setTimeout(mode, 10000);
		var socket = io();
		socket.emit('ticket', window.loginSend);
		socket.on('ticket', function (data) {
			if (window.checkNewTicket != data) {
				console.log("NEW DATA");
				window.checkNewTicket = data;
				sessionStorage.setItem('checkNewTicket', data);
				window.otpravka = $.cookie('otpravka');
				console.log("otpravka=" + window.otpravka);
				if (window.otpravka == 1) {
					document.getElementById('ticket1').innerHTML = data;
					var act = 0;
					if (window.active != 0) act = window.active;
						setTimeout(function() {
							$(".accordion").accordion({
								heightStyle: "content",
								active: act,
								collapsible: true,
								header: "h3"
							});
						}, 30);

					$(".accordion").accordion("refresh");

					for (var i = 0; i < 10000; i++){
						$('#message_missioner' + i).button().click(function(){
								clickButtonExecutor(this.id);
						});
						$('#close_ticket' + i).button().click(function(){
							clickButtonClose(this.id);
						});
						$('#message_ticket' + i).button().click(function(){
							clickButtonMessage(this.id);
						});
						$('#message_category' + i).button().click(function(){
							clickButtonCategory(this.id);
						});
					}

				}
				
				$.cookie('otpravka', 1);
			}
		 });
	}

	// Dialog
	$('#dialog').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		},
		modal: true
	});

	$('#t_message').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"???????? ?????????": function() {
				var messageSend = document.getElementById('t_send_message').value;
				if (messageSend == "") {
					document.getElementById('error_message').innerHTML = "????????? ?? ?????? ???? ??????!";
					$('#error').dialog('open');
					return;
				}
				socket.emit('message send', messageSend + "-][-" + window.idButton);
				$(this).dialog("close");
				window.idButton = 0;
				$.cookie('otpravka', 0);
				location.reload();
			},
			"??????": function() {
				$(this).dialog("close");
			}
		},
		modal: true
	});

	$('#error').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				$(this).dialog("close");
			},
		},
		modal: true
	});

	$('#content').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				$(this).dialog("close");
			},
		},
		modal: true
	});

	$('#login').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				var login = $("#login input[type='text']").val();
				var pass = $("input:password").val();
				console.log("????????????: " + login);
				console.log("??????: " + pass);
				var socket = io();
				socket.emit('ticket', login + "-][-" + pass);
				socket.on('login', function (data){
					console.log("LOGIN DATA = " + data);
					$.cookie('login', data);
				});
				setTimeout(function() {
					//$.cookie('otpravka', 0);
					location.reload();
				},300);
				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		},
		modal: true,
		open: function() {
			$("#login").keypress(function(e) {
				if (e.keyCode == $.ui.keyCode.ENTER) {
					$(this).parent().find("button:eq(1)").trigger("click");
				}
			});
		}
	});

	$('#executor').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				window.executor = $("#radio input[type='radio']:checked").val();
				console.log("?????? ???????????: " + window.executor);
				var socket = io();
				socket.emit('ticket executor', window.idButton + "_" + window.executor);
				setTimeout(function() {
					$.cookie('otpravka', 0);
					location.reload();
				}, 300);

			$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		},
		modal: true
	});

	$('#category').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"Ok": function() {
				window.category = $("#radio_category input[type='radio']:checked").val();
				console.log("??????? ?????????: " + window.category);
				var socket = io();
				socket.emit('ticket category', window.idButton + "_" + window.category);
				setTimeout(function() {
					$.cookie('otpravka', 0);
					location.reload();
				}, 300);
				$(this).dialog("close");
			},
			"Cancel": function() {
				$(this).dialog("close");
			}
		},
		modal: true
	});

	$('#t_Close').dialog({
		autoOpen: false,
		width: 600,
		buttons: {
			"??????? ??????": function() {
				var messageClose = document.getElementById('t_close_message').value;
				var activeTicket = checkActiveTicket();
				console.log("activeTicket " + activeTicket);
				if (activeTicket.indexOf("???????????") == -1) {
					document.getElementById('error_message').innerHTML = "?????????? ????????? ???????????!";
					$('#error').dialog('open');
					return;
				}
				if (activeTicket.indexOf("?????????") == -1) {
					document.getElementById('error_message').innerHTML = "?????????? ????????? ????????? ??????!";
					$('#error').dialog('open');
					return;
				}
				if (messageClose == "") {
					document.getElementById('error_message').innerHTML = "?????????? ???????? ????? ?? ??????!";
					$('#error').dialog('open');
					return;
				}
				console.log("Close " + messageClose);
				socket.emit('close it', messageClose + "-][-" + window.idButton);
				$(this).dialog("close");
				console.log("PROVERKA ID " + window.idButton);
				window.idButton = 0;
				$.cookie('otpravka', 0);
				location.reload();
			},
			"??????": function() {
				$(this).dialog("close");
			}
		},
		modal: true
	});

	function checkActiveTicket() {
		var elements = document.getElementsByClassName("ui-accordion-header-active");
		for( var i = 0; i < elements.length; i++ ) {
			if (elements[i].id != undefined) {
				elements = elements[i].id;
				var activeTicket = $("#" + elements);
				//console.log(activeTicket[0].textContent);
				activeTicket = activeTicket[0].textContent;
				return(activeTicket);
			}
			else return(false);
		}
	}

	function activeTicket() {
		var elements = document.getElementsByClassName("ui-accordion-header-active");
		for( var i = 0; i < elements.length; i++ ) {
			//console.log( elements[i].id );
			if (elements[i].id != undefined) {
				elements = elements[i].id;
				elements = elements.substring(22);
				window.active = parseInt(elements, 10);
				$.cookie('activeTicket', window.active);
			}
		}
		setTimeout(function() {
			activeTicket();
		}, 300);
	}

	$(document).ready(function () {
		var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
		$(this).mousemove(function (e) {
			idleTime = 0;
		});
		$(this).keypress(function (e) {
			idleTime = 0;
		});
	});

	function timerIncrement() {
		idleTime = idleTime + 1;
		if (idleTime > 5) { // minutes
			$.cookie('otpravka', 0);
			window.location.reload();
		}
	}

	function clickButtonClose(id){
		$('#t_Close').dialog('open');
		window.idButton = id.substring(12);
	};

	function clickButtonMessage(id){
		$('#t_message').dialog('open');
		window.idButton = id.substring(14);
	};

	function clickButtonExecutor(id) {
		$('#executor').dialog('open');
		window.idButton = id.substring(17);
	}

	function clickButtonCategory(id) {
		$('#category').dialog('open');
		window.idButton = id.substring(16);
	}

	$("#radio").buttonset();
	$("#radio").prop("checked", false);
	$('#datepicker').datepicker().children().show();

	ticketUpdate();
	mode();
	activeTicket();
});

function submit_handler(form) {
	//alert(form.anything.value);
	document.getElementById('content_message').innerHTML = "";
	var ticketData = "";
	var socket = io();
	socket.emit('find_ticket', form.anything.value);
	socket.on('find_ticket', function (data) {
		console.log("DATA " + data);
		if (data == 0) ticketData = "??? ?????? ? ????? ???????!";
		else ticketData = data;
		//ticket = data;
		document.getElementById('content_message').innerHTML = ticketData;
	});

	$('#content').dialog('open');
	return false;
}