import data from './day3-data'

class Vector {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class Grid {
	constructor(paths) {
		this.vectors = []

		let x = 0
		let y = 0
		for (const path of paths) {
			const direction = path.substring(0, 1)
			let steps = path.substring(1)

			switch (direction) {
				case 'U':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(x, ++y))
					}
					break
				case 'R':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(++x, y))
					}
					break
				case 'D':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(x, --y))
					}
					break
				case 'L':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(--x, y))
					}
					break
				default:
					throw `Invalid direction ${direction}`
			}
		}
	}
}

const path1 = new Grid(data[0].split(','))
const path2 = new Grid(data[1].split(','))

const findCrossingPaths = (path1, path2) => {
	const crossingPaths = []
	for (const a of path1.vectors) {
		for (const b of path2.vectors) {
			if (a.x == b.x && a.y == b.y) {
				crossingPaths.push(a)
			}
		}
	}

	return crossingPaths
}

const crossingPaths = findCrossingPaths(path1, path2)

const calculateManhattanDistances = (paths) => (
	paths.map(path => Math.abs(path.x) + Math.abs(path.y))
)

const manhattanDistances = calculateManhattanDistances(crossingPaths)

console.log(`Shortest path to the starting point is ${Math.min(...manhattanDistances)}`)
