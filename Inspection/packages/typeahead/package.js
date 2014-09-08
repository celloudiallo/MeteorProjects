Package.describe({
	summary: "Autocomplete package for meteor powered by twitter typeahead.js"
});

Package.on_use(function(api, where) {
	api.use('jquery', 'client');
	api.add_files(['typeahead.js','typeahead.css'], 'client');
});
