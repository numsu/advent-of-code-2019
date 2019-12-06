import data from './day2-data'

const handle1 = (intcodes, cursor) => {
	const sum = intcodes[intcodes[cursor + 1]] + intcodes[intcodes[cursor + 2]]
	intcodes[intcodes[cursor + 3]] = sum
}

const handle2 = (intcodes, cursor) => {
	const mult = intcodes[intcodes[cursor + 1]] * intcodes[intcodes[cursor + 2]]
	intcodes[intcodes[cursor + 3]] = mult
}

const run = (intcodes, noun, verb) => {
	let cursor = 0
	intcodes[1] = noun
	intcodes[2] = verb
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
				return intcodes[0]
			default:
				throw `Something went wrong, unknown opcode ${opcode}`
		}
	}
}

const intcodes = data.split(',').map(i => +i)
const searchValue = 19690720

let currentValue = 0
let noun = 0
let verb = 0

outer:
for (; noun < 99; noun++) {
	for (; verb < 99; verb++) {
		currentValue = run([...intcodes], noun, verb)
		if (currentValue === searchValue) {
			break outer
		}
	}
	verb = 0
}

console.log(`Position 0 with the noun ${noun} and the verb ${verb} after program run is ${currentValue}`)
console.log(`The correct answer is ${100 * noun + verb}`)
