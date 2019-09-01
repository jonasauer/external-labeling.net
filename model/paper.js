const mongoose = require('mongoose');

const paper_schema = mongoose.Schema({
    _id:        String,
    title:      {type: String,      required: true                      },
    year:       {type: Number,      required: true                      },
    authors:    {type: String,      required: true                      },
    doi:        {type: String,      required: false                     },
    dblp:       {type: String,      required: false                     },
    bibtex:     {type: String,      required: true                      },
    filters:    {type: [String],    required: true                      },
    image_path: {type: String,      required: true                      },
    visible:    {type: Boolean,     required: true,     default: false  }
}, {collection: global.config.paper_collection});

paper_schema.pre('save', function(next) {
    this._id = this._id.toString();
    next();
});

module.exports = mongoose.model('Paper', paper_schema);