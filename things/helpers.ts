export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const average = (arr: number[]) =>
    arr.reduce((p: number, c: number) => p + c, 0) / arr.length;
