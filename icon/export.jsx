var sizes = [16, 32, 48, 128];
var doc = app.activeDocument;
var folder = new Folder(doc.path);

for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i];

    var fileName = size + ".png";
    var file = new File(folder + "/" + fileName);
    
    doc.resizeImage(UnitValue(size, "px"), UnitValue(size, "px"));
    
    var options = new PNGSaveOptions();
    doc.saveAs(file, options, true, Extension.LOWERCASE);
    
    doc.activeHistoryState = doc.historyStates[doc.historyStates.length - 2];
}