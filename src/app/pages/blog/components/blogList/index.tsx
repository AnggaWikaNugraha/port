'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import BlogCard from './components/blogCard';
import { FeedPostType } from '../../types';
import { getBlogFeed } from '../../services';

const BlogList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<FeedPostType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const data = await getBlogFeed();
      setTimeout(() => {
        setIsLoading(false);
        setPosts([]);
      }, 1000);
    };
    fetchData();
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="text-center mt-10 text-white">Loading...</div>;
    }

    if (!posts || posts.length === 0) {
      return <div className="text-center text-white">No posts available.</div>;
    }

    return posts.map((post) => (
      <Fragment key={post.id}>
        <BlogCard key={post.id} post={post} />
      </Fragment>
    ));
  }, [posts]);

  return (
    <div className="space-y-6">
      {content}
    </div>
  );
};

export default BlogList;