import Link from "next/link";

const AboutSection = () => {
  return (
    <div className="text-center mt-6">
      <h2 className="text-lg font-semibold">Fullstack Developer</h2>
      <Link href="/pages/about">
        <button className="mt-4 px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800">
          More about me →
        </button>
      </Link>
    </div>
  );
};

export default AboutSection;
