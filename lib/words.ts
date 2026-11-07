import wordList from "@/data/words-en.json";

export function generateWords(count: number): string[] {
    const result: string[] = [];
    let last = "";

    while (result.length < count) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        if (word !== last) {
            result.push(word);
        }
        last = word;
    }

    return result;
}