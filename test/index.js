const XPDB = require('../lib');
const rimraf = require('rimraf');

const dbName = './testDB-' + Date.now();
const db = new XPDB(dbName);

const format = input => JSON.stringify(input, null, 4);

const checkType = async (key, value) => {
    console.log(`${key}: (${typeof value}) ${format(value)}`);
    await db.put(key, value);
    let newValue = await db.get(key);
    console.log(`${key} [new]: (${typeof value}) ${format(newValue)}`);
}

const main = async () => {
    try {
        await db.put('name', 'Rayzr');
        console.log(await db.get('name'));

        await db.delete('name');
        console.log(await db.get('name'));

        await db.delete('not-exist');
        await db.put('not-exist', { value: false });

        await checkType('number-test-neg', -1);
        await checkType('number-test-zero', 0);
        await checkType('number-test-one', 1);

        await checkType('string-test', 'Hello');
        await checkType('string-test-empty', '');

        await checkType('bool-test-true', true);
        await checkType('bool-test-false', false);

        await checkType('undefined-test', undefined);
        await checkType('null-in-object', { nullVar: null });

        await checkType('object-test', {
            'bool': true,
            'str': 'Hello!',
            'emptyStr': '',
            'subObject': {
                'num': 5,
                'bool': false
            }
        });

        await checkType('object-test-empty', {});

        console.log(format(await db.keys()));
        console.log(format(await db.values()));
        console.log(format(await db.entries()));
    } catch (err) {
        console.error(err);
    }

    try {
        db.close();
        rimraf.sync(dbName);
    } catch (err) {
        console.error('Error removing test database:', err);
    }
}

main();