const game = require('../game');
var element = null;

module.exports = {
    init: (layout) => {
        layout.registerComponent( 'properties', function( container, componentState ){
            element = $('<div/>').addClass('properties').appendTo(container.getElement());
            window.updateProperty = (id, prop, val) => {
                $('td[path="' + id + '/' + prop + '"]').text(val);
            };
        });
    },
    target: (instance) => {
        element.html('');
        var expanded = true;

        var groupHolder = $('<div/>');
        var group = $('<table/>').attr('cellspacing', '0').appendTo(groupHolder);
        var bullet = $('<img/>')
            .addClass('bullet')
            .attr('src', '/icons/bullet_expanded.png')
            .on('click', () => {
                bullet.attr('src', expanded ? '/icons/bullet_expand.png' : '/icons/bullet_expanded.png'); 
                expanded = !expanded;
                groupHolder.slideToggle(100);
            });
        var header = $('<div/>').addClass('header').append(bullet).append('Appearance').appendTo(element);
        groupHolder.appendTo(element);

        for(var i = 0; i < instance.properties.length; i++) {
            let prop = instance.properties[i];
            let valyoo = $('<td/>').text(prop.value).on('click', () => {
                if(valyoo.attr('contentEditable') == 'true') return;
                valyoo.attr('contentEditable', 'true').focus();
                document.execCommand('selectAll', false, null);
            }).on('blur', () => {
                valyoo.attr('contentEditable', 'false');
            }).on('keydown', (e) => {
                if(e.keyCode == 13) {
                    let payload = JSON.stringify({
                        instance: instance.id,
                        property: prop.name,
                        value: valyoo.text()
                    });

                    console.log(payload);
                    game.invoke("SetValue", payload);

                    valyoo.blur();
                    e.preventDefault();
                }
            }).attr('path', instance.id + '/' + prop.name);

            $('<tr/>')
            .append($('<td/>').text(prop.name))
            .append(valyoo).appendTo(group);
        }
    }
};