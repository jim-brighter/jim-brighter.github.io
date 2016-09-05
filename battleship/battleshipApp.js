var battleship = angular.module("battleship", []);

battleship.constant("game_vals", {
    ROWS: ["A","B","C","D","E","F","G","H","I","J"],
    PLAYER_STRING: "Player",
    CPU_STRING: "CPU",
    CURRENT_PLAYER_MAP: {
        "1": "Player",
        "-1": "CPU",
        "Player": 1,
        "CPU": -1
    },
    ORIENTATIONS: {
        NORTH: "NORTH",
        SOUTH: "SOUTH",
        EAST: "EAST",
        WEST: "WEST",
        1: "NORTH",
        2: "SOUTH",
        3: "EAST",
        4: "WEST"
    },
    TAKE_TURN: "takeTurn"
});

battleship.controller("battlectrl", ["$scope", "game_vals", function($scope, game_vals) {

    function Ship(name, length) {
        this.name = name;
        this.key = name.split(" ")[0].toUpperCase();
        this.length = length;
        this.hits = 0;
    };

    function Fleet(admiral) {
        this.admiral = admiral;
        this.fleet = {
            PATROL: new Ship("Patrol Boat", 2),
            SUBMARINE: new Ship("Submarine", 3),
            DESTROYER: new Ship("Destroyer", 3),
            BATTLESHIP: new Ship("Battleship", 4),
            AIRCRAFT: new Ship("Aircraft Carrier", 5)
        };
    };

    function Cell(row, col, shipHere, hitInd, whoseBoard) {
        this.r = row;
        this.c = col;
        this.shipHere = shipHere;
        this.hitInd = hitInd;
        this.whoseBoard = whoseBoard;
    };

    function Board(whoseBoard) {
        this.board = [];
        this.whoseBoard = whoseBoard;
        this.init = function() {
            for (var x = 0; x < 10; x++) {
                this.board.push([]);
                for (var y = 0; y < 10; y++) {
                    this.board[x].push(new Cell(game_vals.ROWS[x], y+1, null, null, this.whoseBoard));
                }
            }
        };
        this.init();
    };

    $scope.currentPlayer = 1;

    $scope.myBoard = new Board(game_vals.PLAYER_STRING);

    $scope.oppBoard = new Board(game_vals.CPU_STRING);

    $scope.myShips = new Fleet(game_vals.PLAYER_STRING)

    $scope.oppShips = new Fleet(game_vals.CPU_STRING);

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var shipInCell = function(row,col,board) {
        if (board.board[game_vals.ROWS.indexOf(row)][col-1].shipHere != null && board.board[game_vals.ROWS.indexOf(row)][col-1].hitInd == null) {
            return true;
        }
        return false;
    };

    var checkShipPlacement = function(ship, row, col, orientation, board) {
        if (game_vals.ROWS.indexOf(row) < 0) {
            console.log("Invalid row placement");
            return false;
        } else if (col < 1 || col > 10) {
            console.log("Invalid col placement");
            return false;
        } else if (ship == null || typeof(ship) == "undefined") {
            console.log("Invalid ship");
            return false;
        }
        switch(orientation) {
            case game_vals.ORIENTATIONS.NORTH:
            if ((game_vals.ROWS.indexOf(row) + 1) - ship.length < 0) {
                return false;
            }
            for (var x = game_vals.ROWS.indexOf(row); x >= (game_vals.ROWS.indexOf(row) - (ship.length - 1)); x--) {
                if (shipInCell(game_vals.ROWS[x],col,board)) {
                    return false;
                }
            }
            break;

            case game_vals.ORIENTATIONS.SOUTH:
            if ((game_vals.ROWS.indexOf(row) - 1) + ship.length >= 10) {
                return false;
            }
            for (var x = game_vals.ROWS.indexOf(row); x <= (game_vals.ROWS.indexOf(row) + (ship.length - 1)); x++) {
                if (shipInCell(game_vals.ROWS[x],col,board)) {
                    return false;
                }
            }
            break;

            case game_vals.ORIENTATIONS.EAST:
            if ((col - 2) + ship.length >= 10) {
                return false;
            }
            for (var x = col; x <= (col + (ship.length - 1)); x++) {
                if (shipInCell(row,x,board)) {
                    return false;
                }
            }
            break;

            case game_vals.ORIENTATIONS.WEST:
            if (col - ship.length < 0) {
                return false;
            }
            for (var x = col; x >= (col - (ship.length - 1)); x--) {
                if (shipInCell(row,x,board)) {
                    return false;
                }
            }
            break;

            default:
            console.log("Invalid orientation");
            return false;
        }
        return true;
    };

    var placeShip = function(ship, row, col, orientation, board) {
        if (!checkShipPlacement(ship,row,col,orientation,board)) {
            if (board == $scope.myBoard) {console.log("Cannot place ship at: " + row + col + " " + orientation);}
            return false;
        }
        switch(orientation) {
            case game_vals.ORIENTATIONS.NORTH:
            for (var x = game_vals.ROWS.indexOf(row); x >= (game_vals.ROWS.indexOf(row) - (ship.length - 1)); x--) {
                board.board[x][col-1].shipHere = ship.key;
            }
            break;

            case game_vals.ORIENTATIONS.SOUTH:
            for (var x = game_vals.ROWS.indexOf(row); x <= (game_vals.ROWS.indexOf(row) + (ship.length - 1)); x++) {
                board.board[x][col-1].shipHere = ship.key;
            }
            break;

            case game_vals.ORIENTATIONS.EAST:
            for (var x = col - 1; x <= (col - 1 + (ship.length - 1)); x++) {
                board.board[game_vals.ROWS.indexOf(row)][x]. shipHere = ship.key;
            }
            break;

            case game_vals.ORIENTATIONS.WEST:
            for (var x = col - 1; x >= (col - 1 - (ship.length - 1)); x--) {
                board.board[game_vals.ROWS.indexOf(row)][x]. shipHere = ship.key;
            }
            break;

            default:
            break;
        }
        return true;
    };

    var placeAllShips = function(board) {
        for (var k in $scope.oppShips.fleet) {
            var tryingShip = true;
            while (tryingShip) {
                var ship = $scope.oppShips.fleet[k];
                var row = game_vals.ROWS[getRandomInt(0,9)];
                var col = getRandomInt(1,10);
                var orient = game_vals.ORIENTATIONS[getRandomInt(1,4)];
                var attempt = placeShip(ship,row,col,orient,board);
                if (attempt) {
                    tryingShip = false;
                }
            }
        }
    };

    placeAllShips($scope.oppBoard);
    placeAllShips($scope.myBoard);

    var setHit = function(row,col,board,fleet) {
        var cell = board.board[game_vals.ROWS.indexOf(row)][col-1];
        cell.hitInd = true;
        var ship = fleet.fleet[cell.shipHere];
        ship.hits++;
        if (ship.hits >= ship.length) {
            alert(game_vals.CURRENT_PLAYER_MAP[$scope.currentPlayer.toString()] + " sunk their opponent's " + ship.name + "!");
        }
    }

    var setMiss = function(row,col,board) {
        board.board[game_vals.ROWS.indexOf(row)][col-1].hitInd = false;
    }

    var takeCPUTurn = function() {
        $scope.fire(game_vals.ROWS[getRandomInt(0,9)],getRandomInt(1,10),$scope.myBoard,$scope.myShips);
    };

    $scope.$on(game_vals.TAKE_TURN, function(event) {
        if ($scope.currentPlayer < 0) {
            takeCPUTurn();
        }
    });

    $scope.fire = function(row, col, board, fleet) {
        if (board.board[game_vals.ROWS.indexOf(row)][col-1].hitInd != null) {
            console.log(game_vals.CURRENT_PLAYER_MAP[$scope.currentPlayer.toString()] + " already guessed there!");
            $scope.$emit(game_vals.TAKE_TURN);
            return;
        }
        if (shipInCell(row,col,board)) {
            setHit(row,col,board,fleet);
        } else {
            setMiss(row,col,board);
        }
        $scope.currentPlayer *= -1;
        $scope.$emit(game_vals.TAKE_TURN);
    };

    $scope.range = function(min,max,step) {
        step = step || 1;
        var arr = [];
        for (var x = min; x <= max; x += step) {
            arr.push(x);
        }
        return arr;
    };
}]);

battleship.filter("noZeroes", function() {
    return function(input) {
        if (input == 0) {
            return null;
        }
        return input;
    }
});