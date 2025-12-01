import Link from "next/link";

const AboutSection = () => {
    return (
      <div className="text-center mt-6">
        <h2 className="text-lg font-semibold">Frontend Developer</h2>
        <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">
            Frontend Engineer with 5+ years of professional experience in developing and maintaining web and mobile applications. 
        </p>
        <Link href="/pages/about">
          <button className="mt-4 px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800">
            More about me →
          </button>
        </Link>
      </div>
    );
  };
  
  export default AboutSection;