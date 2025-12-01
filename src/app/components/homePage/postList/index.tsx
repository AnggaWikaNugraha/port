'use client'
import { useEffect, useMemo, useState } from 'react';
import PostItem from './components/postItem';

const PostList = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<{ date: string; title: string }[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPosts([
        // { date: 'May 30, 2025', title: 'Memory Analysis Introduction | TryHackMe Write-Up' },
        // { date: 'May 27, 2025', title: 'DFIR: An Introduction | TryHackMe Write-Up' },
        // { date: 'May 20, 2025', title: 'Writing Pentest Reports | TryHackMe Write-Up' },
        // { date: 'May 16, 2025', title: 'Jr Security Analyst Intro | TryHackMe Write-Up' },
        // { date: 'May 8, 2025', title: 'Pentesting Fundamentals | TryHackMe Write-Up' },
      ]);
      setIsLoading(false);
    }, 2000); // Simulate 2 seconds loading
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="text-center mt-10">Loading...</div>;
    }

    if (posts?.length === 0) {
      return <div className="text-center mt-10">No posts available.</div>;
    }

    return posts.map((post, index) => (
      <PostItem key={index} date={post.date} title={post.title} />
    ));
  }, [isLoading, posts]);

  return (
    <div className="mt-10 space-y-3 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-2">Posts</h3>
      {content}
    </div>
  );
};

export default PostList;