import data from './day2-data'

const handle1 = (intcodes, cursor) => {
	const sum = intcodes[intcodes[cursor + 1]] + intcodes[intcodes[cursor + 2]]
	intcodes[intcodes[cursor + 3]] = sum
}

const handle2 = (intcodes, cursor) => {
	const mult = intcodes[intcodes[cursor + 1]] * intcodes[intcodes[cursor + 2]]
	intcodes[intcodes[cursor + 3]] = mult
}

const run = (intcodes) => {
	let cursor = 0
	while (cursor < intcodes.length) {
		const opcode = intcodes[cursor]
		switch (opcode) {
			case 1:
				handle1(intcodes, cursor)
				cursor += 4
				break
			case 2:
				handle2(intcodes, cursor)
				cursor += 4
				break
			case 99:
				return
			default:
				throw `Something went wrong, unknown opcode ${opcode}`
		}
	}
}

const intcodes = data.split(',').map(i => +i)
intcodes[1] = 12
intcodes[2] = 2

run(intcodes)

console.log(`Position 0 after program run is ${intcodes[0]}`)
