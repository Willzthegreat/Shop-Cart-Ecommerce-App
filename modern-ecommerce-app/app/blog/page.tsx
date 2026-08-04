import LatestBlog from "@/components/latestBlog";

export const dynamic = "force-dynamic";

const Blog = async () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LatestBlog title="All Blogs" showViewAll={false} />
    </main>
  );
};

export default Blog;
