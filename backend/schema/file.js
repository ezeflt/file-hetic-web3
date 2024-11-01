import {Schema, module} from 'mongoose';

const fileSchema = new Schema({
    name: String,
    size: Number,
});

const File = mongoose.model('files', fileSchema);

export default File;