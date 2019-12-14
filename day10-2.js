import data from './day10-data';
 
const width = data[0].length;
const height = data.length;
const angleMultiplier = 100000000;

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

const getDetectionsByAngle = (findX, findY) => {
	const detections = new Map();
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

			const angle = Math.atan2(deltaY, deltaX);
			const angleKey = Math.round(angle * angleMultiplier);
			const detection = detections.get(angleKey);
			if (detection) {
				detection.push({ x, y });
				detections.set(angleKey, detection);
			} else {
				detections.set(angleKey, [{ x, y }]);
			}
		}
	}

	return detections;
};

const findBestAsteroid = (detections) => {
	return detections.reduce((acc, detection) => {
			const amount = Array.from(detection.values()).length;
			if (acc.amount < amount) {
				return { detection, amount };
			}
			return acc;
		}, { amount: 0 });
};

const sortByDegrees = (detections) => {
	const result = new Map();
	for (let [key, value] of detections.entries()) {
		let base;
		let atan2 = key / angleMultiplier;
		if (atan2 < 0) {
			base = 2 * Math.PI + atan2;
		} else {
			base = atan2;
		}
		result.set(base * 360 / (2 * Math.PI), value);
	}

	const sortedAscending = [...result.entries()].sort((a, b) => a[0] - b[0]);
	const lessThan90 = [];
	const filtered = sortedAscending.filter(i => {
		if (Math.round(i[0]) <= 90) {
			lessThan90.push(i);
			return false;
		}
		return true;
	});

	return new Map([...filtered, ...lessThan90].reverse());
};

const destroyAsteroids = (asteroids) => {
	let i = 0,
		final;
	for (let [_, value] of asteroids.entries()) {
		if (i == 200) {
			break;
		}
		final = value.pop();
		i++;
	}

	return final;
};

const asteroidMap = parseAsteroidMap(data);
const detections = Array.from(asteroidMap.values())
		.map(item => getDetectionsByAngle(item.x, item.y));
const bestAsteroid = findBestAsteroid(Array.from(detections.values()));
const sortedByDegrees = sortByDegrees(bestAsteroid.detection);
const final = destroyAsteroids(sortedByDegrees);

console.log(`The answer is ${(final.x * 100) + final.y}`);
