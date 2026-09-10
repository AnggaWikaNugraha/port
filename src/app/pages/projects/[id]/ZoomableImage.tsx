'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageOff, Minus, Plus, X } from 'lucide-react';
import styles from './detail.module.css';

type Props = {
    src: string;
    alt: string;
    aspectClass?: string;
    className?: string;
    priority?: boolean;
};

export default function ZoomableImage({ src, alt, aspectClass, className, priority }: Props) {
    const [open, setOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [failedImage, setFailedImage] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const dragRef = useRef<{ x: number; y: number } | null>(null);
    const reset = useCallback(() => { setScale(1); setPos({ x: 0, y: 0 }); }, []);
    const close = useCallback(() => { setOpen(false); reset(); dragRef.current = null; }, [reset]);

    useEffect(() => {
        if (!open) return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        dialog.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const wheel = (event: WheelEvent) => {
            event.preventDefault();
            setScale(value => Math.min(6, Math.max(1, value - event.deltaY * 0.005)));
        };
        dialog.addEventListener('wheel', wheel, { passive: false });
        return () => {
            document.body.style.overflow = previousOverflow;
            dialog.removeEventListener('wheel', wheel);
            dialog.close();
        };
    }, [open]);

    return (
        <>
            {failedImage === src ? (
                <div className={`${styles.imageFallback} ${aspectClass || ''}`}><ImageOff size={24} /><span>Preview unavailable</span></div>
            ) : (
                <button type="button" className={`${styles.zoomTrigger} ${aspectClass || ''}`} onClick={() => setOpen(true)} aria-label={`Enlarge ${alt}`}>
                    <Image src={src} alt={alt} fill sizes="(max-width: 639px) 90vw, (max-width: 1100px) 80vw, 940px" className={className} priority={priority} onError={() => setFailedImage(src)} />
                </button>
            )}
            <dialog ref={dialogRef} className={styles.viewer} aria-label={`${alt} enlarged`} onClose={close}>
                {open && <>
                    <div className={styles.viewerToolbar}>
                        <p>{alt}</p>
                        <div className={styles.viewerControls}>
                            <button type="button" aria-label="Zoom out" disabled={scale <= 1} onClick={() => setScale(value => Math.max(1, value - 0.5))}><Minus size={16} /></button>
                            <button type="button" aria-label="Reset zoom" onClick={reset}>{Math.round(scale * 100)}%</button>
                            <button type="button" aria-label="Zoom in" disabled={scale >= 6} onClick={() => setScale(value => Math.min(6, value + 0.5))}><Plus size={16} /></button>
                            <button type="button" aria-label="Close image" onClick={close} autoFocus><X size={18} /></button>
                        </div>
                    </div>
                    <div className={styles.viewerStage} onClick={event => { if (event.target === event.currentTarget) close(); }}>
                        <div
                            className={styles.viewerImage}
                            style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
                            onPointerDown={event => {
                                if (event.button !== 0) return;
                                dragRef.current = { x: event.clientX, y: event.clientY };
                                event.currentTarget.setPointerCapture(event.pointerId);
                            }}
                            onPointerMove={event => {
                                if (!dragRef.current) return;
                                const dx = event.clientX - dragRef.current.x;
                                const dy = event.clientY - dragRef.current.y;
                                dragRef.current = { x: event.clientX, y: event.clientY };
                                setPos(value => ({ x: value.x + dx, y: value.y + dy }));
                            }}
                            onPointerUp={() => { dragRef.current = null; }}
                            onPointerCancel={() => { dragRef.current = null; }}
                            onLostPointerCapture={() => { dragRef.current = null; }}
                        >
                            {/* Original resolution is loaded only when the viewer opens. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt={alt} draggable={false} />
                        </div>
                    </div>
                    <p className={styles.viewerHint}>Scroll or use + / − to zoom · Drag to pan · Esc to close</p>
                </>}
            </dialog>
        </>
    );
}
