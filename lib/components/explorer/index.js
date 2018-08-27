const properties = require('../properties');
const gameGL = require('../game');
const icons = {
    world: 'silkicons/world.png',
    part: 'silkicons/brick.png',
    texture: 'silkicons/shading.png',
    group: 'silkicons/bricks.png',
    weld: 'silkicons/link.png',
    spawn: 'silkicons/brick_link.png'
};

module.exports = (layout) => {
    layout.registerComponent( 'explorer', function( container, componentState ){
        let list = $('<div/>')
            .addClass('explorer')
            .appendTo(container.getElement())
            .on('click', () => {
                gameGL.invoke("ClearSelection");
            });
        
        let selectQueue = [];

        window.clearSelection = () => {
            $('.explorer .instance.active').removeClass('active');
            selectQueue = [];
        };
    
        window.selectInstance = (id) => {
            var el = $('.explorer .instance[id=' + id + ']');
            if(el.length) {
                el.addClass('active');
                properties.target(el.data('instance'));
            } else {
                console.log("Attempted to target unloaded instance [ " + id + " ] !");
                selectQueue.push(id);
            }
        };

        window.addNewInstance = (parent, json) => {
            console.log("adding " + json);
            let p = $('.explorer .instance[id=' + parent + ']');
            let item = JSON.parse(json);
            if(p.length == 0) {
                console.log("skipped cuz parent doesnt exist");
            } else {
                createElement(p.data('children'), item, p.data('indent') + 18);
                p.data('bullet').attr('style', '');

                var ind = selectQueue.indexOf(item.id);
                if(ind > -1) {
                    selectQueue.splice(ind, 1);
                    console.log('selecting newly instanced ' + item.id);
                    window.selectInstance(item.id);
                }
            }
        };

        let autoLoaded = false;

        window.parseScene = (json) => {
            if(!autoLoaded) {
                autoLoaded = true;
                var oldSave = localStorage.getItem("scene");
                if(oldSave != null) {
                    gameGL.invoke("LoadGame", oldSave);
                    return;
                }
            }

            let game = JSON.parse(json);

            createElement = (parent, i, indent) => {
                var expanded = false;
                var children = $('<div/>').hide();

                var bullet = $('<img/>')
                    .addClass('bullet')
                    .attr('src', '/icons/bullet_expand.png')
                    .on('click', () => {
                        bullet.attr('src', expanded ? '/icons/bullet_expand.png' : '/icons/bullet_expanded.png'); 
                        expanded = !expanded;
                        children.slideToggle(100);

                        if(event)
                            event.stopPropagation();
                    });
                var div = $('<div/>')
                    .addClass('instance')
                    .attr('style', 'padding-left: ' + indent + 'px')
                    .attr('id', i.id)
                    .data('instance', i)
                    .data('children', children)
                    .data('indent', indent)
                    .data('bullet', bullet)
                    .append(bullet)
                    .append($('<img/>')
                        .attr('src', icons[i.className] || '/silkicons/shape_square.png'))
                    .append($('<span/>')
                        .text(i.name))
                    .on('click', () => {
                        console.log("swag");
                        if(!event.ctrlKey)
                            gameGL.invoke("ClearSelection");
                        gameGL.invoke("SelectInstance", i.id);

                        event.stopPropagation();
                    });
                
                for(var j = 0; j < i.children.length; j++) {
                    createElement(children, i.children[j], indent + 18);
                }
                
                div.appendTo(parent);
                if(i.children.length == 0)
                    bullet.attr('style', 'visibility: hidden');
                children.appendTo(parent);

                if(i.className == 'world')
                    bullet.triggerHandler('click');
            };

            list.html('');
            for(var i = 0; i < game.children.length; i++) {
                createElement(list, game.children[i], 0);
            }
        };
    });
};