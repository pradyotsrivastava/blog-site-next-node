"use client";

import { Editor } from "@/app/blog/component/editor";
import Keywords from "@/app/blog/component/keywords";
import MetaDescription from "@/app/blog/component/metaDescription";
import PageTitle from "@/app/blog/component/pageTitle";
import Permalink from "@/app/blog/component/permalink";
import Toolbar from "@/app/blog/component/toolbar";
import PreviewModal from "@/app/modal/blog/PreviewModal";
import { useEditorStore } from "@/zustand/use-editor-store";
import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page({ params }) {
  const { postId } = params;
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;

      setLoading(true);

      try {
        const response = await fetch(`${BASE_URL}/api/blogposts/${postId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }

        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          ...data,
          publicationDate: data.publicationDate || new Date().toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching post for editing:", error);
        setError("Error fetching post data.");
      } finally {
        setLoading(false);
      }
    };

    const storedAuthor = localStorage.getItem("author");
    setFormData((prev) => ({
      ...prev,
      author: storedAuthor || "John Doe", 
    }));

    fetchPostData();
  }, [postId]);

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
        const updatedFormData = {
          ...formData,
          content,
          publicationDate: currentDate,
        };

        const response = await fetch(
          `${BASE_URL}/api/blogposts/edit/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedFormData),
          }
        );

        if (!response.ok) {
          console.error("Error:", response.statusText);
        } else {
          const result = await response.json();
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
    <div className="flex gap-4 w-full p-2 mt-2">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="text-white">Loading...</div>
        </div>
      )}
      <div className="flex flex-col gap-2 overscroll-none w-3/4 p-2 border">
        <PageTitle
          value={formData.title}
          onChange={(value) => handleInputChange("title", value)}
        />
        <Toolbar />
        <Editor data={formData.content} />
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
            
            onChange={() => {}}
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

      {/* Loading and Error Handling */}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
