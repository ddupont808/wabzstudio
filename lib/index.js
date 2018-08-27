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