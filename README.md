# XPDB
> Ultra-fast persistent database solution with a simple to use API

XPDB is a hyper-simplified wrapper around [level](=https://github.com/Level/level), which is a wrapper around [LevelUP](https://github.com/rvagg/node-levelup), which is a wrapper around [LevelDB](https://github.com/google/leveldb). Sounds complicated, right? Nope.

**XPDB** is a super easy to use database system that is just like using a Map. Data is stored persistently, quickly, and all methods use `Promise`s, which means you can use it with the fancy new `async`/`await` features! It can store any kind of data, including `JSON`.

## Installation
`yarn add xpdb`
> Alternatively, you can use `npm install --save xpdb`

## Usage
```javascript
var XPDB = require('xpdb');
var db = new XPDB('./myDB');

// Promises
db.put('some.key', 'Hello world!').then(() => {
	db.get('some.key').then(value => {
		console.log(value);
        // => Hello world!
    }).catch(console.error);
}).catch(console.error);

// async/await
try {
    await db.put('some.key', 'Hello world!');
	console.log(await db.get('some.key'));
	// => Hello world!
} catch (err) {
	console.error(err);
}
```

## Methods
> _Coming soon, for now there are JavaDocs, and it should be pretty self-explanatory._