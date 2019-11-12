/*
Created By: Richard LeBell
Student ID: 102-50-307
Desc: Javascript file that contains the functionality for the base Othello game, the minimax functionality, and also the alpha-beta pruning
*/

//Global variables
var chosen_player = 0;			//Player's color
var original_board_state;		//An attempt to save the game state
var testing = false;			//boolean to separate the main game from the test runs for minimax
var best_move;					//Keeps track of the actually coordinate choice that led to the best answer.

//Self Executing Function
//Main Methods (INIT is at the bottom)
(function(){
	
	log_count = 1;
	//function to create logs of every move made and stores the copy on the webpage.
    var log = function(){
        var board = document.getElementById("board");
        var clone = board.cloneNode(true);
		clone.setAttribute("name", log_count);
		clone.id = "board_log";


        var log = document.getElementsByName((log_count-1).toString())[0];
		x = get_score();
		console.log(x);
		var score = document.createElement('span');
		score.innerHTML = ((log_count % 2 == 0) ? "White's" : "Black's") + " Move: " + log_count + "<br>" + x;
		score.style.position = "absolute";
		score.style.marginTop = "-390px";
		score.style.left = "0px";
		score.style.width = "100%";

        clone.style.paddingBottom = "340px";
		document.getElementById("log").insertBefore(clone, log);
		document.getElementById("log").insertBefore(score, log);
        
        log_count += 1;
	}
	//Returns the current players total pieces minus the AI's or players 2's total pieces.
	var get_score = function(){
		var b = 0;
		var w = 0;
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(board[x][y] == 1){
					b++;
				}
				if(board[x][y] == 2){
					w++;
				}
			}
		}
		return("black: " + b + " | white: " + w);
	}

	//Returns the score for the state currently in the testing board.
	var test_get_score = function(){
		var b = 0;
		var w = 0;
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(test_board[x][y] == 1){
					b++;
				}
				if(test_board[x][y] == 2){
					w++;
				}
			}
		}
		return("black: " + b + " | white: " + w);
	}

	//Simply uses the total pieces each players has and gets the difference to evaluate.
	var eval_heuristic = function(maximize){
		var x = test_get_score();
		var eval = x.split(" ");
		if(maximize){
			var result = parseInt(eval[1]) - parseInt(eval[4]);	
		} else {
			var result = parseInt(eval[4]) - parseInt(eval[1]);	

		}
		return(result);
	}

	//Since I was unable to complete minimax in time, I stripped the based case for the recursive funciton
	//in order to have the game somewhat playable with an AI. (`somewhat`)
	var recursvieBaseCase = function(maximize, coords){
		console.log(coords);
		var x = eval_heuristic(maximize);
		console.log(x);
		return(x);
	}

	//The actual recursive method to be able to change depth easily. 
	var minimaxFunc = function(coords, depth, maximize){
		var valid_coords = [];
		valid_coords.push(coords);
		//Base case for the recursive function (had it been recursive)
		if(depth == 0){
			console.log(valid_coords);
			var x = eval_heuristic(maximize);
			console.log(x);
			return(x);
		} else {
			//Section for maximizing
			if(maximize){
				var maxEval = -9999;
				for(var i = 0; i < valid_coords.length; i++){
					console.log("max");
					console.log(valid_coords);
					clearHighlighting();
					console.log(document.getElementsByName("test: " + valid_coords[i])[0]);
					var x = document.getElementsByName("test: " + valid_coords[i])[0];
					var y = document.getElementsByName(valid_coords[i])[0];

					x.click();
					var coordinates = [];
					var coordinates = getCurrentMoves();
					console.log(coordinates);
					var test = recursvieBaseCase(maximize, coordinates);
					// var test = minimaxFunc(coordinates, depth-1, false);
					for(var i = 0; i < 10; i++){
						for(var j = 0; j < 10; j++){
							test_board[i][j] = board[i][j];
						}
					}
					console.log(test + ": test");
					if(test > maxEval){
						console.log(y);
						best_move = y;
					}
					maxEval = (maxEval > test) ? maxEval : test;
				}
				return(maxEval);
			} 
			else {
				//Section for minimum
				var minEval = 9999;
				for(var x = 0; x < valid_coords[0].length; x++){
					console.log("min");
					console.log(valid_coords[0][x]);
					document.getElementsByName("test: " + valid_coords[0][x])[0].click();
					// test_showBoard();
					// alert("click");
					var coordinates = [];
					clearHighlighting();
					var coordinates = getCurrentMoves();
					console.log(coordinates);
					var game = test_board;
					var test = recursvieBaseCase(maximize, coordinates);
					// var test = minimaxFunc(coordinates, depth-1, true);
					console.log("test: " + test);
					if(test < minEval){
						console.log(valid_coords[0][x]);	
						best_move = valid_coords[0][x];
					}
					minEval = (minEval < test) ? minEval : test;
				}
				return(minEval);
			}
		}
	}

	//removed highlighting to avoid interference with the counting of valid moves (need to find a better method than using background color 😅)
	var clearHighlighting = function(){
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				var pos = document.getElementsByName("test: " + x+" " +y)[0];
				if(pos.style.background == "blue"){
					pos.style.background = "light-blue";
				}
			}
		}
	}

	//grabs current moves that are available to the current player.
	var getCurrentMoves = function(){
		test_highlight_valid_moves();
		var coordinates = [];
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(test_checkPiece(x, y, false)){
					var pos = document.getElementsByName("test: "+ x + " " + y)[0];
					if(pos.style.background == "blue"){
						var string = x + " " + y;
						coordinates.push(string);
					}
					continue;
				}
			}
		}
		return(coordinates);
	}
	//Minimax Function
	var minimax = function(){
		testing = true;
		ai_turn = true;

		for(var i = 0; i < 10; i++){
			for(var j = 0; j < 10; j++){
				test_board[i][j] = board[i][j];
			}
		}

		if(ai_turn){
			highlight_valid_moves();
			//Loop through each square on the board to see if it has the blue background 
			//color set to get valid available moves for the current state.
			var coordinates = [];
			coordinates = getCurrentMoves();
			coordinates.forEach(function(x){
				minimaxFunc(x, 1, true);
			});
			console.log(best_move);
			best_move.click();
		} else {
			console.log("issue");
		}
		ai_turn = false;

		testing = false;
	}


	/*
	---------------------------------------------------------
	Base Game Functions
	---------------------------------------------------------
	*/

	var piece = [];
	var turn;

	//x and y coordinate along with whether or not to flip pieces while checking
	var checkPiece = function(x, y, flip){
		var ret = 0;
		for(var dx = -1; dx <= 1; dx++){
			for(var dy = -1; dy <= 1; dy++){
				if(dx == 0 && dy == 0){
					continue;
				}
				var nx = x + dx, ny = y + dy, n = 0;
				while(board[nx][ny] == 3 - turn){
					n++;
					nx += dx;
					ny += dy;
				}
				if(n > 0 && board[nx][ny] == turn){
					ret += n;
					if(flip){
						nx = x + dx;
						ny = y + dy;
						while(board[nx][ny] == 3 - turn){
							board[nx][ny] = turn;
							nx += dx;
							ny += dy;
						}
						board[x][y] = turn;
					}
				}
			}
		}
		return ret;
	}
	//Check piece function for the testing board. Ensures the choice is valid.
	var test_checkPiece = function(x, y, flip){
		var ret = 0;
		for(var dx = -1; dx <= 1; dx++){
			for(var dy = -1; dy <= 1; dy++){
				if(dx == 0 && dy == 0){
					continue;
				}
				var nx = x + dx, ny = y + dy, n = 0;
				while(test_board[nx][ny] == 3 - test_turn){
					n++;
					nx += dx;
					ny += dy;
				}
				if(n > 0 && test_board[nx][ny] == test_turn){
					ret += n;
					if(flip){
						nx = x + dx;
						ny = y + dy;
						while(test_board[nx][ny] == 3 - test_turn){
							test_board[nx][ny] = test_turn;
							nx += dx;
							ny += dy;
						}
						test_board[x][y] = test_turn;
					}
				}
			}
		}
		return ret;
	}

	//For the test board: changes turns from black to white and vice versa
	var test_turnChange = function(){
		var b = 0;
		var w = 0;
		test_turn = 3 - test_turn;
		var message = ((test_turn ==1)?"black":"white");
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(test_board[x][y] == 0 && test_checkPiece(x, y, false)){
					test_showBoard();
					return;
				}
			}
		}
		test_turn = 3 - test_turn;
				
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(test_board[x][y] == 0 && test_checkPiece(x, y, false)){
					// document.getElementById("message").innerHTML = message;
					test_showBoard();
					return;
				}else{
					if(test_board[x][y] == 1){
						b++;
					}
					if(test_board[x][y] == 2){
						w++;
					}
				}
			}
		}
		test_showBoard();
	}


	var counter = 0;

	//test version of the showboard function below.
	var test_showBoard = function(){
		var b = document.getElementById("test_board_wrap");
		while(b.firstChild){
			b.removeChild(b.firstChild);
		}
		for(var y = 1; y <= 8; y++){
			for(var x = 1; x <= 8; x++){
				var c = piece[test_board[x][y]].cloneNode(true);
				c.style.left = ((x - 1) * 32) + "px";
                c.style.top = ((y - 1) * 32) + "px";
                c.setAttribute("name", "test: " + x + " " + y);
                b.appendChild(c);
				if(test_board[x][y] == 0){
					(function(){
						var _x = x, _y = y;
						c.onclick = function(){
							if(test_checkPiece(_x, _y, true)){
								console.log("emememememememememem");
								test_turnChange();
							}
					}})();
				}				
			}
		}
	}

	//Most used method, used to swap who the active player is. 
	var turnChange = function(){
		var b = 0;
		var w = 0;
		turn = 3 - turn;
		var message = ((turn ==1)?"black":"white");
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(board[x][y] == 0 && checkPiece(x, y, false)){
					showBoard();
					if(chosen_player != turn){
						minimax();
						console.log("ai");
					}
					
					document.getElementById("message").innerHTML = message + "'s move";
					log();
					return;
				}
			}
		}
		turn = 3 - turn;
		message += " pass</br>" + ((turn ==1 )?"black":"white") + "'s move";
				
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(board[x][y] == 0 && checkPiece(x, y, false)){
					document.getElementById("message").innerHTML = message;
					showBoard();
					return;
				}else{
					if(board[x][y] == 1){
						b++;
					}
					if(board[x][y] == 2){
						w++;
					}
				}
			}
		}
				
		message = "black: " + b + " | white: " + w + "</br>";
			if (black == white){
				message += "draw";
			}else{
				message += ((b > w)?"black":"white") + " wins";
			}
			document.getElementById("message").innerHTML = message;
			showBoard();
	}
	var counter = 0;

	//The method for actually displaying the bored and detecting input on the invidual squares. 
	var showBoard = function(){
		var b = document.getElementById("board");
		while(b.firstChild){
			b.removeChild(b.firstChild);
		}
		original_board_state = board;
		for(var y = 1; y <= 8; y++){
			for(var x = 1; x <= 8; x++){
				var c = piece[board[x][y]].cloneNode(true);
				c.style.left = ((x - 1) * 32) + "px";
                c.style.top = ((y - 1) * 32) + "px";
                c.setAttribute("name", x + " " + y);
                b.appendChild(c);
				if(board[x][y] == 0){
					(function(){
						var _x = x, _y = y;
						c.onclick = function(){
							if(checkPiece(_x, _y, true)){
								turnChange();
                            } else {               
                                //If the player makes an incorrect move, highlight the correct ones.                 
                                highlight_valid_moves();
                            }
						}
					})();
				}				
			}
		}
	}

	//Highlights valid moves for the human player when they make a mistake.
	var highlight_valid_moves = function(){
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(checkPiece(x, y, false)){
					var pos = document.getElementsByName(x + " " + y)[0];
					if(pos.id == "empty"){
						pos.style.background= "blue";
					}
					continue;
				}
			}
		}
	}

	//Checks for which moves are valid and highlights them
	//The minimax algorithm uses this on it's test board to test the coordinates. 
	var test_highlight_valid_moves = function(){
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(test_checkPiece(x, y, false)){
					var pos = document.getElementsByName("test: " +x + " " + y)[0];
					if(pos.id == "empty"){
						pos.style.background= "blue";
					}
					continue;
				}
			}
		}
	}
	
	//Creates the board and test_board along with setting the starting pieces down and assigned which player is which.
	var init = function(ai_start){
		turn = 2;
		test_turn = 2;
		piece = [
			document.getElementById("empty"),
			document.getElementById("black"),
			document.getElementById("white")
		];
		
		for(var i = 0; i < 10; i++){
			board[i] = [];
			for(var j = 0; j < 10; j++){
				board[i][j] = 0;
			}
		}
		for(var i = 0; i < 10; i++){
			test_board[i] = [];
			for(var j = 0; j < 10; j++){
				test_board[i][j] = 0;
			}
		}
		
		board[4][5] = 1;
		board[5][4] = 1;
		board[4][4] = 2;
		board[5][5] = 2;
		test_showBoard();
		test_turnChange();
		showBoard();
		turnChange();
		if(ai_start){
			highlight_valid_moves();
			var coordinates = [];
			for(var x = 1; x <= 8; x++){
				for(var y = 1; y <= 8; y++){
					if(checkPiece(x, y, false)){
						var pos = document.getElementsByName(x + " " + y)[0];
						if(pos.style.background == "blue"){
							var string = x + " " + y;
							coordinates.push(string);
						}
						continue;
					}
				}
			}
			console.log(coordinates);
			var x = document.getElementsByName(coordinates[Math.floor(Math.random() * 4)])[0];
			x.click();
		}
	}
	
	var board = [];
	var test_board = [];
			
	//Loads initial content onto the screen and kicks off the init function above. 
	window.onload = function(){
		document.getElementById('player_color_white').onclick = function(){
			var intro = document.getElementById('intro');
			var choice = document.getElementById('player_color_white');
			chosen_player = 2;
			intro.style.display = "none";
			init(true);

		}
		document.getElementById('player_color_black').onclick = function(){
			var intro = document.getElementById('intro');
			var choice = document.getElementById('player_color_black');
			chosen_player = 1;
			intro.style.display = "none";
			init();

		}
		document.getElementById("reset").onclick = function(){
			init();
		}
	}
			
})();
