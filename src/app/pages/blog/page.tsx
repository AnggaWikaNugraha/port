import BlogList from './components/blogList';

export default function BlogPage() {
    return (
        <section className="flex-1 px-4 py-10 bg-gradient-to-b from-gray-900 to-gray-800">
            <div className='mx-auto  max-w-5xl '>
                <BlogList />
            </div>
        </section>
    );
}