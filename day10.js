import data from './day10-data';
 
const width = data[0].length;
const height = data.length;

const parseAsteroidMap = (data) => {
	const grid = new Map();
	data.forEach((row, y) => {
		row.split('').forEach((position, x) => {
			if (position == '#') {
				grid.set(`x${x}y${y}`, { x, y });
			}
		});
	});

	return grid;
}

const atan = (x, y) => (
	Math.round(Math.atan2(y, x) * 100000000)
);

const countDetections = (findX, findY) => {
	const detections = new Set();
	for (let x = 0; x < width; x++) {
		for (let y = 0; y < height; y++) {
			if (!asteroidMap.has(`x${x}y${y}`)) {
				continue;
			}
			if (findX == x && findY == y) {
				continue;
			}

			const deltaX = x - findX;
			const deltaY = findY - y;
			const angle = atan(deltaX, deltaY);
			detections.add(angle);
		}
	}

	return detections.size;
};

const asteroidMap = parseAsteroidMap(data);
const scores = Array.from(asteroidMap.values())
		.map(item => countDetections(item.x, item.y));

console.log(`Largest amount of asteroids visible is ${Math.max(...scores)}`);
