import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      minlength: 5,
      maxlength: 200,
    },

    image: {
      type: String,
      // required: [true, 'Image URL is required'],
      required: false,
      trim: true,
      minlength: 2,
    },

    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    published_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
