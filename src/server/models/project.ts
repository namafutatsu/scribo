import * as mongoose from 'mongoose';

const item = new mongoose.Schema({
  discriminator: Number,
  id: String,
  index: Number,
  name: String,
  text: String,
  notes: [
    {
      id: String,
      index: Number,
      text: String,
      status: Number,
    }
  ]
});
item.add({ sitems: [item] });

const schema = new mongoose.Schema({
  discriminator: Number,
  id: String,
  key: String,
  name: String,
  open: Boolean,
  userId: mongoose.Schema.Types.ObjectId,
  sitems: [item]
});

const Project = mongoose.model('Project', schema);

export default Project;
