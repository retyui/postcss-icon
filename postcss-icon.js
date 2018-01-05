function checkAsyncAwaitSupport(){
	var testAsyncAwait = '(async() => { await Promise.resolve(true); })();'
	try{
		eval(testAsyncAwait);
		return true;
	}catch(e){
		return false;
	}
}

var entry = checkAsyncAwaitSupport() ? './lib/index.js' : './lib-old/index.js';

module.exports = require(entry);
