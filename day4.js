const data = '183564-657474'.split('-')

const digitsToArr = digits => (
	[...('' + digits)]
)

const checkAdjacentNumbers = digits => {
	let previous = ''
	for (const c of digitsToArr(digits)) {
		if (previous == c) {
			return true
		}
		previous = c
	}
	return false
}

const checkIncreasingNumbers = digits => {
	let previous = ''
	for (const c of digitsToArr(digits)) {
		if (+previous > +c) {
			return false
		}
		previous = c
	}
	return true
}

let current = +data[0]
const max = +data[1]

const possiblePasswords = []
while (current < max) {
	current++
	if (!checkAdjacentNumbers(current)) {
		continue
	}
	if (!checkIncreasingNumbers(current)) {
		continue
	}
	possiblePasswords.push(current)
}

console.log(`Number of possible passwords is ${possiblePasswords.length}`)
