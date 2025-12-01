import { UserType } from '../../_types';
import Image from 'next/image';

interface Props {
    user: UserType;
}

export default function AvatarSection({ user }: Props) {
    return (
        <div className="flex items-center gap-6 p-4 bg-gray-800 rounded-xl shadow-lg">
            {user.avatarUrl && (
                <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover shadow-md"
                />
            )}
            <div>
                <h1 className="text-2xl font-semibold text-white">{user.name}</h1>

                {user.username && (
                    <p className="text-sm text-gray-400">@{user.username}</p>
                )}

                {(user.jobTitle || user.company) && (
                    <p className="text-sm text-gray-300 mt-1">
                        {user.jobTitle}
                        {user.jobTitle && user.company && ' at '}
                        {user.company}
                    </p>
                )}
            </div>
        </div>
    );
}
