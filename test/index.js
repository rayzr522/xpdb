const XPDB = require('../lib');

let db = new XPDB('./testDB');

function format(obj) {
    return JSON.stringify(obj, null, 4);
}

async function main() {
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

        await checkType('null-test', null);
        await checkType('undefined-test', undefined);

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

        db.unwrap().createValueStream()
            .on('data', value => {
                console.log(value);
            });

    } catch (err) {
        console.error(err);
    }
}

async function checkType(key, value) {
    console.log(key + ': (' + typeof value + ') ' + JSON.stringify(value, null, 4));
    await db.put(key, value);
    var newVal = await db.get(key);
    console.log(key + ' [new]: (' + typeof newVal + ') ' + JSON.stringify(newVal, null, 4));

    // TODO: Why does this not work?
    // if (value !== newVal) {
    //     throw new Error('Test failed: ' + key);
    // }
}

main();