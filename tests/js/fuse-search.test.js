
fuseSearch = require("../../assets/js/fuse-search.js");
Fuse = require("../../assets/js/fuse.6.4.0.js")
fuseSearch.setupSearch()

describe('before initialization', () => {
	test('fuseSearch is not init at first', () => {
		expect(globalThis.fusesearch.isInit).toBe(false)
	});
})

describe('once initialized', () => {
	beforeAll(() => {
	  return globalThis.fusesearch.init()
	});

	test('fuseSearch is init after calling FuseSearch.init()', () => {
	 	expect(globalThis.fusesearch.isInit).toBe(true)
	});

	test('fuse is now available', () => {
		expect(globalThis.fusesearch.fuse).not.toBe(false)
	});

	test('there are records', () => {
		expect(globalThis.fusesearch.fuse.getIndex().records.length).toBeGreaterThan(0)
	});

	test('do a search', () => {
		globalThis.fusesearch.fuse.search("blog")
	});

})
