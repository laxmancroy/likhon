"use client";

import { memo, useEffect, useRef } from "react";

type Props = {
    words: string[];
    wordIndex: number;
    input: string;
    typedWords: string[];
};

export default function WordDisplay({
    words,
    wordIndex,
    input,
    typedWords,
}: Props) {
    const innerRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLDivElement>(null);

    // বর্তমান শব্দ যে লাইনে আছে সেটি মাঝের লাইনে রাখি
    // Keep the current word's line in the middle row
    useEffect(() => {
        const update = () => {
            const inner = innerRef.current;
            const active = activeRef.current;
            if (!inner || !active) return;
            const offset = Math.max(0, active.offsetTop - active.offsetHeight);
            inner.style.transform = `translateY(-${offset}px)`;
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [wordIndex]);

    return (
        <div className="h-30 select-none overflow-hidden rounded-xl font-mono text-2xl">
            <div
                ref={innerRef}
                className="relative flex flex-wrap gap-x-4 transition-transform duration-150"
            >
                {words.map((word, i) => {
                    const isActive = i === wordIndex;
                    const isPast = i < wordIndex;
                    const typed = isPast ? (typedWords[i] ?? "") : isActive ? input : "";

                    return (
                        <div key={`${i}-${word}`} ref={isActive ? activeRef : undefined}>
                            <Word
                                word={word}
                                typed={typed}
                                isActive={isActive}
                                isPast={isPast}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

type WordProps = {
    word: string;
    typed: string;
    isActive: boolean;
    isPast: boolean;
};

const Word = memo(function Word({ word, typed, isActive, isPast }: WordProps) {
    const extra = typed.length > word.length ? typed.slice(word.length) : "";
    const hasError = isPast && typed !== word;

    return (
        <div
            className={`flex h-10 border-b-2 leading-9 ${hasError ? "border-red-500/70" : "border-transparent"
                }`}
        >
            {word.split("").map((char, i) => {
                const color =
                    i < typed.length
                        ? typed[i] === char
                            ? "text-blue-600"
                            : "text-red-500"
                        : "text-neutral-400";

                return (
                    <span key={i} className={`relative ${color}`}>
                        {isActive && i === typed.length && <Caret />}
                        {char}
                    </span>
                );
            })}

            {extra.split("").map((char, i) => (
                <span key={`extra-${i}`} className="text-red-700">
                    {char}
                </span>
            ))}

            {isActive && typed.length >= word.length && (
                <span className="relative">
                    <Caret />
                </span>
            )}
        </div>
    );
});

function Caret() {
    return (
        <span className="absolute -left-px top-1.5 h-6 w-0.5 animate-pulse rounded bg-yellow-400" />
    );
}