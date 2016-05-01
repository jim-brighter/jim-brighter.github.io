$(document).ready(function() {
    alert("Only works with simple calculations. Clear after each calculation for best results.");

    var num1 = "";
    var num2 = "";
    var ops = "";
    var result = "";

    $(".number").click(function() {
        var n = $(this).text();
        $("#display-text").text($("#display-text").text() + n);
    });

    $(".operator").click(function() {
        ops = $(this).text();
        num1 = $("#display-text").text();
        $("#display-text").text("");
    });

    $("#clear").click(function() {
        num1 = "";
        num2 = "";
        ops = "";
        result = "";
        $("#display-text").text("");
    });

    $("#equals").click(function() {
        num2 = $("#display-text").text();
        switch (ops) {
            case "/":
            if (Number(num2) != 0) {
                result = Number(num1) / Number(num2);
            } else {
                result = 0;
            }
            break;

            case "*":
            result = Number(num1) * Number(num2);
            break;

            case "+":
            result = Number(num1) + Number(num2);
            break;

            case "-":
            result = Number(num1) - Number(num2);
            break;

            default:
            result = 0;
            break;
        }

        result = Math.floor(result * 1000) / 1000;

        $("#display-text").text("" + result);
        num1 = "";
        num2 = "";
        ops = "";
        result = "";
    });
});