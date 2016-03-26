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

function CopyToClipResult(){
	var buffer="";

	//read data
	var Potential = document.getElementById("output_Potential");   //match the order of the UI
	var CurrentDen_p = document.getElementById("output_currentDen_p");
	var CurrentDen_n = document.getElementById("output_currentDen_n");
	var Resistivity_p = document.getElementById("output_resistivity_p");
	var Resistivity_n = document.getElementById("output_resistivity_n");
	var DepRegion_p = document.getElementById("output_depletionRegion_p");
	var DepRegion_n = document.getElementById("output_depletionRegion_n");
	var DepRegion_d = document.getElementById("output_depletionRegion_d");
	var Capacitance = document.getElementById("output_capacitance");
	
	
	//put data into array
	var tag=["Potential", "Ip","In","Rp","Rn","DR_p","DR_n","DR_d","Cap"];
	var data=[Potential.value,CurrentDen_n.value,CurrentDen_p.value,Resistivity_n.value,Resistivity_p.value,
			  DepRegion_p.value,DepRegion_n.value,DepRegion_d.value,Capacitance.value];
	
	//format array
	for(i=0;i<9;i++){
		buffer=buffer+tag[i]+" "+data[i]+"\n";
	}

	//put into text hidden field ta
	document.getElementById('ta').value=buffer;

	//copy to the clopboard
	ta.select('AnsTextArea');
	document.execCommand('copy');
}
