import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String
});

// Before saving the user, hash the password
schema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, function(error, hash) {
      if (error) { return next(error); }
      user.password = hash;
      next();
    });
  });
});

schema.methods.comparePassword = function(candidatePassword: any, callback: any) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
schema.set('toJSON', {
  transform: function(doc: any, ret: any, options: any) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', schema);

export default User;
