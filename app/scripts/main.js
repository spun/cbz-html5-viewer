/*global JSZip, Unrar */


var fileExtensionReg = /^.+\.(cbz|cbr|zip|rar)$/i;


var readRarFile = function(e) {
    'use strict';

    var unrar = null;
    var result = e.target.result;

    if (unrar !== null) { unrar.close(); }
    unrar = new Unrar(result);
    var entries = unrar.getEntries();

    entries.forEach(function(entry) {

        if(!entry.isDirectory() && entry.name.indexOf('.jpg') !== -1) {

            var data = unrar.decompress(entry.name);
            var blob = new Blob([data]);

            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL( blob );

            var image = new Image();
            image.src = imageUrl;

            var imageListItem = document.createElement('li');
            imageListItem.appendChild(image);

            document.getElementById('imageList').appendChild(imageListItem);
        }
    });
};


var readZipFile = function(e) {
    'use strict';

    try {
        //var dateBefore = new Date();
        // read the content of the file with JSZip
        var zip = new JSZip(e.target.result);
        //var dateAfter = new Date();

        for (var key in zip.files) {
            if (zip.files.hasOwnProperty(key)) {
                var entry = zip.files[key];

                if(!entry.options.dir && entry.name.indexOf('.jpg') !== -1) {

                    var arrayBufferView = new Uint8Array( entry.asArrayBuffer() );
                    var blob = new Blob( [ arrayBufferView ], { type: 'image/jpeg' } );
                    var urlCreator = window.URL || window.webkitURL;
                    var imageUrl = urlCreator.createObjectURL( blob );

                    var image = new Image();
                    image.src = imageUrl;

                    var imageListItem = document.createElement('li');
                    imageListItem.appendChild(image);

                    document.getElementById('imageList').appendChild(imageListItem);
                }
            }
        }

    } catch(err) {
        console.log('Error reading: ' + err.message);
    }
};






var fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', function() {

    'use strict';

    var f = fileInput.files[0];
    var fileExtensionRegResult = fileExtensionReg.exec(f.name);

    if (fileExtensionRegResult !== null) {

        var fileExtension = fileExtensionRegResult[1];

        var reader = new FileReader();
        reader.onload = (function () {

            var readFunction = null;
            if (fileExtension === 'rar' || fileExtension === 'cbr') {
                readFunction = readRarFile;
            } else if (fileExtension === 'zip' || fileExtension === 'cbz') {
                readFunction = readZipFile;
            }

            return readFunction;

        }(f));
        reader.readAsArrayBuffer(f);

    }
});



