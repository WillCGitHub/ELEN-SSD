/*
//copy to clipboard tricky way
function CopyToClip(){
	var text=document.getElementById("output_Potential").value;
	window.prompt("Copy to clipboardL: Ctrl+C, Enter", text);

}	
*/

/*
	Create a small textarea, put the data into it and copy to the 
	clipboard, then discard the textarea.
*/
function copyTextToClipboard(){
	
	var textArea=document.createElement("textarea");

	//build a fake hidden textArea to hold the data need to copy
	textArea.style.position='fixed';
	textArea.style.top='0';
	textArea.style.left='0';
	textArea.style.width='2em';
	textArea.style.height='2em';
	
	//reduce flash
	textArea.style.padding=0;

	//make it as invisal as possible
	textArea.style.border='none';
	textArea.style.outline='none';
	textArea.style.boxShadow='none';
	textArea.style.background='transparent';

	//compute ans
	var ans=buildAnsString();
	textArea.value=ans;

	document.body.appendChild(textArea);
	textArea.select();                   ////document.getElementById('<id>').select();
	document.execCommand('copy'); 		 //copy
	document.body.removeChild(textArea); //remove this text area
}

/*
	Function to build a well format string(text) 	
*/
function buildAnsString(){
	buffer="";

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

	return buffer;
}