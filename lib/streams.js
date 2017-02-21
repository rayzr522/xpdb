exports.streamToPromise = function (stream) {
    return new Promise((resolve, reject) => {
        var output = [];
        stream.on('data', data => {
            output.push(data);
        });
        stream.on('close', () => {
            resolve(output);
        });
        stream.on('error', err => {
            reject(err);
        });
    });
}