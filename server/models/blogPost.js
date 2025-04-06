import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, default: "John Doe" },
    keywords: { type: [String], default: [] },
    metaDescription: { type: String },
    featuredImage: { type: String },
    ogData: {
      type: Object,
      default: {
        title: "",
        description: "",
        image: "",
      },
    },
    twitterCardData: {
      type: Object,
      default: {
        title: "",
        description: "",
        image: "",
      },
    },
    publicationDate: { type: Date, default: Date.now },
    categories: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

const BlogPost = mongoose.model("blogPost", blogPostSchema);

export default BlogPost;
