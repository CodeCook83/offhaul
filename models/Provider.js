const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const providerSchema = new Schema({
  providername: {
    type: String,
    required: true
  },
  incoming: {
    type: String,
    required: true,
    default: 'false'

  },
  incomingPort: {
    type: Number,
    required: true,
    default: 0
  },
  outgoing: {
    type: String,
    required: true,
    default: 'false'
  },
  outgoingPort: {
    type: Number,
    required: true,
    default: 0
  },
  tested: {
    type: Boolean,
    required: true,
    default: false
  },
  count_access_by_user: {
    type: Number,
    required: true,
    default: 0
  },
  haveCalendar: {
    type: Boolean,
    required: true,
    default: false
  },
  haveContacts: {
    type: Boolean,
    required: true,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: false
  },
  testAccounts: [{
    email: {
      type: String,
      require: false
    },
    password: {
      type: String,
      require: false
    }
  }]
}, schemaOptions);

providerSchema.virtual('createdAtMomentjs').get(function () {
  return `${moment(this.createdAt).format('DD.MM.YYYY')} um ${moment(this.createdAt).format('H:mm:ss')}`;
})
providerSchema.virtual('updatedAtMomentjs').get(function () {
  return `${moment(this.updatedAt).format('DD.MM.YYYY')} um ${moment(this.updatedAt).format('H:mm:ss')}`;
})

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;