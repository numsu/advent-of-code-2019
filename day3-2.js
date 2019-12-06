import data from './day3-data'

class Vector {
	constructor(x, y, steps) {
		this.x = x
		this.y = y
		this.steps = steps
	}
}

class Grid {
	constructor(paths) {
		this.vectors = []

		let x = 0
		let y = 0
		let totalSteps = 0
		for (const path of paths) {
			const direction = path.substring(0, 1)
			let steps = path.substring(1)

			switch (direction) {
				case 'U':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(x, ++y, ++totalSteps))
					}
					break
				case 'R':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(++x, y, ++totalSteps))
					}
					break
				case 'D':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(x, --y, ++totalSteps))
					}
					break
				case 'L':
					for (; steps > 0; steps--) {
						this.vectors.push(new Vector(--x, y, ++totalSteps))
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

const findCrossingPathsTotalSteps = (path1, path2) => {
	const totalSteps = []
	for (const a of path1.vectors) {
		for (const b of path2.vectors) {
			if (a.x == b.x && a.y == b.y) {
				totalSteps.push(a.steps + b.steps)
			}
		}
	}

	return totalSteps
}

const totalSteps = findCrossingPathsTotalSteps(path1, path2)

console.log(`Shortest path to the starting point is ${Math.min(...totalSteps)}`)
