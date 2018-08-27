const game = require('../../components/game');

$("#colorPicker").spectrum({
    color: "white",
    showInput: true,
    showButtons: false,
    change: (color) => {
        $("#colorTool").css('background-color', color.toHexString());
        game.invoke('SetColor', '(' + (color._r / 256.0) + ',' + (color._g / 256.0) + ',' + (color._b / 256.0) + ')');
    }
});