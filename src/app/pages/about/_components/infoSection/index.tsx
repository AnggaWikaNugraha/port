import { UserType } from '../../_types';
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface Props {
  user: UserType;
}

export default function InfoSection({ user }: Props) {
  return (
    

<div className="space-y-4 mt-4">
  {user.bio && (
    <p className="text-gray-300 leading-relaxed">{user.bio}</p>
  )}

  <div className="space-y-2 text-sm text-gray-400">
    {user.email && (
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-gray-500" />
        <span>{user.email}</span>
      </div>
    )}
    {user.phone && (
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-500" />
        <span>{user.phone}</span>
      </div>
    )}
    {user.location && (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span>{user.location}</span>
      </div>
    )}
    {user.website && (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-gray-500" />
        <a
          href={user.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {user.website}
        </a>
      </div>
    )}
  </div>
</div>
  );
}