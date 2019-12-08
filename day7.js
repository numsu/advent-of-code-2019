import data from './day7-data'

class Opcode {
	constructor(code) {
		code = '' + code
		this.code = +code.substring(code.length - 2)
		this.modes = [...code.substring(0, code.length - 2).padStart(3, '0')]
				.reverse()
	}
}

class IntcodeComputer {
	constructor(data, phase) {
		this.data = [...data]
		this.phase = +phase
		this.phaseUsed = false
		this.cursor = 0

		this.run.bind(this)
		this.handle1.bind(this)
		this.handle2.bind(this)
		this.handle3.bind(this)
		this.handle4.bind(this)
		this.handle5.bind(this)
		this.handle6.bind(this)
		this.handle7.bind(this)
		this.handle8.bind(this)
		this.get.bind(this)
		this.index.bind(this)
	}

	run(input) {
		let output
		while (this.cursor < this.data.length) {
			const opcode = new Opcode(this.data[this.cursor])
			switch (opcode.code) {
				case 1:
					this.handle1(opcode.modes)
					break
				case 2:
					this.handle2(opcode.modes)
					break
				case 3:
					this.handle3(input)
					break
				case 4:
					output = this.handle4(opcode.modes)
					break
				case 5:
					this.handle5(opcode.modes)
					break
				case 6:
					this.handle6(opcode.modes)
					break
				case 7:
					this.handle7(opcode.modes)
					break
				case 8:
					this.handle8(opcode.modes)
					break
				case 99:
					return output
				default:
					throw `Something went wrong, unknown opcode ${opcode.code} at cursor ${this.cursor}`
			}
		}
	}

	handle1(modes) {
		const sum = this.get(modes, 0) + this.get(modes, 1)
		this.data[this.data[this.cursor + 3]] = sum
		this.cursor += 4
	}

	handle2(modes) {
		const mult = this.get(modes, 0) * this.get(modes, 1)
		this.data[this.data[this.cursor + 3]] = mult
		this.cursor += 4
	}

	handle3(input) {
		if (!this.phaseUsed) {
			input = this.phase
			this.phaseUsed = true
		}

		this.data[this.data[this.cursor + 1]] = input
		this.cursor += 2
	}

	handle4(modes) {
		const output = this.get(modes, 0)
		this.cursor += 2
		return output
	}

	handle5(modes) {
		if (this.get(modes, 0) != 0) {
			this.cursor = this.get(modes, 1)
		} else {
			this.cursor += 3
		}
	}

	handle6(modes) {
		if (this.get(modes, 0) == 0) {
			this.cursor = this.get(modes, 1)
		} else {
			this.cursor += 3
		}
	}

	handle7(modes) {
		const param1 = this.get(modes, 0)
		const param2 = this.get(modes, 1)
		this.data[this.index(modes[2], this.cursor + 3)] = param1 < param2
				? 1 : 0
		this.cursor += 4
	}

	handle8(modes) {
		const param1 = this.get(modes, 0)
		const param2 = this.get(modes, 1)
		this.data[this.index(modes[2], this.cursor + 3)] = param1 == param2
				? 1 : 0
		this.cursor += 4
	}

	get(modes, modifier) {
		return this.data[this.index(modes[modifier], this.cursor + modifier + 1)]
	}

	index(mode, index) {
		return mode == 0
				? this.data[index]
				: index
	}
}

const intcodes = data.split(',').map(i => +i)
const calculatePermutations = arr => arr.length
		? arr.reduce((acc, curr, i) => [
			...acc,
			...calculatePermutations([ ...arr.slice(0, i), ...arr.slice(i + 1) ])
				.map(x => [ curr, ...x ])
			], [])
		: [[]]

const possibleAmplifierPhases = calculatePermutations([...'01234'])

const thrusterSignals = []
for (const phase of possibleAmplifierPhases) {
	let output = 0
	for (let i = 0; i < 5; i++) {
		const computer = new IntcodeComputer(intcodes, phase[i])
		output = computer.run(output)
	}
	thrusterSignals.push(output)
}

console.log(`The highest signal that can be sent to the thrusters is ${Math.max(...thrusterSignals)}`)
