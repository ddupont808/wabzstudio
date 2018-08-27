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