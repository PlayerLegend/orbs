function dataURItoBlob(uri) {
    var bytes = atob(dataURI.split(',')[1]);
}

function convertDataURIToBinary(dataURI) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(i = 0; i < rawLength; i++) {
	array[i] = raw.charCodeAt(i);
    }
    return array;
}

function loadSave(file) {
    console.log("File: " + file);
    
    reader = new FileReader();
    reader.addEventListener('load', (file_event) => {
	
	var request = window.indexedDB.open("/easyrpg/Save");

	request.onsuccess = function (event) {
	    console.log("Success opening IndexedDB");

	    db = request.result;

	    db.onerror = function(event) {
		console.log("Error accessing IndexedDB");
	    };

	    var storeName = "FILE_DATA";

	    var transaction = db.transaction([storeName], "readwrite");
	    var bytes = convertDataURIToBinary(file_event.target.result);
	    transaction.objectStore(storeName).put({ timestamp: Date.now(), contents: bytes, mode: 33206 }, "/easyrpg/Save/Save01.lsd");
	    console.log("Set: " + file_event.target.result);
	};
    });
    reader.readAsDataURL(file);
}

const fileSelector = document.getElementById('saveSelector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    const file = fileList.item(0);
    console.log("User chose save: " + file.name);
    loadSave(file);
});
