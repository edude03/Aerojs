function render(template, content, target){
	//Render the template
	_template = Handlebars.compile(template); 
	target.append(_template(content));

}

function get_template(name){
	$.get({
		url: '/views/' + name,
		success: function(data){
			return data;
		}
	});
}

//Get the template
template = get_template("home");

//Render it to the body
render(template, {name: "Michael"}, $('body'));