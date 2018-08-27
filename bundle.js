(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'console', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],2:[function(require,module,exports){
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
},{"../game":3,"../properties":5}],3:[function(require,module,exports){
module.exports = {
    invoke: (method, arg) => {
        if(window.gameInstance != null) {
            window.gameInstance.SendMessage("Editor", method, arg);
        }
    },
    init: (layout) => {
        window.storeScene = (json) => {
            console.log("saved!");
            localStorage.setItem("scene", json);
        };

        layout.registerComponent( 'game', function( container, componentState ){
            console.log('created game component swag');
            container.getElement().html( '<h2>ur not supposed to see me btw</h2>' );
            window.gameInstance = UnityLoader.instantiate(container.getElement()[0], "unity_build/Build/unity_build.json");
            container.getElement().find('canvas').attr('tabindex', '1');
            
            container.on('resize', () => {
                var canvas = container.getElement().find('canvas');
                canvas.attr('width', container.getElement().width());
                canvas.attr('height', container.getElement().height());
            });
        });
    }
};
},{}],4:[function(require,module,exports){
module.exports = (layout) => {
    require('./game').init(layout);
    require('./explorer')(layout);
    require('./console')(layout);
    require('./properties').init(layout);
    require('./workshop')(layout);
};
},{"./console":1,"./explorer":2,"./game":3,"./properties":5,"./workshop":6}],5:[function(require,module,exports){
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
},{"../game":3}],6:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'workshop', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],7:[function(require,module,exports){
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
},{"../../components/game":3}],8:[function(require,module,exports){
require('./tools');
require('./edit');

$('[unity-object]').on('click', function() {
    window.gameInstance.SendMessage($(this).attr('unity-object'), $(this).attr('unity-method'), $(this).attr('unity-value'));
});
},{"./edit":7,"./tools":9}],9:[function(require,module,exports){
$('.tool-group .tools button.tool').on('click', function () {
    $('.tool-group .tools button.tool.active').removeClass('active');
    $(this).addClass('active');
});

window.setActiveTool = (tool) => {
    $('.tool-group .tools button.tool.active').removeClass('active');
    $('button.tool[unity-value="' + tool + '"]').addClass('active');
};
},{}],10:[function(require,module,exports){
const defaultLayout = {
    content: [{
        type: 'row',
        content: [
            {
                type: 'column',
                width: 15,
                content:[{
                    type: 'component',
                    componentName: 'workshop'
                }]
            },{
                type: 'column',
                content:[{
                    type: 'component',
                    componentName: 'game'
                },{
                    type: 'component',
                    componentName: 'console'
                }]
            },{
                type: 'column',
                width: 15,
                content:[{
                    type: 'component',
                    componentName: 'explorer'
                },{
                    type: 'component',
                    componentName: 'properties'
                }]
            }
        ]
    }]
};


require('./toolbar');

const layout = new GoldenLayout( defaultLayout, $('.container') );
$(window).on('resize', () => layout.updateSize($('.container').width(), $('.container').height()));
require('./components')(layout);
layout.init();
},{"./components":4,"./toolbar":8}]},{},[10]);
