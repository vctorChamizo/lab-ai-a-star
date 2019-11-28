"use strict"

let action;
let dimN, dimM;
let begin = { x: -1, y: -1, put: false };
let end = { x: -1, y: -1, put: false };
const colors = { cell: "#E5E5E5", ini: "#b2ff59", end: "#18ffff", obstacle: "#ff5252", way: "#ffff00"};
let listObstacle = [];
let listWayPoint = [];
let listWay = [];

 $(() => {

	$("#content_alert_danger").hide();
	$("#content_alert_success").hide();

	$('body').on('click', '.celdas', function() {

		let row = Number($(this).parent().attr('class').split('_')[1]);
		let column = Number($(this).attr('class').split('_')[1]);
		let nod_aux;

		switch(action) {

			case "begin":

				if (!begin.put) {
					$(this).css('background-color', colors.ini);
					begin.put = true;
					begin.x = row;
					begin.y = column;
				}
				else if (begin.x == row && begin.y == column) {
					$(this).css('background-color', colors.cell);
					begin.put = false;
					begin.x = -1;
					begin.y = -1;
				}
				else show_alert_danger("Ya hay un comienzo. Bórralo si quieres poner otro.");
				break;

			case "end":

				if (!end.put) {
					$(this).css('background-color', colors.end);
					end.put = true;
					end.x = row;
					end.y = column;
				}
				else if (end.x == row && end.y == column) {
					$(this).css('background-color',colors.cell);
					end.put = false;
					end.x = -1;
					end.y = -1;
				}
				else show_alert_danger("Ya hay un final. Bórralo si quieres poner otro.");
				break;

			case "obstacle":

				if (listObstacle.length > 0) nod_aux = listObstacle.find(elem => { return elem.X === row && elem.Y === column });
				if (nod_aux != undefined) {
					$(this).css('background-color',colors.cell);
					listObstacle.splice(listObstacle.indexOf(nod_aux), 1);
				}
				else {
					$(this).css('background-color', colors.obstacle);
				 	listObstacle.push(new Nod(row, column));
				}
				break;

			case "way-point":

				if (listWayPoint.length > 0) nod_aux = listWayPoint.find(elem => { return elem.X === row && elem.Y === column });
				if (nod_aux != undefined) {
					$(this).css('background-color',colors.cell);
					listWayPoint.splice(listWayPoint.indexOf(nod_aux), 1);
				}
				else {
					$(this).css('background-color', colors.waypoint);
					listWayPoint.push(new Nod(row, column));
				}
				break;
		}
	});

	$("#btn_create").on("click", () => {

		reboot_app();
	
		if ($("#input_rows").val() <= 0 || $("#input_columns").val().length <= 0) show_alert_danger("Debes introducir dimensiones correctas.");
		if ($("#input_rows").val().length == 0 || $("#input_columns").val().length == 0) show_alert_danger("Debes introducir dimensiones.");
		else {

			dimN= $("#input_rows").val();
			dimM = $("#input_columns").val();
			create_table(dimN, dimM);
		}
	});

	$("#btn_start").on("click", () => {

		$("#content_alert").hide();
		let l_obs_aux = listObstacle.slice();
		let l_waypoint_aux = listWayPoint.slice();

		if (!begin.put || !end.put) show_alert_danger("Introduzca al menos un comienzo y un final.");
		else {

			let a_star = new A_Star(dimN, dimM, new Nod(begin.x, begin.y), new Nod(end.x, end.y), l_obs_aux, l_waypoint_aux);
			listWay = a_star.run();
			if (listWay == null) show_alert_danger("No hay un camino posible hasta el final.");
			else draw_way();
		}
	});

	$("#btn_begin").on("click", () => { action = "begin" });
	$("#btn_end").on("click", () => { action = "end" });
	$("#btn_obstacle").on("click", () => { action = "obstacle" });
	$("#btn_way-point").on("click", () => { action = "way-point" });
	$("#btn_close_alert").on("click", () => { $("#content_alert").hide(); });
 });

/**
 * Renders a path of nodes with respect to a list.
 */
function draw_way() { 

	let i = listWay.length - 1;
	let interval = window.setInterval(() => {
		$('#f' + listWay[i].X + 'c' + listWay[i].Y).css('background-color', colors.way);
		if (i == 0) {
			window.clearInterval(interval);
			show_alert_success("¡Enhorabuena! Has llegado al final.");
		}
		i--;
	}, 500);
}

/**
* Create the board with the dimensions passed as a parameter.
*
* @param {Number} row 
* @param {Number} column 
*/
function create_table(row, column) {

	let n_rows = row;
	let n_columns = column;
	let width_rows = 100;
	let height_rows = 0.9 * 100 / n_rows;
	let margin_top_rows = 0.1 * 100/(n_rows - 1);
	let width_cells = 0.9 * 100 / n_columns;
	let height_cells = 100;
	let margin_left_rows = 0.1 * 100/(n_columns - 1);

	for( var i = 1 ; i <= n_rows ; i++) $('<div class="filas ' + 'fila_' + i + '"></div>').appendTo('#content_int');

	$('.filas').each( function() {
		$(this).css('width', width_rows + '%');	$(this).css('height', height_rows + '%');
		if(!$(this).is(':first-child') ) $(this).css('margin-top', margin_top_rows + '%');
	});

	for(let i = 1 ; i <= n_columns ; i++) 
		for(let j = 1 ; j <= n_rows ; j++) 
		$('<div id = "f' + j + 'c' + i + '" class="celdas ' + 'columna_' + i + ' "></div>').appendTo('#content_int .filas:nth-child(' + j + ')');

	$('.celdas').each( function() {
		$(this).css('width', width_cells + '%'); $(this).css('height', height_cells + '%');
		if (!$(this).is(':first-child')) $(this).css('margin-left', margin_left_rows + '%');
	});		
}

/**
 * Restart all the components of the application.
 */
function reboot_app () {

	$("#content_alert_danger").hide();
	$("#content_alert_success").hide();
	$("#content_int").empty();
	begin.put = false; begin.x = -1; begin.y = -1;
	end.put = false; end.x = -1; end.y = -1;
	listObstacle = [];
	listWay = [];
}

/**
 * Displays an alert danger with the message passed as a parameter.
 * 
 * @param {String} msg 
 */
function show_alert_danger(msg) { $("#alert_text_danger").text(msg); $("#content_alert_danger").show(); }

/**
 * Displays an alert success with the message passed as a parameter.
 * 
 * @param {String} msg 
 */
function show_alert_success(msg) { $("#alert_text_success").text(msg); $("#content_alert_success").show(); }

