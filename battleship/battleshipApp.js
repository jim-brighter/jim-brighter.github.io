var battleship = angular.module("battleship", []);

var rows = ["A","B","C","D","E","F","G","H","I","J"];
var orientations = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST"
};

battleship.controller("battlectrl", ["$scope", function($scope) {
    $scope.currentPlayer = 1;

    $scope.myBoard = [];
    for (var x = 0; x < 10; x++) {
        $scope.myBoard.push([]);
        for (var y = 0; y < 10; y++) {
            $scope.myBoard[x].push({r: rows[x], c: y+1, shipHere: null, hitInd: null});
        }
    }

    $scope.oppBoard = [];
    for (var x = 0; x < 10; x++) {
        $scope.oppBoard.push([]);
        for (var y = 0; y < 10; y++) {
            $scope.oppBoard[x].push({r: rows[x], c: y+1, shipHere: null, hitInd: null});
        }
    }

    $scope.myShips = {
        PATROL: {
            name: "Patrol Boat",
            length: 2,
            headPosition: null,
            orientation: null,
            hits: [false, false]
        },
        SUBMARINE: {
            name: "Submarine",
            length: 3,
            headPosition: null,
            orientation: null,
            hits: [false, false, false]
        },
        DESTROYER: {
            name: "Destroyer",
            length: 3,
            headPosition: null,
            orientation: null,
            hits: [false, false, false]
        },
        BATTLESHIP: {
            name: "Battleship",
            length: 4,
            headPosition: null,
            orientation: null,
            hits: [false, false, false, false]
        },
        AIRCRAFT: {
            name: "Aircraft Carrier",
            length: 5,
            headPosition: null,
            orientation: null,
            hits: [false, false, false, false, false]
        }
    };

    $scope.oppShips = {
        PATROL: {
            name: "Patrol Boat",
            length: 2,
            headPosition: null,
            orientation: null,
            hits: [false, false]
        },
        SUBMARINE: {
            name: "Submarine",
            length: 3,
            headPosition: null,
            orientation: null,
            hits: [false, false, false]
        },
        DESTROYER: {
            name: "Destroyer",
            length: 3,
            headPosition: null,
            orientation: null,
            hits: [false, false, false]
        },
        BATTLESHIP: {
            name: "Battleship",
            length: 4,
            headPosition: null,
            orientation: null,
            hits: [false, false, false, false]
        },
        AIRCRAFT: {
            name: "Aircraft Carrier",
            length: 5,
            headPosition: null,
            orientation: null,
            hits: [false, false, false, false, false]
        }
    };

    $scope.oppShips.BATTLESHIP.headPosition = {r: "E", c: 5};
    $scope.oppShips.BATTLESHIP.orientation = "SOUTH";

    $scope.oppBoard[rows.indexOf("E")][5-1].shipHere = "BATTLESHIP";
    $scope.oppBoard[rows.indexOf("F")][5-1].shipHere = "BATTLESHIP";
    $scope.oppBoard[rows.indexOf("G")][5-1].shipHere = "BATTLESHIP";
    $scope.oppBoard[rows.indexOf("H")][5-1].shipHere = "BATTLESHIP";

    var shipInCell = function(row,col,board) {
        if (board == "oppBoard") {
            if ($scope.oppBoard[rows.indexOf(row)][col-1].shipHere != null && $scope.oppBoard[rows.indexOf(row)][col-1].hitInd == null) {
                return true;
            }
        }
        else if (board == "myBoard") {
            if ($scope.myBoard[rows.indexOf(row)][col-1].shipHere != null && $scope.myBoard[rows.indexOf(row)][col-1].hitInd == null) {
                return true;
            }
        }
        return false;
    };

    var setHit = function(row,col,board) {
        if (board == "oppBoard") {
            var cell = $scope.oppBoard[rows.indexOf(row)][col-1];
            cell.hitInd = true;
            var ship = $scope.oppShips[cell.shipHere];
            switch(ship.orientation) {
                case "NORTH":
                    ship.hits[Math.abs(rows.indexOf(ship.headPosition.r) - rows.indexOf(row))] = true;
                    break;
                case "SOUTH":
                    ship.hits[Math.abs(rows.indexOf(ship.headPosition.r) - rows.indexOf(row))] = true;
                    break;
                case "EAST":
                    ship.hits[Math.abs(ship.headPosition.c - col)] = true;
                    break;
                case "WEST":
                    ship.hits[Math.abs(ship.headPosition.c - col)] = true;
                    break;
            }
            if (ship.hits.indexOf(false) < 0) {
                alert("You sunk your opponent's " + ship.name + "!");
            }
        } else if (board == "myBoard") {
            var cell = $scope.myBoard[rows.indexOf(row)][col-1];
            cell.hitInd = true;
            var ship = $scope.myShips[cell.shipHere];
            switch(ship.orientation) {
                case "NORTH":
                    ship.hits[Math.abs(rows.indexOf(ship.headPosition.r) - rows.indexOf(row))] = true;
                    break;
                case "SOUTH":
                    ship.hits[Math.abs(rows.indexOf(ship.headPosition.r) - rows.indexOf(row))] = true;
                    break;
                case "EAST":
                    ship.hits[Math.abs(ship.headPosition.c - col)] = true;
                    break;
                case "WEST":
                    ship.hits[Math.abs(ship.headPosition.c - col)] = true;
                    break;
            }
            if (ship.hits.indexOf(false) < 0) {
                alert("The enemy sunk your " + ship.name + "!");
            }
        }
    }

    var setMiss = function(row,col,board) {
        if (board == "oppBoard") {
            $scope.oppBoard[rows.indexOf(row)][col-1].hitInd = false;
        } else if (board == "myBoard") {
            $scope.myBoard[rows.indexOf(row)][col-1].hitInd = false;
        }
    }

    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var takeCPUTurn = function() {
        $scope.fire(rows[getRandomInt(0,9)],getRandomInt(1,10),"myBoard");
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
        var activeBoard = (board == "oppBoard" ? $scope.oppBoard : $scope.myBoard);
        if (activeBoard[rows.indexOf(row)][col-1].hitInd != null) {
            console.log("Already guessed there!");
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