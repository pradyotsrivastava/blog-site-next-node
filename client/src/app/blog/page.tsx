"use client";

import PreviewModal from "@/app/modal/blog/PreviewModal";
import { useEditorStore } from "@/zustand/use-editor-store";
import { useEffect, useState } from "react";
import { Editor } from "./component/editor";
import Keywords from "./component/keywords";
import MetaDescription from "./component/metaDescription";
import PageTitle from "./component/pageTitle";
import Permalink from "./component/permalink";
import Toolbar from "./component/toolbar";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { v4 as uuidv4 } from "uuid";

const generateUniqueId = () => {
  return uuidv4();
};

export default function Page() {
  const { editor } = useEditorStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    metaDescription: "",
    slug: "",
    keywords: [] as string[],
    author: "",
    publicationDate: "",
    categories: [] as string[],
    featuredImage: "",
    status: "draft",
    ogData: {
      title: "",
      description: "",
      image: "",
      url: "",
    },
    twitterCardData: {
      title: "",
      description: "",
      image: "",
    },
  });

  const [createBlog, { isLoading, isError }] = useCreateBlogMutation();

  useEffect(() => {
    const storedAuthor = localStorage.getItem("author");
    setFormData((prev) => ({
      ...prev,
      author: storedAuthor || "John Doe",
    }));
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "title") {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug,
        ogData: { ...prev.ogData, title: value },
        twitterCardData: { ...prev.twitterCardData, title: value },
      }));
    } else if (field === "metaDescription") {
      setFormData((prev) => ({
        ...prev,
        metaDescription: value,
        ogData: { ...prev.ogData, description: value },
        twitterCardData: { ...prev.twitterCardData, description: value },
      }));
    } else if (field === "slug") {
      setFormData((prev) => ({
        ...prev,
        slug: value,
        ogData: { ...prev.ogData, url: `https://your-website.com/${value}` },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleEditorContentChange = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        content: htmlContent,
      }));
    }
  };

  const handlePreviewClick = () => {
    if (editor) {
      const content = editor.getHTML();
      setPreviewContent(content);
      setIsModalOpen(true);
    } else {
      console.error("Editor is not initialized.");
    }
  };

  const handlePublish = async () => {
    if (editor) {
      try {
        const content = editor.getHTML();
        const currentDate = new Date().toISOString();

        const postId = generateUniqueId();

        const updatedFormData = {
          ...formData,
          id: postId,
          content,
          publicationDate: currentDate,
        };

        const result = await createBlog(updatedFormData);

        if (result.error) {
          console.error("Error during publishing:", result.error);
        } else {
          console.log("Blog post created successfully", result.data);
        }
      } catch (error) {
        console.error("Error during publishing:", error);
      }
    } else {
      console.error("Editor is not initialized.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="border-b text-gray-500"></div>
      <div className="flex gap-4 w-full p-2 mt-2">
        <div className="flex flex-col gap-2 overscroll-none w-3/4 p-2 border">
          <PageTitle
            value={formData.title}
            onChange={(value) => handleInputChange("title", value)}
          />
          <Toolbar />
          <Editor data={""} />
        </div>
        <div className="flex flex-col gap-4 overflow-y-hidden w-1/4">
          <button className="px-2 py-1 border" onClick={handlePublish}>
            Publish
          </button>
          <button className="px-2 py-1 border" onClick={handlePreviewClick}>
            Preview
          </button>
          <div className="flex flex-col gap-4">
            <Permalink
              title={formData.title}
              value={formData.slug}
              onChange={(value) => handleInputChange("slug", value)}
            />
            <MetaDescription
              value={formData.metaDescription}
              onChange={(value) => handleInputChange("metaDescription", value)}
            />
            <Keywords
              value={formData.keywords}
              onChange={(value) => handleInputChange("keywords", value)}
            />
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <PreviewModal
            title={formData.title}
            handleCloseModal={handleCloseModal}
            previewContent={previewContent}
          />
        )}
      </div>
    </>
  );
}
