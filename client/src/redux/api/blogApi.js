import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:5000";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/blog` }),
  endpoints: (builder) => ({
    // Create blog post
    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: "/create",
        method: "POST",
        body: newBlog,
      }),
    }),

    // Get all blog posts
    getAllBlogs: builder.query({
      query: () => "/read",
    }),

    // Get a blog post by ID
    getBlogById: builder.query({
      query: (postId) => `/read/${postId}`,
    }),

    // Update blog post by ID
    updateBlogById: builder.mutation({
      query: ({ postId, updatedBlog }) => ({
        url: `/update/${postId}`,
        method: "PUT",
        body: updatedBlog,
      }),
    }),

    // Delete blog post by ID
    deleteBlogById: builder.mutation({
      query: (postId) => ({
        url: `/delete/${postId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useUpdateBlogByIdMutation,
  useDeleteBlogByIdMutation,
} = blogApi;

export default blogApi;
