import data from './day15-data'

class Opcode {
	constructor(code) {
		code = '' + code;
		this.code = +code.substring(code.length - 2);
		this.modes = [...code.substring(0, code.length - 2).padStart(3, '0')]
				.reverse();
	}
}

class IntcodeComputer {
	constructor(data, phase = undefined) {
		this.data = [...data];
		this.cursor = 0;
		this.relativeBase = 0;
		if (phase) {
			this.phase = +phase;
			this.phaseSettingUsed = false;
		}

		this.start.bind(this);
	}

	clone = () => {
		const cloned = new IntcodeComputer(this.data, this.phase);
		cloned.cursor = this.cursor;
		cloned.relativeBase = this.relativeBase;
		cloned.phaseSettingUsed = this.phaseSettingUsed;
		return cloned;
	}

	*start(...params) {
		while (this.cursor < this.data.length && this.data[this.cursor] != 99) {
			const opcode = new Opcode(this.data[this.cursor]);
			switch (opcode.code) {
				case 1:
					this.handle1(opcode.modes);
					break;
				case 2:
					this.handle2(opcode.modes);
					break;
				case 3:
					if (this.phase === undefined || this.phaseSettingUsed) {
						if (params.length) {
							this.handle3(opcode.modes, params.shift());
						} else {
							this.handle3(opcode.modes, yield);
						}
					} else {
						this.handle3(opcode.modes, this.phase);
						this.phaseSettingUsed = true;
					}
					break;
				case 4:
					yield this.handle4(opcode.modes);
					break;
				case 5:
					this.handle5(opcode.modes);
					break;
				case 6:
					this.handle6(opcode.modes);
					break;
				case 7:
					this.handle7(opcode.modes);
					break;
				case 8:
					this.handle8(opcode.modes);
					break;
				case 9:
					this.handle9(opcode.modes);
					break;
				default:
					throw `Something went wrong, unknown opcode ${opcode.code} at cursor ${this.cursor}`;
			}
		}
	}

	handle1 = (modes) => {
		const sum = this.get(modes, 0) + this.get(modes, 1);
		this.set(modes, 2, sum);
		this.cursor += 4;
	}

	handle2 = (modes) => {
		const mult = this.get(modes, 0) * this.get(modes, 1);
		this.set(modes, 2, mult);
		this.cursor += 4;
	}

	handle3 = (modes, input) => {
		this.set(modes, 0, input);
		this.cursor += 2;
	}

	handle4 = (modes) => {
		const output = this.get(modes, 0);
		this.cursor += 2;
		return output;
	}

	handle5 = (modes) => {
		if (this.get(modes, 0) != 0) {
			this.cursor = this.get(modes, 1);
		} else {
			this.cursor += 3;
		}
	}

	handle6 = (modes) => {
		if (this.get(modes, 0) == 0) {
			this.cursor = this.get(modes, 1);
		} else {
			this.cursor += 3;
		}
	}

	handle7 = (modes) => {
		const param1 = this.get(modes, 0);
		const param2 = this.get(modes, 1);
		this.set(modes, 2, param1 < param2 ? 1 : 0);
		this.cursor += 4;
	}

	handle8 = (modes) => {
		const param1 = this.get(modes, 0);
		const param2 = this.get(modes, 1);
		this.set(modes, 2, param1 == param2 ? 1 : 0);
		this.cursor += 4;
	}

	handle9 = (modes) => {
		this.relativeBase += this.get(modes, 0);
		this.cursor += 2;
	}

	get = (modes, modifier) => {
		const index = this.index(modes[modifier], this.cursor + modifier + 1);
		this.reserveNecessaryMemory(index);
		return this.data[index];
	}

	set = (modes, modifier, value) => {
		const mode = modes[modifier];
		const index = mode == 2
				? this.index(mode, this.cursor + modifier + 1)
				: this.data[this.cursor + modifier + 1];
		this.reserveNecessaryMemory(index);
		this.data[index] = value;
	}

	index = (mode, index) => {
		switch (+mode) {
			case 0:
				return this.data[index];
			case 1:
				return index;
			case 2:
				return this.data[index] + this.relativeBase;
			default:
				throw `Invalid mode ${mode}`;
		}
	}

	reserveNecessaryMemory = (index) => {
		if (index >= this.data.length) {
			this.data.push(...[...'0'.repeat(index - this.data.length + 1)].map(i => +i));
		}
	}
}

const program = data.split(',').map(i => +i);

const key = (pos) => `${pos[0]},${pos[1]}`;

const Direction = {
	NORTH: { input: 1, pos: [0, 1] },
	SOUTH: { input: 2, pos: [0, -1] },
	WEST: { input: 3, pos: [-1, 0] },
	EAST: { input: 4, pos: [1, 0] },
};

class Droid {
	constructor(computer, pos, steps) {
		this.computer = computer;
		this.move = this.moveInt(computer.start());
		this.move.next();
		this.pos = pos;
		this.steps = steps;
		this.moveInt.bind(this);
	}

	clone = (newPosition) => {
		return new Droid(this.computer.clone(), newPosition, this.steps + 1);
	}

	*moveInt(computer) {
		computer.next();
		while (true) {
			const dir = yield;
			const result = computer.next(dir);
			yield result.value;
		}
	}
}

const grid = new Set();
let droids = [];
const finishedDroids = [];
droids.push(new Droid(new IntcodeComputer(program), [0, 0], 0));
grid.add(key([0,0]));

while(true) {
	let moved = false;
	const newGeneration = [];
	for (const droid of droids) {
		for (const dir of Object.values(Direction)) {
			const newPosition = droid.pos.map((a, i) => a + dir.pos[i]);
			const positionKey = key(newPosition);
			if (!grid.has(positionKey)) {
				grid.add(positionKey);
				const cloned = droid.clone(newPosition);
				const result = cloned.move.next(dir.input);
				if (result.value > 0) {
					newGeneration.push(cloned);
					if (result.value == 2) {
						finishedDroids.push(cloned);
					}
					moved = true;
				}
			}
		}
	}
	if (!moved) {
		break;
	}
	droids = newGeneration;
}

console.log(`The least amount of steps required is ${Math.min(finishedDroids.map(d => d.steps))}`);
