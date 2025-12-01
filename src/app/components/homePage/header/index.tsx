import { FaMapMarkerAlt, FaCodeBranch } from 'react-icons/fa';

const ProfileHeader = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-2xl font-bold">Angga Wika Nugraha</h1>
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <span className="flex items-center gap-1"><FaMapMarkerAlt /> Indonesia</span>
        <span className="flex items-center gap-1"><FaCodeBranch /> Source code</span>
      </div>
    </div>
  );
};

export default ProfileHeader;