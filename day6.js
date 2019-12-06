import data from './day6-data'

class TreeNode {
	constructor(parent, value, depth) {
		this.parent = parent
		this.value = value
		this.depth = depth
		this.children = []
	}
}

class Item {
	constructor(value) {
		this.key = value[0]
		this.value = value[1]
	}
}

const split = i => i.split(')')
const orbitMap = data.map(i => new Item(split(i)))

const findRoot = curr => {
	const parent = orbitMap
			.find(i => i.value == curr.key)
	if (parent) {
		return findRoot(parent)
	}

	return curr
}

const rootItem = findRoot(orbitMap[0])
const root = new TreeNode(undefined, rootItem.key, 0)

const buildTree = (parent, item, depth) => {
	const nextItems = orbitMap
			.filter(orbit => orbit.key == item.value)

	const child = new TreeNode(parent, item.value, ++depth)
	parent.children.push(child)

	for (const next of nextItems) {
		buildTree(child, next, depth)
	}
}

buildTree(root, rootItem, 0)

const calculateOrbits = (i) => {
	let depth = 0
	for (const child of i.children) {
		depth += child.depth
		depth += calculateOrbits(child)
	}

	return depth
}

console.log(`Total number of orbits is ${calculateOrbits(root)}`)
