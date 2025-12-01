import Image from "next/image";
import ProfileHeader from "./components/homePage/header";
import AboutSection from "./components/homePage/about";
import PostList from "./components/homePage/postList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <ProfileHeader />
        <AboutSection/>
        <PostList />
      </div>
    </main>
  )
}
