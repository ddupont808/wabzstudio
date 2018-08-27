require('./tools');
require('./edit');

$('[unity-object]').on('click', function() {
    window.gameInstance.SendMessage($(this).attr('unity-object'), $(this).attr('unity-method'), $(this).attr('unity-value'));
});