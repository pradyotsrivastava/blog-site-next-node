import cloudinary from "../config/cloudinaryConfig.js";
import BlogPost from "../models/BlogPost.js";

// Get All Blog Post
export const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      categories,
      sortBy = "publicationDate",
      order = "desc",
    } = req.query;

    const pageNumber = Math.max(1, parseInt(page));
    const pageLimit = Math.max(1, parseInt(limit));

    const skip = (pageNumber - 1) * pageLimit;

    let filter = {};
    if (status) filter.status = status;
    if (categories) filter.categories = { $in: categories.split(",") };

    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    const posts = await BlogPost.find(filter)
      .skip(skip)
      .limit(pageLimit)
      .sort(sort);

    const totalPosts = await BlogPost.countDocuments(filter);

    if (posts.length === 0) {
      return res.status(404).json({ message: "No blog posts found" });
    }

    res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / pageLimit),
      currentPage: pageNumber,
      posts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blog posts", error: error.message });
  }
};

// Get Single Blog Post By Id
export const getBlogById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await BlogPost.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching the blog post", error: error.message });
  }
};

// Create Blog Post
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      content,
      author,
      keywords,
      metaDescription,
      featuredImage,
      ogData,
      twitterCardData,
      publicationDate,
      categories,
      status,
    } = req.body;

    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res
        .status(400)
        .json({ message: "A blog post with this slug already exists." });
    }

    let imageUrl = "";
    let imagePublicId = "";
    if (featuredImage) {
      const uploadResponse = await cloudinary.uploader.upload(featuredImage, {
        folder: "blog_images",
        public_id: `${Date.now()}-${slug}`,
        resource_type: "auto",
      });
      imageUrl = uploadResponse.secure_url;
      imagePublicId = uploadResponse.public_id;
    }

    const newPost = new BlogPost({
      title,
      content,
      slug,
      keywords: keywords || [],
      author: author || "John Doe",
      publicationDate: publicationDate || new Date(),
      categories: categories || [],
      metaDescription,
      featuredImage: imageUrl,
      status: status || "draft",
      ogData,
      twitterCardData,
      imagePublicId,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Blog Post created successfully!", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating blog post", error: error.message });
  }
};

// Update Blog Post
export const updateBlogById = async (req, res) => {
  const { postId } = req.params;
  try {
    const {
      title,
      slug,
      content,
      author,
      keywords,
      metaDescription,
      featuredImage,
      ogData,
      twitterCardData,
      publicationDate,
      categories,
      status,
    } = req.body;

    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    let imageUrl = post.featuredImage;
    let imagePublicId = post.imagePublicId;

    if (featuredImage && featuredImage !== post.featuredImage) {
      const uploadResponse = await cloudinary.uploader.upload(featuredImage, {
        folder: "blog_images",
        public_id: `${postId}-${slug}`,
        resource_type: "auto",
      });

      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      imageUrl = uploadResponse.secure_url;
      imagePublicId = uploadResponse.public_id;
    }

    post.title = title || post.title;
    post.slug = slug || post.slug;
    post.content = content || post.content;
    post.keywords = keywords || post.keywords;
    post.author = author || post.author;
    post.publicationDate = publicationDate || post.publicationDate;
    post.categories = categories || post.categories;
    post.metaDescription = metaDescription || post.metaDescription;
    post.featuredImage = imageUrl;
    post.imagePublicId = imagePublicId;
    post.status = status || post.status;
    post.ogData = ogData || post.ogData;
    post.twitterCardData = twitterCardData || post.twitterCardData;

    await post.save();

    res.status(200).json({ message: "Blog Post updated successfully!", post });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating blog post", error: error.message });
  }
};

// Delete Single Blog Post By Id
export const deleteBlogById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

   
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.remove();

    res.status(200).json({ message: "Blog Post deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting blog post", error: error.message });
  }
};

// Delete All Blog Posts
export const deleteAllBlogs = async (req, res) => {
  try {
   
    const posts = await BlogPost.find();

    if (posts.length === 0) {
      return res.status(404).json({ message: "No blog posts found" });
    }

   
    for (const post of posts) {
      if (post.imagePublicId) {
        await cloudinary.uploader.destroy(post.imagePublicId);
      }

      await post.remove();
    }

    res.status(200).json({ message: "All blog posts deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all blog posts", error: error.message });
  }
};
