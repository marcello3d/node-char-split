var through = require('through')
var StringDecoder = require('string_decoder').StringDecoder

module.exports = function (splitCharacter, encoding) {
    splitCharacter = splitCharacter || '\n'
    if (splitCharacter.length !== 1) {
        throw new Error("Split character length must be 1 (got "+splitCharacter.length+")")
    }
    var decoder = new StringDecoder(encoding)
    var soFar = []

    function emit(stream) {
        stream.queue(soFar.join(''))
    }

    return through(
        function (buffer) {
            var string = decoder.write(buffer)
            var index
            var start = 0
            while ((index = string.indexOf(splitCharacter, start)) !== -1) {
                if (start < index) {
                    soFar.push(string.slice(start, index))
                }
                emit(this)
                soFar = []
                start = index+1
            }
            if (start < string.length) {
                soFar.push(string.slice(start))
            }
        },
        function () {
            if (soFar.length) {
                emit(this)
            }
            this.queue(null)
        }
    )
}
