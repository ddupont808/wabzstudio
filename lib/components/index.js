module.exports = (layout) => {
    require('./game').init(layout);
    require('./explorer')(layout);
    require('./console')(layout);
    require('./properties').init(layout);
    require('./workshop')(layout);
};