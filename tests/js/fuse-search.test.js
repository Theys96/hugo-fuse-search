
fuseSearch = require("../../assets/js/fuse-search.js");
fuseSearch.setupSearch()

test('fuseSearch is not init at first', () => {
	expect(globalThis.fusesearch.isInit).toBe(false)
});

test('fuseSearch is init after calling FuseSearch.init()', () => {
	globalThis.fusesearch.init()
	expect(globalThis.fusesearch.isInit).toBe(true)
});

