import { NotebookPenIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useGetBlogByIdQuery } from "@/services/blogApi";

export async function generateMetadata({
  params,
}: {
  params: { postId: string };
}) {
  return {
    title: `Post - ${params.postId}`,
    description: `Viewing blog post with ID: ${params.postId}`,
  };
}

export default function Post({ params }: { params: { postId: string } }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">Loading...</div>
      }
    >
      <SinglePost postId={params.postId} />
    </Suspense>
  );
}

function SinglePost({ postId }: { postId: string }) {
  const { data: post, error, isLoading } = useGetBlogByIdQuery(postId);

  if (error) {
    return <div>Error fetching post: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading post...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{post?.title}</h1>
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{post?.title}</div>
        <Link href={`/admin/posts/edit/${post.id}`}>
          <NotebookPenIcon className="h-4" />
        </Link>
      </div>
      <div className="text-sm text-gray-500">
        <strong>Keywords:</strong> {post?.keywords.join(", ")}
      </div>
      <div className="text-sm text-gray-500">
        {new Date(post?.publicationDate).toLocaleDateString()}
      </div>
      <div
        className="mt-6"
        dangerouslySetInnerHTML={{ __html: post?.content || "" }}
      />
    </div>
  );
}
