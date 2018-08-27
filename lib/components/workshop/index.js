module.exports = (layout) => {
    layout.registerComponent( 'workshop', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
};