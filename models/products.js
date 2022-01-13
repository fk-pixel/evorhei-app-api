const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const sequencing = require("../config/sequencing");
const autoIncrement = require('mongoose-sequence')(mongoose);

const creatorSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const productsSchema = new Schema(
    {
        _id: {
            type: Number,
        },
        material: {
            type: String,
            required: true
        },
        chargenNumber: {
            type: String,
            required: true
        },
        menge: {
            type: Number,
            required: [true, 'Menge is required'],
            validate: {
                validator: function(v) {
                  return /^\+?(1|[1-9]\d*)$/.test(v);
                },
                message: `{VALUE} is not a valid number!`
            }
        },
        creator: [creatorSchema],
    }, 
        { timestamps: true },
        { _id: false } 
    );
    
    // Autoincrement by product
    productsSchema.plugin(autoIncrement);
    
    // Seond way
        /* productsSchema.pre("save", function (next) {
        let doc = this;
        sequencing.getSequenceNextValue("product_id")
        .then(counter => {
            console.log("asdasd", counter);
            if(!counter) {
                sequencing.insertCounter("product_id")
                .then(counter => {
                    doc._id = counter;
                    console.log(doc)
                    next();
                })
                .catch(error => next(error))
            } else {
                doc._id = counter;
                next();
            }
        })
        .catch(error => next(error))
    }); */
    
    /* productsSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      }); */

module.exports = mongoose.model('Products', productsSchema);