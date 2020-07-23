// External
const fs = require("fs");

// Internal
fuseSearch = require("../../assets/js/fuse-search.js");
Fuse = require("../../assets/js/fuse.6.4.0.js")
const index = fs.readFileSync('index.json', 'utf8');

// Mock HTTP 
xhrMock = () => {
	mock = {
	  open             : jest.fn(),
	  send             : jest.fn(() => {
	  	setTimeout(() => {
	  		if ("onreadystatechange" in mock) {
	  			mock.onreadystatechange()
	  		}
	  	}, 1000)
	  }),
	  setRequestHeader : jest.fn(),
	  readyState       : 4,
	  status           : 200,
	  responseText     : index
	}
	return mock;
}
window.XMLHttpRequest = jest.fn().mockImplementation(xhrMock)

// Setup
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

	test('search for \'guide\' yields 1 result', () => {
		expect(globalThis.fusesearch.fuse.search("guide").length).toBe(2)
	});

})
