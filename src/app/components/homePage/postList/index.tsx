'use client';

import { useEffect, useState } from 'react';

const GITHUB_USER = 'AnggaWikaNugraha';

const eventIcon: Record<string, string> = {
    PushEvent: '⬆',
    CreateEvent: '✦',
    PullRequestEvent: '⇄',
    IssuesEvent: '◎',
    WatchEvent: '★',
    ForkEvent: '⎇',
    DeleteEvent: '✕',
    ReleaseEvent: '◈',
};

const eventLabel = (e: any): string => {
    switch (e.type) {
        case 'PushEvent': {
            const count = e.payload?.commits?.length ?? 1;
            return `Pushed ${count} commit${count > 1 ? 's' : ''} to`;
        }
        case 'CreateEvent':
            return `Created ${e.payload?.ref_type ?? 'repo'}`;
        case 'PullRequestEvent':
            return `${e.payload?.action === 'opened' ? 'Opened' : 'Updated'} PR on`;
        case 'IssuesEvent':
            return `${e.payload?.action ?? 'Updated'} issue on`;
        case 'WatchEvent':
            return 'Starred';
        case 'ForkEvent':
            return 'Forked';
        case 'DeleteEvent':
            return `Deleted ${e.payload?.ref_type ?? 'branch'} on`;
        case 'ReleaseEvent':
            return 'Released on';
        default:
            return 'Activity on';
    }
};

const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
};

const PostList = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=10`)
            .then(r => r.json())
            .then(data => {
                setEvents(Array.isArray(data) ? data.slice(0, 6) : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">GitHub Activity</h3>
                <a
                    href={`https://github.com/${GITHUB_USER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                    @{GITHUB_USER} →
                </a>
            </div>

            {loading ? (
                <div className="space-y-2.5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-center animate-pulse">
                            <div className="w-7 h-7 rounded-lg bg-gray-800 shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 bg-gray-800 rounded w-3/4" />
                                <div className="h-2.5 bg-gray-800 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No recent activity.</p>
            ) : (
                <div className="space-y-1">
                    {events.map(e => (
                        <a
                            key={e.id}
                            href={`https://github.com/${e.repo?.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex gap-3 items-start py-2.5 px-3 rounded-xl hover:bg-gray-800/50 transition-colors group"
                        >
                            <span className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400 shrink-0 mt-0.5">
                                {eventIcon[e.type] ?? '·'}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">
                                    <span className="text-gray-500">{eventLabel(e)} </span>
                                    <span className="font-medium truncate">{e.repo?.name?.split('/')[1]}</span>
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">{timeAgo(e.created_at)}</p>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
