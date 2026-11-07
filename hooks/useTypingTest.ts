import { useCallback, useEffect, useState } from "react";
import { generateWords } from "../lib/words";

export const DURATIONS = [15, 30, 60, 120] as const;
export type Duration = (typeof DURATIONS)[number];
export type Status = "idle" | "running" | "finished";

const INITIAL_WORDS = 200;
const REFILL_WORDS = 100;
const MAX_EXTRA_CHARS = 8;

export function useTypingTest(initialDuration: Duration = 30) {
    const [duration, setDuration] = useState<Duration>(initialDuration);
    const [words, setWords] = useState<string[]>(() =>
        generateWords(INITIAL_WORDS)
    );
    const [wordIndex, setWordIndex] = useState(0);
    const [input, setInput] = useState("");
    const [typedWords, setTypedWords] = useState<string[]>([]);
    const [status, setStatus] = useState<Status>("idle");
    const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
    const [correctKeys, setCorrectKeys] = useState(0);
    const [totalKeys, setTotalKeys] = useState(0);

    // টাইমার: প্রথম কী চাপলেই শুরু হয়
    // Timer: starts on the first keystroke
    useEffect(() => {
        if (status !== "running") return;

        const startedAt = Date.now();
        const id = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            const left = Math.max(duration - elapsed, 0);
            setTimeLeft(left);
            if (left === 0) setStatus("finished");
        }, 200);

        return () => clearInterval(id);
    }, [status, duration]);

    const init = useCallback((nextDuration: Duration) => {
        setWords(generateWords(INITIAL_WORDS));
        setWordIndex(0);
        setInput("");
        setTypedWords([]);
        setStatus("idle");
        setTimeLeft(nextDuration);
        setCorrectKeys(0);
        setTotalKeys(0);
    }, []);

    const restart = useCallback(() => init(duration), [init, duration]);

    const changeDuration = (next: Duration) => {
        setDuration(next);
        init(next);
    };

    const handleChange = (value: string) => {
        if (status === "finished") return;

        // শুরুতে বা শব্দের আগে স্পেস ইগনোর করি
        // Ignore a leading space when nothing is typed yet
        if (value.startsWith(" ")) return;

        if (status === "idle") setStatus("running");

        const currentWord = words[wordIndex];

        // প্রতিটি নতুন অক্ষর সঠিক কিনা গুনি (accuracy-র জন্য)
        // Count every new keystroke as correct or wrong (for accuracy)
        if (value.length > input.length) {
            const typedChar = value[value.length - 1];
            const expectedChar = currentWord[input.length] ?? " ";
            setTotalKeys((n) => n + 1);
            if (typedChar === expectedChar) setCorrectKeys((n) => n + 1);
        }

        // স্পেস চাপলে শব্দ জমা হয় এবং পরের শব্দে যাই
        // Space commits the word and moves to the next one
        if (value.endsWith(" ")) {
            setTypedWords((prev) => [...prev, value.slice(0, -1)]);
            setWordIndex((i) => i + 1);
            setInput("");

            if (words.length - wordIndex < 40) {
                setWords((prev) => [...prev, ...generateWords(REFILL_WORDS)]);
            }
            return;
        }

        // অতিরিক্ত অক্ষরের একটি সীমা রাখি
        // Cap the number of extra characters
        if (value.length > currentWord.length + MAX_EXTRA_CHARS) return;

        setInput(value);
    };

    // স্ট্যাটিস্টিক্স হিসাব
    // Stats calculation
    const elapsed = status === "idle" ? 0 : duration - timeLeft;
    const minutes = elapsed / 60;

    let correctChars = 0;
    let correctWords = 0;
    let wrongWords = 0;

    typedWords.forEach((typed, i) => {
        if (typed === words[i]) {
            correctWords += 1;
            correctChars += typed.length + 1;
        } else {
            wrongWords += 1;
        }
    });

    const currentWord = words[wordIndex] ?? "";
    if (currentWord.startsWith(input)) correctChars += input.length;

    const stats = {
        wpm: minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0,
        rawWpm: minutes > 0 ? Math.round(totalKeys / 5 / minutes) : 0,
        accuracy:
            totalKeys > 0 ? Math.round((correctKeys / totalKeys) * 100) : 100,
        correctWords,
        wrongWords,
    };

    return {
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
    };
}