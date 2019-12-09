import data from './day8-data'

const x = 25;
const y = 6;
const layerSize = x * y;
let layers = [];

for (let i = 0; i < data.length; i += layerSize) {
	layers.push(data.substring(i, i + layerSize));
}

const calculateNumbers = (str, number) => str.split(number).length - 1;
const fewestZeroDigitsLayer =
		layers[
			layers
				.map((layer, i) => {
					return { num: calculateNumbers(layer, '0'), index: i }
				})
				.reduce((acc, i) => acc.num > i.num ? acc = i : acc)
				.index
		];

const ones = calculateNumbers(fewestZeroDigitsLayer, '1');
const twos = calculateNumbers(fewestZeroDigitsLayer, '2');

console.log(`The numbers multiplied is ${ones * twos}`);
