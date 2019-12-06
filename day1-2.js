import data from './day1-data'

const calculateFuelConsumption = (i) => Math.floor(i / 3) - 2
const calculateAllFuelConsumption = (acc, i) => {
	const consumption = calculateFuelConsumption(i)
	if (consumption > 0) {
		acc += consumption
		return calculateAllFuelConsumption(acc, consumption)
	}

	return acc
}

const totalConsumption = data
		.map(i => calculateAllFuelConsumption(0, i))
		.reduce((acc, i) => acc += i)

console.log(`Total fuel consumption: ${totalConsumption}`)
