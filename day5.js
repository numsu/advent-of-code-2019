import data from './day5-data'

class Opcode {
	constructor(code) {
		code = '' + code
		this.code = +code.substring(code.length - 2)
		this.modes = [...code.substring(0, code.length - 2).padStart(3, '0')]
				.reverse()
	}
}

const index = (mode, cursor) => {
	return mode == 0
			? intcodes[cursor]
			: cursor
}

const handle1 = (cursor, modes) => {
	const sum = intcodes[index(modes[0], cursor + 1)]
			+ intcodes[index(modes[1], cursor + 2)]
	intcodes[intcodes[cursor + 3]] = sum
}

const handle2 = (cursor, modes) => {
	const mult = intcodes[index(modes[0], cursor + 1)]
			* intcodes[index(modes[1], cursor + 2)]
	intcodes[intcodes[cursor + 3]] = mult
}

const handle3 = (cursor, modes, input) => {
	intcodes[index(modes[0], cursor + 1)] = input
}

const handle4 = (cursor, modes) => {
	const target = index(modes[0], cursor + 1)
	console.log(`Output at cursor ${cursor} in address ${intcodes[cursor + 1]}: ${intcodes[target]}`)
}

const run = (intcodes, input) => {
	let cursor = 0
	while (cursor < intcodes.length) {
		const opcode = new Opcode(intcodes[cursor])
		switch (opcode.code) {
			case 1:
				handle1(cursor, opcode.modes)
				cursor += 4
				break
			case 2:
				handle2(cursor, opcode.modes)
				cursor += 4
				break
			case 3:
				handle3(cursor, opcode.modes, input)
				cursor += 2
				break
			case 4:
				handle4(cursor, opcode.modes)
				cursor += 2
				break
			case 99:
				return intcodes[0]
			default:
				throw `Something went wrong, unknown opcode ${opcode.code} at cursor ${cursor}`
		}
	}
}

const intcodes = data.split(',').map(i => +i)
run(intcodes, 1)
