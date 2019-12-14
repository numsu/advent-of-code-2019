import data from './day12-data';

const dimensions = ['x', 'y', 'z'];

export class Pos {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

export class Moon {
	constructor(position, velocity) {
		this.position = position;
		this.origin = {...position};
		this.velocity = velocity;
	}

	getTotalEnergy = () => {
		const position = dimensions
				.reduce((acc, i) => acc += Math.abs(this.position[i]), 0);
		const velocity = dimensions
				.reduce((acc, i) => acc += Math.abs(this.velocity[i]), 0);
		return position * velocity;
	}
}

export class Space {
	constructor(moons) {
		this.moons = [...moons];
	}

	applyGravity = () => {
		const cycle = [...this.moons];
		for (let a = 0; a < this.moons.length - 1; a++) {	
			for (let b = a + 1; b < this.moons.length; b++) {
				dimensions.forEach(axis => {
					if (this.moons[a].position[axis] < this.moons[b].position[axis]) {
						cycle[a].velocity[axis]++;
						cycle[b].velocity[axis]--;
					} else if (this.moons[a].position[axis] != this.moons[b].position[axis]) {
						cycle[a].velocity[axis]--;
						cycle[b].velocity[axis]++;
					}
				});
			}
		}
		this.moons = cycle;
	}

	applyVelocity = () => {
		for (const moon of this.moons) {
			moon.position.x += moon.velocity.x;
			moon.position.y += moon.velocity.y;
			moon.position.z += moon.velocity.z;
		}
	}

	getTotalEnergy = () => {
		return this.moons.reduce((acc, moon) => acc += moon.getTotalEnergy(), 0);
	}
}

const moons = data
		.map(coord => new Pos(coord.x, coord.y, coord.z))
		.map(pos => new Moon(pos, new Pos(0, 0, 0)));
const space = new Space(moons);

for (let i = 0; i < 1000; i++) {
	space.applyGravity();
	space.applyVelocity();
}

console.log(`Total energy in observed space is ${space.getTotalEnergy()}`);
