/*
//copy to clipboard tricky way
function CopyToClip(){
	var text=document.getElementById("output_Potential").value;
	window.prompt("Copy to clipboardL: Ctrl+C, Enter", text);

}	
*/

/*
	Copy the data in the text field
*/
function copyTextToClipboard(){
	
	//compute ans
	var ans=buildAnsString();

	//create a textfiled to hold data
	var textField=buildTempTextArea("copyField");
	textField.value=ans;

	document.body.appendChild(textField);
	textField.select();                      //document.getElementById('<id>').select();
	document.execCommand('copy'); 	    	 //copy
	document.body.removeChild(textField);    //remove this text area
}

/*
	create a hiidden text field by fieldId
*/ 
function buildTempTextArea(fieldId){
	var textArea=document.createElement("textarea");
	textArea.setAttribute("id",fieldId);
	//textArea.id=fieldId;

	//build a hidden textArea to hold the data need to copy
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

	return textArea;
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
///////////////////////////////////////////////////////////

var ansQueue=[];
//build one set of calculation into an array and then put array into a Queue;
function buildHistory(){
	var Potential2 = document.getElementById("output_Potential");   //match the order of the UI
	var CurrentDen_p2 = document.getElementById("output_currentDen_p");
	var CurrentDen_n2 = document.getElementById("output_currentDen_n");
	var Resistivity_p2 = document.getElementById("output_resistivity_p");
	var Resistivity_n2 = document.getElementById("output_resistivity_n");
	var DepRegion_p2 = document.getElementById("output_depletionRegion_p");
	var DepRegion_n2 = document.getElementById("output_depletionRegion_n");
	var DepRegion_d2 = document.getElementById("output_depletionRegion_d");
	var Capacitance2 = document.getElementById("output_capacitance");

	var data2=[Potential2.value,CurrentDen_n2.value,CurrentDen_p2.value,Resistivity_n2.value,Resistivity_p2.value,
			  DepRegion_p2.value,DepRegion_n2.value,DepRegion_d2.value,Capacitance2.value];
	
	saveAnswerToQueue(data2);
}

//use Array to simulate Queue
function saveAnswerToQueue(ansToSave){

	if(ansQueue.length<3){
		ansQueue.push(ansToSave);
	}else{
		ansQueue.shift();
		ansQueue.push(ansToSave);
	} 

}

function showAnsHistory(){
	ansHistoryBuffer="";

	//build ansbuffer
	var tag2=["Potential:", "Ip:\t   ","In:\t   ","Rp:\t    ","Rn:\t    ","DR_p:","DR_n:","DR_d:","Cap:\t    "];

	var l=ansQueue.length;
	for(i=0;i<9;i++){
		if(l==1){
			ansHistoryBuffer+=tag2[i]+"\t"+ansQueue[0][i]+"\n";
		}else if(l==2){
			ansHistoryBuffer+=tag2[i]+"\t"+ansQueue[0][i]+"\t"+ansQueue[1][i]+"\n";

		}else{
			ansHistoryBuffer+=tag2[i]+"\t"+ansQueue[0][i]+"\t"+ansQueue[1][i]+"\t"+ansQueue[2][i]+"\n";
		}
	}
	var temp=document.getElementById('PNHistoryArea');
	temp.innerHTML=ansHistoryBuffer;

	
}
