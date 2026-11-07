type Props = {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    correctWords: number;
    wrongWords: number;
    duration: number;
    onRestart: () => void;
};

export default function Result({
    wpm,
    rawWpm,
    accuracy,
    correctWords,
    wrongWords,
    duration,
    onRestart,
}: Props) {
    return (
        <div className="flex flex-col items-center gap-8 py-6">
            <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
                <Item label="wpm" value={wpm} large />
                <Item label="accuracy" value={`${accuracy}%`} large />
                <Item label="raw wpm" value={rawWpm} />
                <Item label="correct / wrong" value={`${correctWords} / ${wrongWords}`} />
            </div>

            <p className="text-sm text-neutral-500">{duration}s test · English</p>

            <button
                onClick={onRestart}
                className="rounded-md bg-yellow-400 px-5 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-yellow-300"
            >
                Try again
            </button>
        </div>
    );
}

function Item({
    label,
    value,
    large = false,
}: {
    label: string;
    value: string | number;
    large?: boolean;
}) {
    return (
        <div>
            <div
                className={`font-mono font-bold ${large ? "text-6xl text-yellow-400" : "text-3xl text-neutral-100"
                    }`}
            >
                {value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-widest text-neutral-500">
                {label}
            </div>
        </div>
    );
}