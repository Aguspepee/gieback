const mongoose = require("../bin/mongodb")
const errorMessage = require("../util/errorMessage")
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

//Contador Remitos
var CounterRemitosSchema = mongoose.Schema(
    {
        _id: { type: String, required: true },
        sequence_value: { type: Number, default: 1 }
    }
);
module.exports = mongoose.model('CounterRemitos', CounterRemitosSchema);