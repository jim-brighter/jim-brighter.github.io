var battleship = angular.module("battleship", []);

var rows = ["A","B","C","D","E","F","G","H","I","J"];

function Ship(name, length) {
    this.name = name;
    this.length = length;
    this.hits = 0;
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
                this.board[x].push(new Cell(rows[x], y+1, null, null, this.whoseBoard));
            }
        }
    };
    this.init();
};

battleship.controller("battlectrl", ["$scope", function($scope) {
    $scope.currentPlayer = 1;

    $scope.myBoard = new Board("player");

    $scope.oppBoard = new Board("cpu");

    $scope.myShips = {
        PATROL: new Ship("Patrol Boat", 2),
        SUBMARINE: new Ship("Submarine", 3),
        DESTROYER: new Ship("Destroyer", 3),
        BATTLESHIP: new Ship("Battleship", 4),
        AIRCRAFT: new Ship("Aircraft Carrier", 5)
    };

    $scope.oppShips = {
        PATROL: new Ship("Patrol Boat", 2),
        SUBMARINE: new Ship("Submarine", 3),
        DESTROYER: new Ship("Destroyer", 3),
        BATTLESHIP: new Ship("Battleship", 4),
        AIRCRAFT: new Ship("Aircraft Carrier", 5)
    };

    $scope.oppBoard.board[rows.indexOf("E")][4].shipHere = "BATTLESHIP";
    $scope.oppBoard.board[rows.indexOf("F")][4].shipHere = "BATTLESHIP";
    $scope.oppBoard.board[rows.indexOf("G")][4].shipHere = "BATTLESHIP";
    $scope.oppBoard.board[rows.indexOf("H")][4].shipHere = "BATTLESHIP";

    var shipInCell = function(row,col,board) {
        if (board.board[rows.indexOf(row)][col-1].shipHere != null && board.board[rows.indexOf(row)][col-1].hitInd == null) {
            return true;
        }
        return false;
    };

    var setHit = function(row,col,board) {
        var cell = board.board[rows.indexOf(row)][col-1];
        cell.hitInd = true;
        var ship = $scope.oppShips[cell.shipHere];
        ship.hits++;
        if (ship.hits >= ship.length) {
            alert("You sunk your opponent's " + ship.name + "!");
        }
    }

    var setMiss = function(row,col,board) {
        board.board[rows.indexOf(row)][col-1].hitInd = false;
    }

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var takeCPUTurn = function() {
        $scope.fire(rows[getRandomInt(0,9)],getRandomInt(1,10),$scope.myBoard);
    };

    $scope.$on("playerChanged", function(event) {
        if ($scope.currentPlayer < 0) {
            takeCPUTurn();
        }
    });

    $scope.$on("cpuRetry", function(event) {
        takeCPUTurn();
    });

    $scope.fire = function(row, col, board) {
        if (board.board[rows.indexOf(row)][col-1].hitInd != null) {
            console.log("Player " + ($scope.currentPlayer == 1 ? "PLAYER" : "CPU") + " already guessed there!");
            if ($scope.currentPlayer < 0) {
                $scope.$emit("cpuRetry");
            }
            return;
        }
        if (shipInCell(row,col,board)) {
            setHit(row,col,board);
        } else {
            setMiss(row,col,board);
        }
        $scope.currentPlayer *= -1;
        $scope.$emit("playerChanged");
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