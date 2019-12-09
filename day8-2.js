import data from './day8-data'

const maxX = 25;
const maxY = 6;
const layerSize = maxX * maxY;

const splitString = (str, interval) => {
	let res = [];
	for (let i = 0; i < str.length; i += interval) {
		res.push(str.substring(i, i + interval));
	}
	return res;
}

const layers = splitString(data, layerSize);
const final = new Array(layerSize).fill(2);
for (let y = layers.length - 1; y >= 0; y--) {
	for (let x = 0; x < final.length; x++) {
		const next = layers[y][x];
		if (next != 2) {
			final[x] = next;
		}
	}
}

splitString(final.map(str => str.replace('1', '■').replace('0', ' ')).join(''), maxX)
		.forEach(i => console.log(i));
