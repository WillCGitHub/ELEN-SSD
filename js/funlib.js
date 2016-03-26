/*
//copy to clipboard tricky way
function CopyToClip(){
	var text=document.getElementById("output_Potential").value;
	window.prompt("Copy to clipboardL: Ctrl+C, Enter", text);

}	
*/

/*
	This is the prototype for the function, 
	it basiclly select the data in a specific input|text field,
	then copy...
*/
function CopyToClip(){
	output_Potential.select();
	document.execCommand('copy');
}