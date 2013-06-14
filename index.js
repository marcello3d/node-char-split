var through = require('through')

module.exports = function (splitCharacter, encoding) {
    splitCharacter = splitCharacter || '\n'
    if (splitCharacter.length !== 1) {
        throw new Error("Split character length must be 1 (got "+splitCharacter.length+")")
    }
    var soFar = ''

    return through(
        function (buffer) {
            var index
            var start = 0
            while ((index = buffer.indexOf(splitCharacter, start)) !== -1) {
                if (start <= index) {
                    this.queue(soFar + buffer.slice(start, index))
                }
                soFar = '';
                start = index+1
            }
            if (start < buffer.length) {
                soFar += buffer.slice(start)
            }
        },
        function () {
            if (soFar.length) {
                this.queue(soFar);
            }
            this.queue(null)
        }
    )
}
