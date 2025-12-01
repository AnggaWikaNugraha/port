interface PostItemProps {
    date: string;
    title: string;
  }
  
  const PostItem = ({ date, title }: PostItemProps) => {
    return (
      <div className="border border-gray-700 rounded-md px-4 py-3 hover:bg-gray-800 transition">
        <div className="text-xs text-gray-400 mb-1">{date}</div>
        <div className="text-sm font-medium">{title}</div>
      </div>
    );
  };
  
  export default PostItem;