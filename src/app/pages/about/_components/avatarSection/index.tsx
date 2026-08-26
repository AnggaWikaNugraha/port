import { UserType } from '../../_types';
import Image from 'next/image';

interface Props {
    user: UserType;
}

export default function AvatarSection({ user }: Props) {
    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map(part => part[0])
        .join('');

    return (
        <header>
            <div className="relative h-44 overflow-hidden rounded-3xl border border-white/[0.08] bg-gray-900 sm:h-56">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(59,130,246,0.22),transparent_36%),radial-gradient(circle_at_75%_80%,rgba(16,185,129,0.12),transparent_38%),linear-gradient(135deg,#111827,#030712)]" />
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="relative -mt-12 flex flex-col items-center px-4 text-center">
              {user.avatarUrl ? (
                <Image
                    src={user.avatarUrl}
                    alt={user.name}
                    width={112}
                    height={112}
                    className="h-24 w-24 rounded-full border-4 border-gray-950 bg-gray-900 object-cover shadow-xl shadow-black/40 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-gray-950 bg-gray-800 text-xl font-semibold text-white shadow-xl shadow-black/40 sm:h-28 sm:w-28">
                    {initials}
                </div>
              )}

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">{user.name}</h1>

                {user.username && (
                    <p className="mt-1 text-xs text-gray-500">@{user.username}</p>
                )}

                {(user.jobTitle || user.company) && (
                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        {user.jobTitle}
                        {user.jobTitle && user.company && ' at '}
                        {user.company}
                    </p>
                )}
            </div>
        </header>
    );
}
