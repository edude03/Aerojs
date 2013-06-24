//Program Flow:
//User enters location -> xController and xView are retrieved from the server, when both are retrieved, render the page

/*
 * Renders a template then changes the targets content to
 * the rendered content
 */
function render(template, content, target){
	//If no target was specified set it to body
	target = target || $('body');
	
	//Compile the template
	_template = Handlebars.compile(template);

	//Set the content of the target to the rendered template
	target.html(_template(content));
}

//TODO: Write a simple model mixin using prototypal inheritance 
//that defines basic rest stuff


//Retrieve the content from the server
function get_template(path){
	//Return a promise to be resolved later
	return $.ajax({
		url: '/views/' + path + '.hbs'
	}).done(function(data, textStatus, jqXHR){
		//Return the data when done
		return data;
	});
}

//If the user navigates to a different page, 
//Catch it then goto that page
$(window).on('hashchange', function(){
	render_page(_loc());
});

//Retrieves the path from the location hash
function _loc(){
	//Get the part after the #/ in the hash
	_locHash = location.hash.split('/').slice(1);

	//If we're at / goto the "Home" Page
	if (_locHash.length == 0)
		return "home";

	//If we're at /#/ goto the home page
	return (_locHash[0].length == 0) ? "home" : _locHash;
}


/* Example Controllers, these will be retrieved via AJAX in the future */
var test2Controller = {
	view: function(value){
		return {body: "value is " + value};
	},

	index: function(){
		return {body: "This is the index"};
	}
}

//Determine which controller to load, then retrieve it, 
//Right now it loads example controllers but will
//Be modified to retrieve the controller from /controllers/controllername.js
//To this end it needs to return a promise as well
function load_controller(hash){
	//Get the controller object
	var controller = eval(hash.controller + 'Controller');
	
	return controller[hash.action](hash.params);
}

}

//Waits for the template and controller to be retrieved from the server
//Then renders the page
//Controllers should ultimately return the data the page will use
function render_page(pageName){
	$.when(get_template(pageName), load_controller(pageName)).done(function(template, controller) {
		console.log(template[0]);
		console.log(controller);
		render(template[0], controller);
	});
}

//Start of program
console.log('Current location: '+ _loc());

//On program start, get the current hash (to support bookmarks and such)
render_page(_loc());

