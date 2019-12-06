import data from './day1-data'

const calculateRequiredFuel = (input) => (
	input.map(i => Math.floor(i / 3) - 2).reduce((acc, i) => acc += i)
)

const fuelRequired = calculateRequiredFuel(data)
console.log(`Fuel required: ${fuelRequired}`)
