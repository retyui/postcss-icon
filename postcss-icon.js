var entry = './lib-old/index.js';

if(checkAsyncAwaitSupport()){
	entry = './lib/index.js';
}else{
	require("regenerator-runtime/runtime");
}

module.exports = require(entry);

function checkAsyncAwaitSupport(){
	var testAsyncAwait = '(async() => { await Promise.resolve(true); })();'
	try{
		eval(testAsyncAwait);
		return true;
	}catch(e){
		return false;
	}
}
