'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import type { DemoCredential } from '../components/projectPresentation';
import styles from './detail.module.css';

export default function DemoAccess({ credentials }: { credentials: DemoCredential[] }) {
    const [copied, setCopied] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    async function copy(credential: DemoCredential) {
        try {
            await navigator.clipboard.writeText(credential.value);
            setCopied(credential.label);
            setMessage(`${credential.label} copied.`);
        } catch {
            setCopied(null);
            setMessage('Could not copy. Select and copy the value manually.');
        }
    }

    return (
        <div className={styles.credentials}>
            {credentials.map(credential => (
                <div className={styles.credential} key={credential.label}>
                    <div><span>{credential.label}</span><code>{credential.value}</code></div>
                    <button type="button" onClick={() => copy(credential)} aria-label={`Copy demo ${credential.label.toLowerCase()}`}>
                        {copied === credential.label ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
            ))}
            <p className={styles.copyStatus} role="status">{message}</p>
        </div>
    );
}
