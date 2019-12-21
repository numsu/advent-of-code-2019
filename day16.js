import data from './day16-data';

const basePattern = [0, 1, 0, -1];
const FFT = (numbers, patterns, phase) => {
	if (phase == 0) {
		return numbers;
	}

	const sums = [];
	for (const pattern of patterns) {
		const sum = Math.abs(numbers.reduce((acc, number, index) => acc += number * pattern[index], 0))
		if (sum >= 10) {
			sum = +[...String(sum)].pop();
		}
		sums.push(sum);
	}

	return FFT(sums, patterns, phase - 1);
}

const getPatterns = (numbers) => {
	return numbers.map((_, index) => {
		const patterns = [];
		patternLoop:
		while (patterns.length <= numbers.length) {
			for (const base of basePattern) {
				for (let i = 0; i <= index; i++) {
					patterns.push(base);
					if (patterns.length > numbers.length) {
						break patternLoop;
					}
				}
			}
		}
		patterns.shift();
		return patterns;
	});
}

const numbers = data.split('').map(Number);
const patterns = getPatterns(numbers);
const result = FFT(numbers, patterns, 100).join('');

console.log(`After 100 phases, the first eight digits are ${String(result).substr(0, 8)}`)