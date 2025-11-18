export function normalizeDegrees(angle: number): number {
    let result = angle % 360;
    if (result < 0) result += 360;
    return result;
}