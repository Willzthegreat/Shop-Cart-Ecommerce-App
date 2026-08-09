import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft } from "lucide-react";
import dayjs from "dayjs";
import { getBlogBySlug } from "@/queries";

export const dynamic = "force-dynamic";

const BlogDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Blog not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-shop-dark-green">
          Back to blogs
        </Link>
      </main>
    );
  }

  const paragraphs = blog.body.split(/\r?\n/).filter(Boolean);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-shop-dark-green"
      >
        <ChevronLeft size={17} /> Back to blogs
      </Link>

      <article>
        {blog.mainImage && (
          <div className="relative mb-8 h-64 overflow-hidden rounded-2xl sm:h-96">
            <Image
              src={blog.mainImage}
              alt={blog.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {blog.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span>By {blog.author?.name || "Unknown author"}</span>
          <span className="flex items-center gap-1">
            <Calendar size={15} />
            {dayjs(blog.publishedAt || blog.createdAt).format("MMMM D, YYYY")}
          </span>
        </div>

        <div className="mt-8 space-y-5 text-lg leading-8 text-gray-700">
          {paragraphs.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
};

export default BlogDetails;
