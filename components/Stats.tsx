type Props = {
    timeLeft: number;
    wpm: number;
    accuracy: number;
};

export default function Stats({ timeLeft, wpm, accuracy }: Props) {
    return (
        <div className="flex items-end justify-center gap-10 font-mono">
            <Item label="time" value={timeLeft} highlight />
            <Item label="wpm" value={wpm} />
            <Item label="acc" value={`${accuracy}%`} />
        </div>
    );
}

function Item({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className="text-center">
            <div
                className={`text-4xl font-bold ${highlight ? "text-yellow-400" : "text-neutral-100"
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