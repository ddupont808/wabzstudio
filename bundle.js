(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'explorer', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],2:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'game', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],3:[function(require,module,exports){
module.exports = (layout) => {
    require('./game')(layout);
    require('./explorer')(layout);
    require('./properties')(layout);
    require('./workshop')(layout);
};
},{"./explorer":1,"./game":2,"./properties":4,"./workshop":5}],4:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'properties', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],5:[function(require,module,exports){
module.exports = (layout) => {
    layout.registerComponent( 'workshop', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};
},{}],6:[function(require,module,exports){
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
                type: 'component',
                componentName: 'game'
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

const layout = new GoldenLayout( defaultLayout );
require('./components')(layout);
layout.init();
},{"./components":3}]},{},[6]);
