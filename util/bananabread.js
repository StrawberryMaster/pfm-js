// BananaBread, our finest source of utility functions

module.exports = {
	randomColor : () => {
		return Math.floor(Math.random() * 16777215);
	},
	randomElement : (array) => {
		return array[Math.floor(Math.random() * array.length)];
	},
	randomHex : () => {
		return '#' + Math.floor(Math.random() * 16777215).toString(16);
	},
};