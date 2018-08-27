$('.tool-group .tools button.tool').on('click', function () {
    $('.tool-group .tools button.tool.active').removeClass('active');
    $(this).addClass('active');
});

window.setActiveTool = (tool) => {
    $('.tool-group .tools button.tool.active').removeClass('active');
    $('button.tool[unity-value="' + tool + '"]').addClass('active');
};