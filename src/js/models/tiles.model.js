import mongoose from 'mongoose';

const TileSchema = mongoose.Schema({
    x: {type: Number, required: true, unique: false, index: false},
    y: {type: Number, required: true, unique: false, index: false},
    z: {type: Number, required: true, unique: false, index: false},
    type: {type: Number, required: true, unique: false, index: false},
    content: [{}]
}, {collection: 'Tile'});

const TilesModel = mongoose.model('Tile', TileSchema);


TilesModel.getAll = () => {
    return TilesModel.find({});
};

TilesModel.getTile = (x, y) => {
    return TilesModel.findOne({x: x, y: y});
};

TilesModel.updateTile = (x, y, o) => {
    return TilesModel.update({x: x, y: y}, { $set: o });
};

TilesModel.addTile = (tileToAdd) => {
    return tileToAdd.save();
};

TilesModel.removeTile = (x, y) => {
    return TilesModel.remove({x: x, y: y});
};

export default TilesModel;
