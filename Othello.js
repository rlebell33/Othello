



//Self Executing Function
(function(){
    log_count = 1;
    var log = function(){
        var board = document.getElementById("board");
        var clone = board.cloneNode(true);
        clone.setAttribute("name", log_count);

        var log = document.getElementsByName((log_count-1).toString())[0];
        console.log(log_count-1);
        clone.style.top = (300 * log_count) + "px";
        clone.style.paddingBottom = "300px";
        document.getElementById("log").insertBefore(clone, log);
        
        log_count += 1;
    }
	
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
			
	var turnChange = function(){
		var b = 0;
		var w = 0;
		turn = 3 - turn;
		var message = ((turn ==1)?"black":"white");
		for(var x = 1; x <= 8; x++){
			for(var y = 1; y <= 8; y++){
				if(board[x][y] == 0 && checkPiece(x, y, false)){
					document.getElementById("message").innerHTML = message + "'s move";
					showBoard();
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
		
	var showBoard = function(){
		var b = document.getElementById("board");
		while(b.firstChild){
			b.removeChild(b.firstChild);
		}
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
                                log();
                            } else {               
                                //If the player makes an incorrect move, highlight the correct ones.                 
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
						}
					})();
				}
				
			}
		}
	}
	
	var init = function(){
		turn = 2;
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
		
		board[4][5] = 1;
		board[5][4] = 1;
		board[4][4] = 2;
		board[5][5] = 2;
		turnChange();
		showBoard();
	}
	
	var board = [];
			
	window.onload = function(){
		init();
		document.getElementById("reset").onclick = function(){
			init();
		}
	}
			
})();
