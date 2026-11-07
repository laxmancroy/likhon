"use client";

import { useEffect, useRef, useState } from "react";
import { DURATIONS, useTypingTest } from "../hooks/useTypingTest";
import { useHydrated } from "../hooks/useHydrated";
import WordDisplay from "./WordDisplay";
import Stats from "./Stats";
import Result from "./Result";

export default function TypingTest() {
    const hydrated = useHydrated();

    if (!hydrated) {
        return <div className="h-64 animate-pulse rounded-xl bg-neutral-900" />;
    }

    return <Game />;
}

function Game() {
    const {
        words,
        wordIndex,
        input,
        typedWords,
        status,
        timeLeft,
        duration,
        stats,
        handleChange,
        restart,
        changeDuration,
    } = useTypingTest(30);

    const inputRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                restart();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [restart]);

    const handleRestart = () => {
        restart();
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col gap-8">
            <div
                className="flex justify-center gap-2"
                role="group"
                aria-label="Test duration"
            >
                {DURATIONS.map((d) => (
                    <button
                        key={d}
                        onClick={() => {
                            changeDuration(d);
                            inputRef.current?.focus();
                        }}
                        disabled={status === "running"}
                        className={`rounded-md px-3 py-1 text-sm transition-colors disabled:opacity-40 ${d === duration
                            ? "bg-yellow-400 font-semibold text-neutral-900"
                            : "text-neutral-400 hover:text-neutral-100"
                            }`}
                    >
                        {d}s
                    </button>
                ))}
            </div>

            <input
                ref={inputRef}
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onPaste={(e) => e.preventDefault()}
                className="sr-only"
                aria-label="Type here"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
            />

            {status === "finished" ? (
                <Result
                    wpm={stats.wpm}
                    rawWpm={stats.rawWpm}
                    accuracy={stats.accuracy}
                    correctWords={stats.correctWords}
                    wrongWords={stats.wrongWords}
                    duration={duration}
                    onRestart={handleRestart}
                />
            ) : (
                <>
                    <Stats
                        timeLeft={timeLeft}
                        wpm={stats.wpm}
                        accuracy={stats.accuracy}
                    />

                    <div
                        className="relative cursor-text"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <WordDisplay
                            words={words}
                            wordIndex={wordIndex}
                            input={input}
                            typedWords={typedWords}
                        />

                        {!focused && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-950/60 text-neutral-300 backdrop-blur-sm">
                                Click here to focus and start typing
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleRestart}
                            className="rounded-md px-4 py-2 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                        >
                            Restart (Esc)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}