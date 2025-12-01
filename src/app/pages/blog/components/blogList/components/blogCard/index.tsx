'use client';

import { FeedPostType } from '../../../../types';
import ReactMarkdown from 'react-markdown';
import { FaHeart, FaCommentDots, FaShare } from 'react-icons/fa';
import Image from 'next/image';

interface Props {
  post: FeedPostType;
}

const BlogCard = ({ post }: Props) => {
  return (
    <div className="border border-gray-700 rounded-lg p-6 space-y-4 bg-gray-900 text-white">
      {/* Title */}
      {post.title && (
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          {post.title}
        </h2>
      )}

      {/* Gambar utama */}
      {post.imageUrl && (
        <div className="relative w-full h-64 rounded overflow-hidden">
          <Image
            src={post.imageUrl}
            alt="post cover"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {/* Konten Markdown */}
      <div className="prose prose-invert prose-lg max-w-none text-white">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-gray-800 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer - Love, Comment, Share */}
      <div className="flex items-center gap-6 text-xs text-gray-400 border-t border-gray-700 pt-3">
        <span className="flex items-center gap-1">
          <FaHeart /> {post.loveCount ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <FaCommentDots /> {post.commentCount ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <FaShare /> {post.shareCount ?? 0}
        </span>
      </div>
    </div>
  );
};

export default BlogCard;