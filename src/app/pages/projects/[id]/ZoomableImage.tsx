'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

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
    const draggingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);

    const close = useCallback(() => {
        setOpen(false);
        setScale(1);
        setPos({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = 'hidden';

        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            setScale(s => Math.min(Math.max(s - e.deltaY * 0.005, 0.25), 6));
        };

        window.addEventListener('keydown', onKey);
        overlayRef.current?.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
            overlayRef.current?.removeEventListener('wheel', onWheel);
        };
    }, [open, close]);

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        draggingRef.current = true;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        setPos(p => ({ x: p.x + dx, y: p.y + dy }));
    };

    const onMouseUp = () => { draggingRef.current = false; };

    return (
        <>
            <div
                className={`relative w-full cursor-zoom-in ${aspectClass ?? ''}`}
                onClick={() => setOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className={className}
                    priority={priority}
                />
            </div>

            {open && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 select-none"
                    onClick={close}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    <button
                        type="button"
                        aria-label="Close"
                        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                        onClick={e => { e.stopPropagation(); close(); }}
                    >
                        ✕
                    </button>

                    <div
                        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, cursor: draggingRef.current ? 'grabbing' : 'grab' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            draggable={false}
                            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
                        />
                    </div>

                    <p className="pointer-events-none absolute bottom-4 text-xs text-white/30">
                        Scroll to zoom · Drag to pan · Esc to close
                    </p>
                </div>
            )}
        </>
    );
}
