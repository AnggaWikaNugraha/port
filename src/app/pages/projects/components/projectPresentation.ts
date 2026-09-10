export function displayProjectTitle(value: string) {
    const title = value.trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(title)) return title;
    return title.split('-').map(word => /^(cms|lms|api|ui|ux)$/.test(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export type DemoCredential = { label: string; value: string };

export function presentProjectDescription(description = '') {
    const lines = description.replace(/\r\n/g, '\n').trim().split('\n');
    const matches = lines.flatMap((line, index) => {
        const match = line.match(/^\s*(email|username|password|pass)\s*:\s*(\S.*?)\s*$/i);
        return match ? [{ index, label: match[1].toLowerCase(), value: match[2] }] : [];
    });
    // Only move an unambiguous, explicitly labelled login/password pair.
    // Other text (including contact emails and multiple accounts) stays intact.
    const login = matches.filter(item => item.label === 'email' || item.label === 'username');
    const password = matches.filter(item => item.label === 'password' || item.label === 'pass');
    const hasPair = login.length === 1 && password.length === 1 && !description.includes('```');
    const extracted = hasPair ? [login[0], password[0]] : [];
    const overview = lines.filter((_, index) => !extracted.some(item => item.index === index)).join('\n').trim();
    const plain = overview
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/^[#>\s*-]+/gm, '')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ').trim();
    const sentence = plain.match(/^.*?[.!?](?=\s|$)/)?.[0] || plain;
    const intro = sentence.length > 200 ? `${sentence.slice(0, 197).replace(/\s+\S*$/, '')}…` : sentence;

    return {
        overview,
        intro,
        credentials: extracted.map(item => ({
            label: item.label === 'pass' || item.label === 'password' ? 'Password' : item.label === 'email' ? 'Email' : 'Username',
            value: item.value,
        })) satisfies DemoCredential[],
    };
}
