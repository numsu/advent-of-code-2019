import data from './day6-data'

class TreeNode {
	constructor(parent, value) {
		this.parent = parent
		this.value = value
		this.children = []
		this.findChild.bind(this)
		this.jumpTo.bind(this)
	}

	findChild(value, jumps = 0) {
		jumps++
		for (const child of this.children) {
			if (child.value == value) {
				return { found: child, jumps: jumps }
			}

			const found = child.findChild(value, jumps)
			if (!found) {
				continue
			}

			return { found: found.found, jumps: found.jumps }
		}
	}

	jumpTo(value, current, jumps = 0) {
		if (current.children.length < 2) {
			return current.jumpTo(value, current.parent, ++jumps)
		}

		const child = current.findChild(value)
		if (child && child.found) {
			return jumps + child.jumps - 1
		}

		return current.jumpTo(value, current.parent, ++jumps)
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
const root = new TreeNode(undefined, rootItem.key)

const buildTree = (parent, item) => {
	const nextItems = orbitMap
			.filter(orbit => orbit.key == item.value)

	const child = new TreeNode(parent, item.value)
	parent.children.push(child)

	for (const next of nextItems) {
		buildTree(child, next)
	}
}

buildTree(root, rootItem)

const { found } = root.findChild('SAN')
console.log(`Orbital jumps required to reach Santa is ${found.jumpTo('YOU', found.parent)}`)
