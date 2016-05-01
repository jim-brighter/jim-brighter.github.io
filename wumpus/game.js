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
    var wumpus = document.createElement("div");
    var gold = document.createElement("div");
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

    window.onkeydown = function(event) {
        if (event.keyCode in KEY_CODES) {
            move(player, event.keyCode);
            move(wumpus, random_num(37,41));
            if (player.parentElement.id == wumpus.parentElement.id) {
                KEY_CODES = {};
                alert("You lost! The Wumpus killed you!");
            }
            if (gold.parentElement && player.parentElement.id == gold.parentElement.id) {
                gold.parentElement.removeChild(gold);
                has_gold = true;
                alert("You got the gold! Escape!");
            }
            if (has_gold && player.parentElement.id == EXIT_CELL) {
                KEY_CODES = {};
                alert("Congrats, you won!");
            }
        }
    };
})();