var fs = require('fs');
var path = require('path');

console.log(process.argv);
if (process.argv.length <= 2) {
	console.log('Usage: please insert path as first argument');
	process.exit(-1);
}

var  folderPath = process.argv[2];

const RNImagesPath = folderPath+'/RNImages';
const JSONObject = {};

console.log(folderPath);

if (!fs.existsSync(RNImagesPath)){
    fs.mkdirSync(RNImagesPath);
}

tinifyImage(folderPath);

function tinifyImage(file_path) {
	fs.readdir(file_path, function(err, items) {
		const folderName = path.basename(file_path);
		console.log(folderName);
		
		for (var i = 0; i < items.length; i++) {
			var fileuri = file_path + '/' + items[i];
			try {
				if (!fs.statSync(fileuri).isFile()) {

					tinifyImage(fileuri);
				} else if (getFileExtensions(items[i], ['png', 'PNG'])) {
					moveFile(file_path, items[i]);
					if(!items[i].includes('2x.') && !items[i].includes('3x.') && !items[i].includes('2X.') && !items[i].includes('3X.')){
						const key = folderName.split(".")[0];
						JSONObject[key] = items[i];
						saveToFile(JSONObject);
					}
				}
			} catch (e) {
				console.log(e);
			}
		}
	});
}

function getFileExtensions(filename, extensions) {
	var ext = /[.]/.exec(filename) ? /[^.]+$/.exec(filename)[0] : undefined;
	return ext ? extensions.indexOf(ext) > -1 : false;
}


function saveToFile(JSONObject) {
	fs.writeFile(RNImagesPath+'/images.json',  JSON.stringify(JSONObject, null, 4), 'utf8', ()=>{
	});
}

function moveFile(oldPath, file){
	var oldPath = oldPath+  '/'+file;
	var newPath = RNImagesPath+  '/'+file;
	fs.rename(oldPath, newPath, function (err) {
	if (err) throw err
	})
}