import data from './day14-data';

class Recipe {
	constructor(input, output) {
		this.input = input;
		this.output = output;
	}
}

class Ingredient {
	constructor(amount, name) {
		this.amount = amount;
		this.name = name;
	}
}

const parseData = (data) => {
	const recipes = new Map();
	for (const row of data) {
		const [ingredientsStr, recipeStr] = row.split('=>');
		const input = ingredientsStr
				.trim().split(',')
				.map(ingredient => {
					const [amount, name] = ingredient.trim().split(' ');
					return new Ingredient(+amount, name);
				});
		const split = recipeStr.trim().split(' ');
		const recipe = new Recipe(input, new Ingredient(+split[0], split[1]));
		recipes.set(recipe.output.name, recipe);
	}

	return recipes;
}

const produce = (name, amount) => {
	let ore = 0;
	const recipe = recipes.get(name);
	const multiplier = Math.ceil(amount / recipe.output.amount);

	for (const ingredient of recipe.input) {
		const produced = multiplier * ingredient.amount;
		if (ingredient.name == 'ORE') {
			ore += produced;
		} else {
			if (!inventory[ingredient.name]) {
				inventory[ingredient.name] = 0;
			}

			if (inventory[ingredient.name] < produced) {
				ore += produce(ingredient.name,
					produced - inventory[ingredient.name]);
			}

			inventory[ingredient.name] -= produced;
		}
	}

	if (!inventory[recipe.output.name]) {
		inventory[recipe.output.name] = 0;
	}

	inventory[recipe.output.name] += multiplier * recipe.output.amount;

	return ore;
}

const searchMaxValue = (find, start, end, amounts) => {
	const middle = Math.floor((start + end) / 2);
	const amount = produce('FUEL', middle);
	if (amounts.some(i => i == middle)) {
		return middle;
	}

	if (amount > find) {
		return searchMaxValue(find, start, middle, amounts);
	} else {
		amounts.push(middle);
		return searchMaxValue(find, middle, end, amounts);
	}
}

const recipes = parseData(data);
const inventory = {};
const maxValue = searchMaxValue(1000000000000, 1, 1000000000000, []);

console.log(`The amount of fuel to be produced is ${maxValue}`);
