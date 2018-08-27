module.exports = (layout) => {
    layout.registerComponent( 'console', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};