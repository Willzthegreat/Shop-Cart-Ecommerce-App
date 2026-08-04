import React from "react";
import Title from "./title";
import { getLatestBlogs } from "@/queries";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async ({
  title = "Latest Blog",
  showViewAll = true,
}: {
  title?: string;
  showViewAll?: boolean;
}) => {
  // Do not limit the result here; the homepage should show every blog
  // returned by the latest-blog query.
  const blogs = await getLatestBlogs();

  return (
    <section className="mb-10 lg:mb-20">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Title>{title}</Title>

        {showViewAll && (
          <Link
            href="/blog"
            className="text-sm font-semibold transition hover:text-shop-btn-dark-green"
          >
            View All
          </Link>
        )}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <article
              key={blog._id}
              className="group overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Blog Image */}
              {blog.mainImage ? (
                <Link href={`/blog/${blog.slug}`}>
                  <Image
                    src={blog.mainImage}
                    alt={blog.title || "Blog image"}
                    width={300}
                    height={300}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ) : (
                <div className="flex h-60 w-full items-center justify-center bg-gray-100 text-sm text-gray-500">
                  No Image
                </div>
              )}

              {/* Category & Date */}
              <div className="bg-shop-light-bg p-5">
                <div className="flex items-center gap-5 text-xs">
                  
                  {/* Categories */}
                  <div className="relative flex cursor-pointer items-center group">
                    {blog?.blogCategories?.map((item: any, index: number) => (
                      <p
                        key={index}
                        className="font-semibold tracking-wider text-shop-dark-green"
                      >
                        {item?.title || "Blog"}
                      </p>
                    ))}

                    <span className="absolute -bottom-5 left-0 inline-block h-0.5 w-full bg-lightColor/30 transition-all group-hover:bg-shop-dark-green" />
                  </div>

                  {/* Date */}
                  <p className="group relative flex cursor-pointer items-center gap-1 text-light-Color transition-colors hover:text-shop-dark-green">
                    <Calendar size={15} /> {" "}

                    {dayjs(blog.publishedAt || blog.createdAt).format(
                      "MMMM D, YYYY"
                    )}

                    <span className="absolute -bottom-1.5 left-0 inline-block h-0.5 w-full bg-light-Color/30 transition-all group-hover:bg-shop-dark-green" />
                  </p>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-5">
                <Link href={`/blog/${blog.slug}`}>
                  <h2 className="line-clamp-2 text-lg font-bold text-gray-800 transition-colors group-hover:text-shop-btn-dark-green">
                    {blog?.title}
                  </h2>
                </Link>

                <Link
                  href={`/blog/${blog.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-shop-btn-dark-green"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500">
            No blogs available.
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestBlog;
