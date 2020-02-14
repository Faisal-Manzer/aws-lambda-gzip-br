/* This is an origin request function */
/**
 * @credits https://github.com/SUI-Components/lambda-edge-serve-compressed-file
 */

const supportedFileTypes = [
    '.css',
    '.js',
    '.html'
];


const isSupportedFileType = (uri) => {
    for (let i = 0; i < supportedFileTypes.length ; i++)
        if (uri.endsWith(supportedFileTypes[i]))
            return true;
};

exports.handler = (event, context, callback) => {
    const { request } = event.Records[0].cf;
    const { headers = {} } = request;
    
    if (request.uri.endsWith('/'))
        request.uri += 'index.html';
    
    const isSupportedFile = isSupportedFileType(request.uri);

    // Brotli > GZip > UnCompressed
    if (headers && isSupportedFile) {
        let gz = false;
        let br = false;

        const ae = headers['accept-encoding'];
        if (ae) {
            for (let i = 0; i < ae.length; i++) {
                const { value } = ae[i];
                const bits = value.split(/\s*,\s*/);
                if (bits.includes('br')) {
                    br = true;
                    break;
                }
                else if (bits.includes('gzip')) {
                    gz = true;
                    break;
                }
            }
        }

        if (br) request.uri += '.br';
        else if (gz) request.uri += '.gz';
    }

    callback(null, request);
};

