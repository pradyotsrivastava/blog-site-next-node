import Head from "next/head";
import Link from "next/link";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function BlogPost({ params }) {
  const { slug } = params;

  const response = await fetch(`${BASE_URL}/api/blogposts/blog/${slug}`);
  if (!response.ok) {
    return <div>Post not found.</div>;
  }

  const post = await response.json();

  const {
    title,
    content,
    author,
    publicationDate,
    metaDescription,
    metaTitle,
    metaKeywords,
    featuredImage,
    ogData,
    twitterCardData,
    facebookTitle,
    facebookDescription,
    facebookImage,
    canonicalUrl,
  } = post;

  const cookieStore = cookies();
  const userEmail = cookieStore.get("username") || "";

  return (
    <>
      {/* SEO meta tags */}
      <Head>
        <title>{metaTitle || title}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={ogData.title || title} />
        <meta
          property="og:description"
          content={ogData.description || metaDescription}
        />
        <meta property="og:image" content={ogData.image || featuredImage} />
        <meta property="og:url" content={ogData.url || canonicalUrl} />

        {/* Twitter Card */}
        <meta name="twitter:title" content={twitterCardData.title || title} />
        <meta
          name="twitter:description"
          content={twitterCardData.description || metaDescription}
        />
        <meta
          name="twitter:image"
          content={twitterCardData.image || featuredImage}
        />

        {/* Facebook Meta Tags */}
        <meta property="og:title" content={facebookTitle || title} />
        <meta
          property="og:description"
          content={facebookDescription || metaDescription}
        />
        <meta property="og:image" content={facebookImage || featuredImage} />
      </Head>

      {/* Main Content */}
      <article className="flex flex-col mx-auto p-20 gap-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold">{title}</div>
          <div className="bg-red-400">
            {userEmail.value === "user@example.com" && (
              <Link href={`/admin/posts/edit/${post._id}`}>
                <button className="py-1 px-2 rounded hover:scale-105 transform transition duration-300 ease-in-out bg-blue-500 text-white">
                  Edit
                </button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-300 mb-2 py-3 border-b-[1px] border-gray-400">
          <div>Author : {author}</div>
          <div>Date : {new Date(publicationDate).toLocaleDateString()}</div>
        </div>
        <div className="" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = params;

  const response = await fetch(`${BASE_URL}/api/blogposts/blog/${slug}`);
  if (!response.ok) {
    return {
      title: "Post Not Found",
      description: "The requested post does not exist.",
    };
  }

  const post = await response.json();
  const { title, metaDescription, metaTitle } = post;

  return {
    title: metaTitle || title,
    description: metaDescription,
  };
}
