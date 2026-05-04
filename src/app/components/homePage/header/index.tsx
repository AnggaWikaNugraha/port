import { FaMapMarkerAlt, FaCodeBranch } from 'react-icons/fa';

const ProfileHeader = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">Angga Wika Nugraha</h1>
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <span className="flex items-center gap-1"><FaMapMarkerAlt /> Indonesia</span>
        <a
          href="https://github.com/AnggaWikaNugraha"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <FaCodeBranch /> Source code
        </a>
      </div>
    </div>
  );
};

export default ProfileHeader;