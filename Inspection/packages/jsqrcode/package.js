Package.describe({
	summary: "JavaScript QRCode reader for HTML5 enabled browser."
});

Package.on_use(function (api, where) {
  api.add_files(["grid.js","version.js","detector.js","formatinf.js","errorlevel.js","bitmat.js","datablock.js","bmparser.js","datamask.js","rsdecoder.js","gf256poly.js","gf256.js","decoder.js","qrcode.js","findpat.js","alignpat.js","databr.js"], 'client');
  if (api.export)
    api.export('qrcode');
});