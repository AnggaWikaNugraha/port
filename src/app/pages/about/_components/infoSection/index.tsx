import { UserType } from '../../_types';
import { Mail, Phone, MapPin, Globe } from "lucide-react";

interface Props {
  user: UserType;
}

export default function InfoSection({ user }: Props) {
  return (
    <section className="mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Profile</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">About me</h2>

      {user.bio && (
        <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
          {user.bio}
        </p>
      )}

      <div className="mt-7 grid gap-2 sm:grid-cols-2">
        {user.email && (
          <a href={`mailto:${user.email}`} className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-sm text-gray-400 transition hover:border-white/[0.14] hover:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05]"><Mail className="h-3.5 w-3.5" /></span>
            <span className="min-w-0 truncate">{user.email}</span>
          </a>
        )}
        {user.phone && (
          <a href={`tel:${user.phone}`} className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-sm text-gray-400 transition hover:border-white/[0.14] hover:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05]"><Phone className="h-3.5 w-3.5" /></span>
            <span>{user.phone}</span>
          </a>
        )}
        {user.location && (
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-sm text-gray-400">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05]"><MapPin className="h-3.5 w-3.5" /></span>
            <span>{user.location}</span>
          </div>
        )}
        {user.website && (
          <a href={user.website} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-sm text-gray-400 transition hover:border-white/[0.14] hover:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.05]"><Globe className="h-3.5 w-3.5" /></span>
            <span className="min-w-0 truncate">{user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
          </a>
        )}
      </div>
    </section>
  );
}
