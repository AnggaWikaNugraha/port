export interface FeedPostType {
    id: string;
    authorId: string;
  
    title: string;
    content: string; // plain or markdown
    imageUrl?: string;
    videoUrl?: string;
  
    tags?: string[];
  
    loveCount?: number;
    commentCount?: number;
    repostCount?: number;
    shareCount?: number;
  
    visibility?: 'public' | 'connection' | 'private';
    createdAt: string;
    updatedAt?: string;
}