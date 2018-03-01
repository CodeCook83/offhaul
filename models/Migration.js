const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps : true
};

const migrationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  providerOld: {
    type: String,
    required: true
  },
  providerNew: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  content: [ {
    type: Schema.Types.Mixed
  }]
}, schemaOptions);


const Migration = mongoose.model('Migration', migrationSchema);

module.exports = Migration;