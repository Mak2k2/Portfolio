const app= require('express')();
var express = require('express');
var exec = require('child_process').exec;
const http = require('http').Server(app);
const io = require('socket.io')(http);
var app2 = express();
var fs = require("fs");
var iconv = require('iconv-lite'); //var message = iconv.encode(iconv.decode(message, "cp1251"), "utf8").toString();
var events = require("events");
var path = require('path');
// var SMB2 = require('smb2');
//
// var smb2Client = new SMB2({
// share:'\\\\ip\c$'
// , domain:'DOM'
// , username:'username'
// , password:'password'
// });

var findUIN;
var lastUin;
var lastMessageOlm;
var lastFidMessage;
var lastFindUIN;
var openAgainUin;
var zayavka;
var openAgain;
var answer1;
var answer2;
var answerText = "";
var pathOfTicket;
//var troubleTicket;
var ticketNumber;
var executor = "";
var numTicketExecutor = "";
var avtorization = 0;

ticketNumber = fs.readFileSync("ticketNumber");
ticketNumber = parseInt(ticketNumber, 10);

lastMessageOlm = readFileSync_encoding("lastMessageOlm", "cp1251");
lastUin = fs.readFileSync("lastUin");
console.log("Последнее сообщение " + lastMessageOlm + " от пользователя " + lastUin);

//время
function nowTime() {
	var now = new Date();
	var month = "";
	var year = "";
	var time = "";
	var day = "";
	month = now.getMonth() + 1;
	if (month < 10) month = "0" + (month);
	day = now.getDate();
	if (day < 10) day = "0" + day;
	year = "" + now.getFullYear();
	year = year.substring(2, 4);
	time = day + "." + month + "." + year;
	return(time);
}

//чтение файла
function readFileSync_encoding(filename, encoding) {
	var content = fs.readFileSync(filename);
	return iconv.decode(content, encoding);
}

//отправка сообщения
function send_message(UIN, message) {
	fs.writeFileSync("outmessage/" + UIN, message, "utf8");
	exec("\"c:\\Program Files\\SIQ\\SIQCmd.exe\"" + " 127.0.0.1 5191 msgf 100 " + UIN +
	" \"c:\\Program Files\\nodejs\\SCRIPT\\StartRemoteAPP\\outmessage\\" +
	UIN +"\"", function (error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if (error !== null) console.log(error);
	});
}

//рекурсивный поиск
var getFiles = function (dir, files_){
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files){
		var name = dir + '\\' + files[i];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, files_);
		} 
		else {
			files_.push(name);
		}
	}
	return files_;
};

//чтение входящих сообщений
function read_message() {
	try {
		var readNewMessage = fs.readFileSync("C:\\Program Files\\SIQ\\SIQBOS." + nowTime() + ".log", "utf8");
	}
	catch (err) {
		console.log("\n Ошибка чтения логфайла сообщения" + Date() + "\n" + readNewMessage + "\n" + "C:\\Program Files\\SIQ\\SIQBOS." + nowTime() + ".log");
		setTimeout(function(){
			read_message();
		}, 10000);
		return;
	}
	//Прием заявок
	setTimeout(function(){
		findUIN = -1;
		findUIN = readNewMessage.lastIndexOf("to 100");

		//console.log(findUIN);
		if (findUIN != -1) {
			uinIn = 0;
			findUIN = findUIN -7;
			var uinIn = readNewMessage.substring(findUIN, findUIN + 6);
			var readNewMessage2 = readNewMessage.substring(findUIN, findUIN + 18);
			if (findUIN != lastFindUIN) {
				if (readNewMessage2.indexOf(uinIn + " to 100") != -1) {
					lastFindUIN = findUIN;
					var readNewMessageOlm = readFileSync_encoding("C:\\Program Files\\SIQ\\olm\\100.olm", "cp1251");
					var fidMessage = readNewMessageOlm.lastIndexOf("*");
					//console.log("fidMessage="+fidMessage);
					var messageOlm = readNewMessageOlm.substring(fidMessage + 44, fidMessage + 300);
					if (messageOlm == "") messageOlm = readNewMessageOlm.substring(fidMessage + 39, fidMessage + 300);
					//console.log("MESS="+messageOlm);
					if (lastFidMessage != fidMessage) {
						if (uinIn == zayavka){
							//troubleTicket = messageOlm;
							zayavka = 0;
							ticketNumber = ticketNumber + 1;
							fs.writeFileSync("tickets/" + ticketNumber + "_" + uinIn, "\n Вх.Сообщение " + Date() + "\n" + messageOlm, "utf8");
							send_message(uinIn, "Ваша заявка номер " + ticketNumber + " принята! текст заявки: " + messageOlm);
							fs.writeFileSync("ticketNumber", ticketNumber);
							console.log("текст заявки: " + messageOlm);
							return(read_message());
							lastFidMessage = fidMessage;
							lastUin = uinIn;
							fs.writeFileSync("lastUin", uinIn);
							lastMessageOlm = messageOlm;
							fs.writeFileSync("lastMessageOlm", messageOlm);
						}

						if (uinIn == openAgainUin){
							openAgainUin = 0;
							//console.log("pathOfTicket " + pathOfTicket);
							fs.appendFileSync(pathOfTicket, "\n --Заявка открыта -- " +
							Date() + " \n" + "Причина: " + messageOlm, "utf8");
							var name = pathOfTicket.substring(pathOfTicket.lastIndexOf("\\") + 1);
							//console.log("name " + name);
							fs.rename(pathOfTicket, 'tickets/' + name, function(err){
								if (err) console.log(err);
							});

							pathOfTicket = 0;
							send_message(uinIn, "Заявка" + name + "открыта ");
							lastFidMessage = fidMessage;
							lastUin = uinIn;
							fs.writeFileSync("lastUin", uinIn);
							lastMessageOlm = messageOlm;
							fs.writeFileSync("lastMessageOlm", messageOlm);
							return(read_message());
						}

						if (uinIn == answer2){
							answer2 = 0;
							fs.appendFileSync(answerText, "\n --Ответ в заявку -- " +
							 Date() + " \n" + messageOlm, "utf8");
							var fullText = fs.readFileSync(answerText, "utf8");
							send_message(uinIn, "Полный текст заявки:\n" + fullText + "\n\n");
							answerText = "";
							return(read_message());
						}

						//открыть заново
						if (uinIn == openAgain){
							//troubleTicket = messageOlm;
							openAgain = 0;
							pathOfTicket = 0;
							//ticketNumber = ticketNumber + 1;
							var oldTicket = 0;
							var numberOldTicket = parseInt(messageOlm, 10);
							console.log("numberOldTicket = " + numberOldTicket);
							var getCloseTicket = getFiles('C:\\Program Files\\nodejs\\SCRIPT\\StartRemoteAPP\\closetickets');
							for (var i in getCloseTicket) {
								var name = getCloseTicket[i];
								//console.log(name);
								//pathOfTicket = name;
								namei = name.substring(name.lastIndexOf("\\") + 1);
								var number = namei.indexOf("_");
								number = namei.substring(0, number);
								//console.log(number + "=" + numberOldTicket);
								if (number == numberOldTicket) {
									pathOfTicket = name;
									oldTicket = fs.readFileSync(name, "utf8");
									console.log("\n Открытие закрытой заявки номер: " + number);
								}//oldTicket = numberOldTicket;
							}
							if (oldTicket != 0) {
								//fs.writeFileSync("tickets/" + ticketNumber + "_" + uinIn, "\n Вх.Сообщение " + Date() + "\n" + messageOlm, "utf8");
								send_message(uinIn, "Текст заявки: \n" + oldTicket + "\n \n Укажите причину открытия заявки!");
								openAgainUin = uinIn;
								//console.log(oldTicket);
							}
							else{
								send_message(uinIn, "Нет заявки с номером: " + numberOldTicket);
							}
							lastFidMessage = fidMessage;
							lastUin = uinIn;
							fs.writeFileSync("lastUin", uinIn);
							lastMessageOlm = messageOlm;
							fs.writeFileSync("lastMessageOlm", messageOlm);
							return(read_message());
						}

						if (uinIn == answer1){
							answer1 = 0;
							var checkTicket = 0;
							//var check = fs.existsSync(path)
							//var numberOldTicket = parseInt(messageOlm, 10);
							var name = "";
							var chek = parseInt(messageOlm, 10);//messageOlm.substring(0, messageOlm.length - 1);
							var getCloseTicket = getFiles('C:\\Program Files\\nodejs\\SCRIPT\\StartRemoteAPP\\tickets');
							for (var i in getCloseTicket) {
								name = getCloseTicket[i];
								name = name.substring(name.lastIndexOf("\\") + 1);
								var name2 = name.substring(0, name.indexOf("_"));
								console.log(name2 + " == " + messageOlm);
								if (name2 == chek) {
									answerText = getCloseTicket[i];
									answer2 = uinIn;
									checkTicket = 1;
									send_message(uinIn, "Напишите ответ для заявки номер: " + messageOlm);
								}
							}
							if (checkTicket == 0) send_message(uinIn, "Нет заявки с номером: " + messageOlm);
							return(read_message());
						}

						//ответ
						if (messageOlm == "ОТВЕТ\0" || messageOlm == "ответ\0") {
							console.log("Ответ");
							send_message(uinIn, "Укажите номер заявки");
							answer1 = uinIn;
							return(read_message());
						}
						//открыть
						if (messageOlm == "ОТКРЫТЬ\0" || messageOlm == "открыть\0") {
							console.log("Открытие заявки заново");
							send_message(uinIn, "Укажите номер заявки");
							openAgain = uinIn;
							return(read_message());
						}

						//прием заявки
						if (messageOlm == "ЗАЯВКА\0" || messageOlm == "заявка\0") {
							console.log("Прием заявки");
							send_message(uinIn, "Опишите как можно подробнее вашу проблему");
							zayavka = uinIn;
							return(read_message());
						}
						//приветствие
						if (uinIn != lastUin || lastMessageOlm != messageOlm) {
							//messageOlm = messageOlm.replace(/\0/g,"");
							fs.appendFileSync("log/" + uinIn + ".log", `\n${messageOlm}`, "utf8");
							send_message(uinIn, "Здравствуйте! Вас приветствует бот отдела ИТ! Если у вас возникла какая-то проблема или вопрос, напишите слово ЗАЯВКА");
							console.log(nowTime());
							console.log("Сообщение: " + messageOlm);
							lastUin = uinIn;
							fs.writeFileSync("lastUin", uinIn);
							lastMessageOlm = messageOlm;
							fs.writeFileSync("lastMessageOlm", messageOlm);
						}
					}
				}
			}
		}
		read_message();
	}, 300);
}

//Веб сервер + мониторинг
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/aristo/index.html');
});

app.use(express.static('aristo'));

io.sockets.on('connection', function (socket) {
	//смена исполнителя
	socket.on('ticket executor', function (data) {
		console.log("DATA " + data);
		var parse = data.indexOf("_");
		var numTicket = data.substring(0, parse);
		executor = data.substring(parse + 1);
		if (executor == undefined) return; //maybe error
		console.log("executor = " + executor);
		console.log("numTicket = " + numTicket);

		fs.readdirSync("tickets").forEach(file => {
			var findExecutor = file.lastIndexOf("-");
			var findUin = file.indexOf("_");
			var findCategory = file.lastIndexOf("(");
			var executorTicket = "";
			var category = "";
			var uin = "";
			var number = "";

			number = file.substring(0, findUin);
			if (number == numTicket) {
				if (findCategory != -1) category = file.substring(findCategory + 1, file.lastIndexOf(")"));//нашли категорию

				if (findExecutor != -1) {
					uin = file.substring(findUin + 1, findExecutor);
					if (findCategory != -1) {
						executorTicket = file.substring(findExecutor + 1, findCategory);
						var newfilename = number + "_" + uin + "-" + executor + "(" + category + ")";
						send_message(uin, "Для вашей заявки номер " + number + " изменился исполнитель: " + executor);
						console.log("Изменен исполнитель " + newfilename);
						fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err) {
							if (err) console.log(err);
						});

					} 
					else {
						executorTicket = file.substring(findExecutor +1);
						var newfilename = number + "_" + uin + "-" + executor;
						console.log("Изменен исполнитель для заявки без категории " + newfilename);
						send_message(uin, "Для вашей заявки номер " + number + " изменился исполнитель: " + executor);
						//fs.appendFileSync("tickets/" + file, "Для вашей заявки номер " + number + " назначен исполнитель: " + executor, "utf8");
						fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
							if (err) console.log(err);
						});
					}

				} 
				else {
					if (findCategory != -1) {
						uin = file.substring(findUin +1, findCategory);//нет исполнителя есть категория
						var newfilename = number + "_" + uin + "-" + executor + "(" + category + ")";
						send_message(uin, "Для вашей заявки номер " + number + " назначен исполнитель: " + executor);
						console.log("Назначен исполнитель для заявки с категорией" + newfilename);
						fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
							if (err) console.log(err);
						});
					} 
					else {
						uin = file.substring(findUin + 1);//нет категории нет исполнителя
						//console.log("XZUIN " + uin)
						var newfilename = number + "_" + uin + "-" + executor;
						send_message(uin, "Для вашей заявки номер " + number + " назначен исполнитель: " + executor);
						console.log("Назначен исполнитель без категории" + newfilename);
						fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
							if (err) console.log(err);
						});
					}
				}
			}
		});
	});
	//Чтение фалов заявок и авторизация
	socket.on('ticket', function (data_ticket) {
		i=0;
		var autorizationKey = "98745304852094875249857295874593084";
		if (data_ticket == autorizationKey) {
			console.log("\n Авторизация пройдена");
			avtorization = 1;
		} 
		else {
			if (data_ticket != null || data_ticket != undefined) {
				var separator = data_ticket.indexOf("-][-");
				login = data_ticket.substring(0, separator);
				pass = data_ticket.substring(separator + 4);
				console.log("\n Попытка авторизации: " + login + "\n");
				if (login == "Аркадий" || login == "аркадий" && pass == "123") socket.emit('login', autorizationKey);
				if (login == "Алексей" || login == "алексей" && pass == "123") socket.emit('login', autorizationKey);
				if (login == "Дмитрий" || login == "дмитрий" && pass == "123") socket.emit('login', autorizationKey);
				if (login == "Илья" || login == "илья" && pass == "123") socket.emit('login', autorizationKey);
			} 
			else avtorization = 0;
		}

		if (avtorization == 1) {
			console.log("\n Список заявок:");
			var ticketHtml = "";
			fs.readdirSync("tickets").forEach(file => {
				i++;
				console.log(i + ". " + file);
				var ticket = fs.readFileSync("tickets/" + file, "utf8");
				ticket = ticket.replace(/\r\n|\r|\n/g,"<br />");
				var findExecutor = file.lastIndexOf("-");
				var executorTicket = "";
				var category = "";
				var temp = 0;
				var findCategory = file.lastIndexOf("(");

				if (findCategory == -1){
					if (findExecutor != -1) executorTicket = file.substring(findExecutor + 1);
				}
				else {
					if (findExecutor != -1) executorTicket = file.substring(findExecutor +1, findCategory);
					category = file.substring(findCategory + 1, file.lastIndexOf(")"));
				}

				var number = file.indexOf("_");
				var temp = file.lastIndexOf("-");
				var uin = 0;

				if(temp != -1) uin = file.substring(number + 1, temp);
				else {
					if (findCategory != -1){
						uin = file.substring(number + 1, findCategory)
					} 
					else uin = file.substring(number + 1);
				}

				if (number != -1) number = file.substring(0, number);

				if (executorTicket == "") ticket += "<div class=\"raz\"><div id=\"message_missioner" +
					number + "\">Назначить исполнителя</div>";
				else ticket += "<div class=\"raz\"><div id=\"message_missioner" + number + "\">Поменять исполнителя</div>";
					ticket += "<div id=\"message_category" + number + "\">Назначить категорию</div>";
					ticket += "<div id=\"message_ticket" + number + "\">Написать сообщение</div>";
					//ticket += "<div id=\"message_category" + number + "\">Выбрать категорию</div>";
					ticket += "<div id=\"close_ticket" + number + "\">Закрыть заявку " + number + "</div></div>";
					//file = file.substring(file.indexOf("_") + 1);

				if(executorTicket != "") {
					if (findCategory != -1) {
						ticketHtml = ticketHtml + "<div><h3><a href=\"#\">заявка № " +
						number + " От пользователя " + uin + " Исполнитель " + executorTicket + " Категория " + category +
						"</a></h3><div><p>" + ticket + "</p></div></div>";
					} 
					else {
						ticketHtml = ticketHtml + "<div><h3><a href=\"#\">заявка № " +
						number + " От пользователя " + uin + " Исполнитель " + executorTicket +
						"</a></h3><div><p>" + ticket + "</p></div></div>";
					}

				} 
				else {
					if (findCategory != -1) {
						ticketHtml = ticketHtml + "<div value=\"" + number + "\" ><h3><a href=\"#\">заявка № " + number +
						" От пользователя " + uin +" Категория " + category + "</a></h3><div><p>" + ticket + "</p></div></div>";
					} else {
						ticketHtml = ticketHtml + "<div value=\"" + number + "\" ><h3><a href=\"#\">заявка № " + number +
						" От пользователя " + uin + "</a></h3><div><p>" + ticket + "</p></div></div>";
					}
				}
			});
			//avtorization = 0;
		} 
		else ticketHtml = 0;
		socket.emit('ticket', ticketHtml);
		avtorization = 0;
	});
	//закрытие заявки
	socket.on('close it', function(data) {
		console.log("DATA close " + data);
		var findNum = data.lastIndexOf("-][-");
		console.log("MESCLOSE=" + data);
		if (findNum != -1){
			var idCloseTicket = data.substring(findNum + 4);
			var message = data.substring(0, findNum);
			console.log("idCloseTicket = " + idCloseTicket);
			//send_message("111328", "Ваша заявка номер " + idCloseTicket + " закрыта! Решение: " + message);
			fs.readdirSync("tickets").forEach(file => {
				var number = file.indexOf("_");
				if (number != -1) {
					number = file.substring(0, number);
					console.log("Закрытие заявки " + number);
					if (number == idCloseTicket) {
						var filename = file;
						var findUin = file.indexOf("_");
						var findCategory = file.indexOf("(");
						if (findCategory != -1) {
							var uin = file.substring(findUin + 1, findCategory);
							var category = file.substring(findCategory + 1, file.lastIndexOf(")"));
							console.log("Закрытие заявки " + filename);
							send_message(uin, "Ваша заявка номер " + idCloseTicket + " закрыта! Решение: " + message);
							fs.appendFileSync("tickets/" + filename, "\n" + Date() +
							"\n Ваша заявка номер " + idCloseTicket + " закрыта! Решение: " + message, "utf8");
							//if (fs.existsSync(category) ==
							fs.mkdir('closetickets/' + category, function(err) {
								if (err){
									if (err.errno == -4075);
									else console.log(err);
								}
							});
							fs.rename('tickets/' + filename, 'closetickets/' + category + '/' + filename, function(err){
								if (err) console.log(err);
							});

						} 
						else console.log("err: не найдена категория");
					}
				}
			});
		}
	});

	socket.on('ticket category', function(data) {
		var findNum = data.lastIndexOf("_");
		//console.log("CATEGORY = " + data);
		if (findNum != -1){
			var ticketNumber = data.substring(0, findNum);
			var ticketCategory = data.substring(findNum +1);
			//send_message("111328", "Ваша заявка номер " + idCloseTicket + " закрыта! Решение: " + messageSend);
			fs.readdirSync("tickets").forEach(file => {
				//var number = file.lastIndexOf("_");
				umber = file.substring(0, findNum);
				//console.log("NUMBER " + number);
				if (number == ticketNumber) {
					var findExecutor = file.lastIndexOf("-");
					var findUin = file.indexOf("_");
					var findCategory = file.lastIndexOf("(");
					var executorTicket = "";
					var category = "";
					var uin = "";
					var executor = "";

					//if (findCategory != -1)
					category = ticketCategory;

					if (findExecutor != -1) {
						uin = file.substring(findUin + 1, findExecutor);
						if (findCategory != -1) {
							//category = file.substring(findCategory + 1, file.lastIndexOf(")"));
							executorTicket = file.substring(findExecutor + 1, findCategory);
						} 
						else {
							//category = ticketCategory;
							executorTicket = file.substring(findExecutor +1);
						}
					} 
					else {
						//if (findCategory != -1) category = file.substring(findCategory + 1, file.lastIndexOf(")"));
						if (findCategory != -1) uin = file.substring(findUin + 1, findCategory);
						else uin = file.substring(findUin + 1);
					}

					if (executorTicket != "") executor = executorTicket;

					if (findCategory != -1) {
						if (executor != "") {
							category = ticketCategory;
							var newfilename = ticketNumber + "_" + uin + "-" + executor + "(" + category + ")";
							//send_message(uin, "Для вашей заявки номер " + number + " изменился исполнитель: " + executor);
							console.log("Изменена категория " + newfilename);
							fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
								if (err) console.log(err);
							});
						} 
						else {
							var newfilename = ticketNumber + "_" + uin + "(" + category + ")";
							//send_message(uin, "Для вашей заявки номер " + number + " назначен исполнитель: " + executor);
							console.log("Изменена категория " + newfilename);
							fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
								if (err) console.log(err);
							});
						}
					} 
					else {
						if (executor != "") {
							category = ticketCategory;
							var newfilename = ticketNumber + "_" + uin + "-" + executor + "(" + category + ")";
							//send_message(uin, "Для вашей заявки номер " + number + " изменился исполнитель: " + executor);
							console.log("Добавлена категория " + newfilename);
							fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
								if (err) console.log(err);
							});
						} 
						else {
							var newfilename = ticketNumber + "_" + uin + "(" + category + ")";
							//send_message(uin, "Для вашей заявки номер " + number + " назначен исполнитель: " + executor);
							console.log("Добавлена категория " + newfilename);
							fs.rename('tickets/' + file, 'tickets/' + newfilename, function(err){
								if (err) console.log(err);
							});
						}
					}
				}
			});
		}
	});

	//отправка сообщения
	socket.on('message send', function(data) {
		var find = data.lastIndexOf("-][-");
		if (find != -1){
			var idSendTicket = data.substring(find + 4);
			var messageSend = data.substring(0, find);
			console.log("idSendTicket = " + idSendTicket);
			fs.readdirSync("tickets").forEach(file => {
				var number = file.lastIndexOf("_");
				if (number != -1) {
					number = file.substring(0, number);
					console.log("number=" + number);
					if (number == idSendTicket) {
						file = file.substring(file.indexOf("_") + 1);
						console.log("file=" + file);
						var filename = number + "_" + file;
						send_message(file, messageSend);
						fs.appendFileSync("tickets/" + filename, "\n --Исх.Сообщение--" +
						Date() +" \n" + messageSend, "utf8");
					}
				}
			});
		}
	});

	socket.on('statistics', function (data) {
		var statCloseTicket = {};
		var getCloseTicket = getFiles('C:\\Program Files\\nodejs\\SCRIPT\\StartRemoteAPP\\closetickets');
		for (var i in getCloseTicket) {
			var name = getCloseTicket[i];
			var ctime = fs.statSync(name);
			var content = fs.readFileSync(name, "utf8");
			content = content.replace(/\r\n\0|\r|\n|\0/g,"<br />");
			//var content = �;
			fullname = name.substring(name.lastIndexOf("\\") + 1);
			var number = 0;
			number = fullname.substring(0, fullname.indexOf("_"));
			var initiator = fullname.indexOf("_");
			initiator = fullname.substring(initiator + 1, fullname.indexOf("-"));
			var executor = fullname.indexOf("-");
			executor = fullname.substring(executor + 1, fullname.indexOf("("));
			statCloseTicket[i] = {
				fullname: fullname,
				executor: executor,
				initiator: initiator,
				number: number,
				time: ctime.ctime,
				content: content
			}
		}
		socket.emit('statistics', statCloseTicket);
	});

	socket.on('find_ticket', function (data) {
		var oldTicket = 0;
		var numberOldTicket = 0;
		numberOldTicket = parseInt(data, 10);
		var getCloseTicket = getFiles('C:\\Program Files\\nodejs\\SCRIPT\\StartRemoteAPP\\closetickets');
		for (var i in getCloseTicket) {
			var name = getCloseTicket[i];
			namei = name.substring(name.lastIndexOf("\\") + 1);
			var number = namei.indexOf("_");
			number = namei.substring(0, number);
			//console.log(number + "=" + numberOldTicket);
			if (number == numberOldTicket) {
				var content = fs.readFileSync(name, "utf8");
				oldTicket = content.replace(/\r\n\0|\r|\n|\0/g,"<br />");
				console.log("\n Заявка номер: " + number + " найдена");
			}
		}
		socket.emit('find_ticket', oldTicket);
	});

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});

});

http.listen(3000, () => {
	console.log('Сервер слушает порт 3000');
});

read_message();
