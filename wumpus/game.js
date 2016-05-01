(function(){
    var KEY_CODES = {
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN",
        "LEFT": 37,
        "UP": 38,
        "RIGHT": 39,
        "DOWN": 40
    };
    var player = {};
    var wumpus = document.createElement("img");
    var gold = document.createElement("div");
    wumpus.src = "http://pavao.org/compsci/intro/images/wumpusc.gif";
    wumpus.id = "wumpus";
    gold.id = "gold";
    
    var has_gold = false;
    
    var max_board = 4;
    var min_board = 1;
    var EXIT_CELL = "0-0";
    
    var random_num = function(max, min) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    
    var random_location = function() {
        var x = random_num(max_board, min_board);
        var y = random_num(max_board, min_board);
        return "" + x + "-" + y;
    }
    
    window.onload = function() {
        alert("Tap or use arrow keys to move");
        player = document.getElementById("player");
        document.getElementById(random_location()).appendChild(wumpus);
        document.getElementById(random_location()).appendChild(gold);
    };
    
    var move = function(entity, keyCode) {
        var currLoc = entity.parentElement.id;
        currLoc = currLoc.split("-");
        var nextLoc = [currLoc[0], currLoc[1]];
        switch (KEY_CODES[keyCode]) {
            case "RIGHT":
            nextLoc[1] = (Number(nextLoc[1]) + 1).toString();
            break;
            
            case "LEFT":
            nextLoc[1] = (Number(nextLoc[1]) - 1).toString();
            break;
            
            case "UP":
            nextLoc[0] = (Number(nextLoc[0]) - 1).toString();
            break;
            
            case "DOWN":
            nextLoc[0] = (Number(nextLoc[0]) + 1).toString();
            break;
            
            default:
            break;
        }
        var newParent = document.getElementById(nextLoc.join("-"));
        if (newParent) newParent.appendChild(entity); 
    };
    
    var postMoveAction = function() {
        if (player.parentElement.id == wumpus.parentElement.id) {
            KEY_CODES = {};
            var fail = document.createElement("h3");
            var fail_text = document.createTextNode(">>> You lost! The Wumpus killed you!");
            fail.appendChild(fail_text);
            document.body.appendChild(fail);
        }
        if (gold.parentElement && player.parentElement.id == gold.parentElement.id) {
            gold.parentElement.removeChild(gold);
            has_gold = true;
            var gold_message = document.createElement("h3");
            var gold_message_text = document.createTextNode(">>> You got the gold! Escape!");
            gold_message.appendChild(gold_message_text);
            document.body.appendChild(gold_message);
        }
        if (has_gold && player.parentElement.id == EXIT_CELL) {
            KEY_CODES = {};
            var win = document.createElement("h3");
            var win_text = document.createTextNode(">>> You escaped! Winner!");
            win.appendChild(win_text);
            document.body.appendChild(win);
        }
    };

    window.onkeydown = function(event) {
        if (event.keyCode in KEY_CODES) {
            move(player, event.keyCode);
            move(wumpus, random_num(37,41));
            postMoveAction();
        } else if (event.keyCode == 13) {
            location.reload();
        }
    };
    
    document.getElementById("refresh").onclick = function() {
        location.reload();
    };
    
    document.getElementsByTagName("table")[0].ontouchstart = function(event) {
        if (has_gold && player.parentElement.id == EXIT_CELL) {
            return;
        }
        var location = event.targetTouches[0].target.id.split("-");
        var player_loc = player.parentElement.id.split("-");
        var xDiff = Number(location[0]) - Number(player_loc[0]);
        var canMove = true;
        if (xDiff > 0) {
            move(player, KEY_CODES["DOWN"]);
            canMove = false;
        } else if (xDiff < 0) {
            move(player, KEY_CODES["UP"]);
            canMove = false;
        }
        var yDiff = Number(location[1]) - Number(player_loc[1]);
        if (canMove && yDiff > 0) {
            move(player, KEY_CODES["RIGHT"]);
        } else if (canMove && yDiff < 0) {
            move(player, KEY_CODES["LEFT"]);
        }
        move(wumpus, random_num(37,41));
        postMoveAction();
    };
})();