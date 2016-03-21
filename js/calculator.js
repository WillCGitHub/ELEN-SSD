// define constants
var q;
var ni;
var epsilon_s;
var epsilon_ox;
var epsilon_0;
var t_ox;
q = 1.6e-19;
ni = 1e+10;
epsilon_s = 1.035e-12;
epsilon_ox = 3.45e-13;
epsilon_0 = 8.85e-14;

//Pn junction
function Execute_pn(){
	//get values from user's input
	var NaCon = eval(document.getElementById("NaCon").value);
	var NdCon = eval(document.getElementById("NdCon").value);
	var mobility = eval(document.getElementById("mobility").value);
	var electricField = eval(document.getElementById("electricField").value);
	
	//calculate the value by using the calculate function
	Calculate_pn(NaCon,NdCon,mobility,electricField);
	console.log("Na: "+NaCon+" Nd: "+NdCon+" Mobility: "+mobility+" E-Field: "+electricField);
}
function Reset_form(number){
	//reset the values of a specific form
	if (number==1){
	document.getElementById("reset_1_1").reset();
	document.getElementById("reset_1_2").reset();
	document.getElementById("reset_1_3").reset();
		}
	}
	
//main pn junction calculation function
function Calculate_pn(NaCon,NdCon,mobility,electricField){
	var currentDensity_n = Current_density(NdCon,mobility, electricField);
	var currentDensity_p = Current_density(NaCon,mobility, electricField);
	var res_n = Resistivity(NdCon, mobility);
	var res_p = Resistivity(NaCon,mobility);
	var phi_n = Phi_n(NdCon);
	var phi_p = Phi_p(NaCon);
	var phi_b = Phi_b(phi_n,phi_p);
	console.log("phi_n= "+phi_n+" phi_p= "+phi_p+" phi_b= "+phi_b);
	var x_no = Number(X_no(phi_b,NaCon,NdCon).toExponential());
	
    var x_po = Number(X_po(phi_b,NaCon,NdCon).toExponential());
	
	var x_d;
	if (x_no != null && x_po != null){
		x_d = Number(x_no)+Number(x_po);
		//console.log("1");
		}
	else {
		x_d = X_d(phi_b,NaCon,NdCon).toExponential();
		//console.log("2");
	}
	var cap = Cap_pn(x_d);
	console.log("x_d="+x_d+" cap1="+cap);
	//convert to nanometers
	x_no = cm_nm(x_no);
	x_po = cm_nm(x_po);
	x_d = cm_nm(x_d);
	cap = F_nF(cap);
	//displaying
	var display_currentDen_p = document.getElementById("output_currentDen_p");
	var display_currentDen_n = document.getElementById("output_currentDen_n");
	var display_resistivity_p = document.getElementById("output_resistivity_p");
	var display_resistivity_n = document.getElementById("output_resistivity_n");
	var display_Potential = document.getElementById("output_Potential");
	var display_DepRegion_p = document.getElementById("output_depletionRegion_p");
	var display_DepRegion_n = document.getElementById("output_depletionRegion_n");
	var display_DepRegion_d = document.getElementById("output_depletionRegion_d");
	var display_Capacitance = document.getElementById("output_capacitance");
	
	display_currentDen_p.value = (currentDensity_p); 
	display_currentDen_n.value = (currentDensity_n); 
	display_resistivity_p.value = (res_p.toExponential());
	display_resistivity_n.value = (res_n.toExponential());
	display_Potential.value = (phi_b.toFixed(2));
	display_DepRegion_p.value = (x_po.toFixed(2));
	display_DepRegion_n.value = (x_no.toFixed(2));
	display_DepRegion_d.value = (x_d.toFixed(2));
	display_Capacitance.value = (cap.toFixed(2));
	}
	

function Current_density(carrier_density,mobility, electricField){
	var currentDensity = q*carrier_density*mobility*electricField;
	return currentDensity;
	}
function Cap_pn(distance){
	var cap = epsilon_s/distance;
	return cap;
	}
function Cap_calc(){
	var dis = eval(document.getElementById("cap_clac").value);
	var capacitance = Cap_pn(dis);
	console.log("dis="+dis);
	console.log("Capacitance = "+capacitance+"F");
	capacitance = Number(F_nF(capacitance).toExponential());
	document.getElementById("output_cap_clac").value = (capacitance.toFixed(2));
	}
function Cap_ox_calc(){
	var dis = eval(document.getElementById("cap_ox_clac").value);
	var capacitance = epsilon_ox/dis;
	console.log("t_ox="+dis);
	console.log("Capacitance_ox = "+capacitance+"F");
	capacitance = Number(F_nF(capacitance).toExponential());
	document.getElementById("output_cap_ox_clac").value = (capacitance.toFixed(2));
	}	
function Diffusitivity(){
	var mob = document.getElementById("mobility").value;
	var diff = 0.025*mob;
	var display_diff = document.getElementById("diffusivity");
	display_diff.value= diff;
	}
function Resistivity(Dop_Con,mob){
	var resistivity = 1/(q*Dop_Con*mob);
	return resistivity;
	}
function Phi_n(NdCon){
	var phi_n = 0.06*Math.log10(NdCon/ni);
	return phi_n;
	
	}
function Phi_p(NaCon){
	var phi_p = -0.06*Math.log10(NaCon/ni);
	return phi_p;
	
	}
function Phi_b(phi_n,phi_p){
	var phi_b = phi_n-phi_p;
	return phi_b;
	}
function X_no(phi_b,NaCon,NdCon){
	var x_no = Math.sqrt(2*epsilon_s*phi_b*Number(NaCon)/(q*(Number(NaCon)+Number(NdCon))*Number(NdCon)));
	var v_d = document.getElementById("V_RB").value;
	console.log("v_d"+v_d);
	if( v_d!= null&& v_d < 1){
		x_no = Reverse_bias(x_no,phi_b);
		}
	else if(v_d >= 1){
		alert("The value of reverse bias cannot be greater or equal to 1V.");
		}
	console.log("x_no = "+x_no+" cm");
	return x_no;
	}
function X_po(phi_b,NaCon,NdCon){
	var x_po = Math.sqrt(2*epsilon_s*phi_b*NdCon/(q*(Number(NaCon)+Number(NdCon))*NaCon));
	var v_d = document.getElementById("V_RB").value;
	console.log("v_d"+v_d);
	if( v_d!= null&& v_d < 1){
		x_po = Reverse_bias(x_po,phi_b);
		}
	console.log("x_po = "+x_po+" cm");
	return x_po;
	}
function X_d(phi_b,NaCon,NdCon){
	var x_d = Math.sqrt(2*epsilon_s*phi_b*(Number(NaCon)+Number(NdCon))/(q*NaCon*NdCon));
	var v_d = document.getElementById("V_RB").value;
	console.log("x_d = "+x_d+" cm");
	if( v_d!= null && v_d < 1){
		x_d = Reverse_bias(x_d,phi_b);
		}
	return x_d;
	}
function Reverse_bias(num,phi_b){
	var vd= document.getElementById("V_RB").value;
	num = num*Math.sqrt(1-(vd/phi_b));
	return num;
	}

	
//unit converter

//swap button
function Exchange(){
	var unit_1=document.getElementById("Unit_1").value;
	var unit_2=document.getElementById("Unit_2").value;
	var e_1 = document.getElementById("s_unit_1");
	var e_2 = document.getElementById("s_unit_2");
	var u1 = e_1.options[e_1.selectedIndex].value;
	var u2 = e_2.options[e_2.selectedIndex].value;
    if(u1 != u2){
		document.getElementById("s_unit_1").value = u2;
		document.getElementById("s_unit_2").value = u1;
		}
	var change_unit1 = document.getElementById("Unit_1");
	change_unit1.value = unit_2;
	var change_unit2 = document.getElementById("Unit_2");
	change_unit2.value = unit_1;
	}
	
// convert main function	
function Convert(){
	//find which unit the user selected
	var e_1 = document.getElementById("s_unit_1");
	var u1 = e_1.options[e_1.selectedIndex].value;//user selected 1
	var e_2 = document.getElementById("s_unit_2");
	var u2 = e_2.options[e_2.selectedIndex].value;//user selected 2
	//console.log(UserSelected_1+UserSelected_2);
	var unit_1=eval(document.getElementById("Unit_1").value);
	var unit_2=document.getElementById("Unit_2");
	if (u1 != u2){
		switch(u1+"|"+u2){
			case"1|2":
			unit_2.value = (cm_microm(unit_1)).toExponential();
			break;
			case"1|3":
			unit_2.value = (cm_nm(unit_1)).toExponential();
			break;

			case"2|1":
			unit_2.value = (microm_cm(unit_1)).toExponential();
			break;
			case"2|3":
			unit_2.value = (microm_nm(unit_1)).toExponential();
			break;
	
			case"3|1":
			unit_2.value = (nm_cm(unit_1)).toExponential();
			break;
			case"3|2":
			unit_2.value = (nm_microm(unit_1)).toExponential();
			break;

			}
	}
	else {
		unit_2.value = unit_1;
		}
	
	}
function cm_nm(num){
	num = num*1e+7;
	return num;
	}
function nm_cm(num){
	num = num*1e-7;
	return num;
	}
function cm_microm(num){
	num = num*1e+4;
	return num;
	}
function microm_cm(num){
	num = num*1e-4;
	return num;
	}
function microm_nm(num){
	num = num*1e+3;
	return num;
	}
function nm_microm(num){
	num = num*1e-3;
	return num;
	}
function F_nF(num){
	num = num*1e+9;
	return num;
	}
	
	
//Mos Capacitor
//main function
function Execute_moscap(){
	var gateType=document.querySelector('input[name="GateType"]:checked').value;
	console.log("Gate Type is "+gateType);
	var moscap_t_ox = document.getElementById("moscap_t_ox").value;
	console.log("t_ox is "+moscap_t_ox);
	var V_gb = document.getElementById("Mos_GB").value;
	var s_Type = document.querySelector('input[name="mos_semiconducter"]:checked').value;
	var c_ox = Mos_c_ox(moscap_t_ox);
	var phi_gate; //gate
	if (gateType == "p+"){
		phi_gate = -0.55;
		}
	else if (gateType == "n+"){
		phi_gate = 0.55;
		}
		
	var doping_con; //substrate
	var phi_sub;

	if (s_Type == "Na"){
		doping_con = document.getElementById("mos_semi_Na").value;
		phi_sub = Phi_p(doping_con);
		}
	else if(s_Type =="Nd"){
		doping_con = document.getElementById("mos_semi_Nd").value;
		phi_sub = Phi_n(doping_con); 	
		}

	console.log("semiconducter type is "+s_Type+", concentration is "+doping_con);
	
	var mos_phi_b = phi_gate-phi_sub; 
	var V_fb = MOS_v_fb(mos_phi_b);
	
	// threshold voltage
	var thresholdVoltage;
	if (s_Type == "Na"){
		var tp = MOS_V_tn(V_fb,phi_sub,c_ox, doping_con);
		thresholdVoltage = tp;
		}
	else if(s_Type =="Nd"){
		var tn = MOS_V_tp(V_fb,phi_sub,c_ox, doping_con);
		thresholdVoltage = tn;
		}

	//MOS capacitor in depletion
	var xd0 = MOS_x_d0(moscap_t_ox,c_ox,V_fb,doping_con);
	var xd = MOS_x_d(moscap_t_ox,c_ox,V_fb,V_gb,doping_con);
	var c_b = MOS_c_b(xd);
	var c_dep_total = MOS_c_depletion_tot(c_ox,c_b);
	
	//display
	var display_Vfb = document.getElementById("MOS_output_Vfb");
	var display_Vt = document.getElementById("MOS_output_Vt");
	var display_xd0 = document.getElementById("MOS_output_xd0");
	var display_xd = document.getElementById("MOS_output_xd");
	var display_cox = document.getElementById("MOS_output_cox");
	var display_cb = document.getElementById("MOS_output_cb");
	var display_c_dep_tot = document.getElementById("MOS_output_cd_total");
	
	display_Vfb.value = V_fb.toFixed(2);
	display_Vt.value = thresholdVoltage.toFixed(2);
	display_xd0.value = xd0.toExponential(2);
	display_xd.value = xd.toExponential(3);
	display_cox.value = c_ox.toExponential(3);
	display_cb.value = c_b.toExponential(3);
	display_c_dep_tot.value = c_dep_total.toExponential(3);
	}
	
function Mos_c_ox(tox){
	var capacitance = epsilon_ox/tox;
	return capacitance;
	}
function MOS_v_fb(phi_b){
	var v_fb = -phi_b;
	console.log("flatband voltage is: "+v_fb);
	return v_fb;
	}
function MOS_V_tp(V_fb,phi_n,c_ox,NdCon){
	var a = 1/c_ox;
	var b = Math.sqrt(2*q*epsilon_s*NdCon*2*phi_n);
	var vtp = V_fb - 2*phi_n - a*b;
	console.log("MOSCAP V_tp: "+vtp);
	return vtp;
	}	
function MOS_V_tn(V_fb,phi_p,c_ox,NaCon){
	var a = 1/c_ox;
	var b = Math.sqrt(2*q*epsilon_s*NaCon*(-2)*phi_p);
	var vtp = V_fb - 2*phi_p + a*b;
	console.log("MOSCAP V_tp: "+vtp);
	return vtp;
	}
function MOS_x_d0(t_ox,c_ox,V_fb,NaCon){
	var a = t_ox*epsilon_s/epsilon_ox;
	var b = 2*Math.pow(c_ox,2)*(-V_fb)/(q*epsilon_s*NaCon);
	var xd0 = a*(Math.sqrt(1+b)-1);
	console.log("MOSCAP X_d0: "+xd0);
	return xd0;
	}	
function MOS_x_d(t_ox,c_ox,V_fb,V_gb,NaCon){
	var a = t_ox*epsilon_s/epsilon_ox;
	var b = 2*Math.pow(c_ox,2)*(V_gb-V_fb)/(q*epsilon_s*NaCon);
	var xd = a*(Math.sqrt(1+b)-1);
	console.log("MOSCAP X_d: "+xd);
	return xd;
	}
function MOS_c_b(X_d){
	var cb=epsilon_s/X_d;
	console.log("MOSCAP C_b: " +cb);
	return cb;
	}
function MOS_c_depletion_tot(c_ox,c_b){
	var c_d_t = (c_ox*c_b)/(c_ox+c_b);
	console.log("MOSCAP C_depletionTotal: "+c_d_t);
	return c_d_t;
	}
	
//PN diode

//constant
var V_th = 0.025; //mv

//PN diode main function
function Execute_pnd(){
	//get values from user's input
	var p_po = eval(document.getElementById("pnd_NaCon").value);
	var n_no = eval(document.getElementById("pnd_NdCon").value);
	var V_d = eval(document.getElementById("pnd_V_d").value);
	var pnd_Wn = eval(document.getElementById("pnd_Wn").value);
	pnd_Wn = microm_cm(pnd_Wn);
	var pnd_Wp = eval(document.getElementById("pnd_Wp").value);
	pnd_Wp = microm_cm(pnd_Wp);
	var pnd_Area = eval(document.getElementById("pnd_A").value);
	var pnd_Dp = eval(document.getElementById("pnd_diff_p").value);
	var pnd_Dn = eval(document.getElementById("pnd_diff_n").value);
	var tau_p = eval(document.getElementById("tau_p").value);
	var tau_n = eval(document.getElementById("tau_n").value);
	n_po = Math.pow(ni,2)/p_po;
	p_no = Math.pow(ni,2)/n_no;
	console.log("Na: "+p_po+" Nd: "+n_no+" V_d: "+V_d);
	var pn = LoJ_pn(p_no,V_d);
	var np = LoJ_np(n_po,V_d);
	var pnd_phi_b = Pnd_phi_b(p_po,p_no);
	console.log("phi_b: "+pnd_phi_b);
	// carrier life time
	var lp = pnd_L(pnd_Dp,tau_p);
	var ln = pnd_L(pnd_Dn,tau_n);
	console.log("Lp= "+lp+" Ln= "+ln);
	
	var pnd_type;
	if (pnd_Wp < lp){
		pnd_type = 0; //short chnnel 
		console.log("Short channel diode");
		}
	else if (pnd_Wp > lp){
		pnd_type = 1; //long channel
		console.log("Long channel diode");
		}
	
	var I_d;
	var I0;
	// short channel 
	if (pnd_type == "0"){ 
	  var I_0_s = Pnd_I0_s(n_no,pnd_Wn,p_po,pnd_Wp,pnd_Area,pnd_Dp,pnd_Dn);
	  I0 = I_0_s;
	  I_d = Pnd_Id(I_0_s,V_d);
		}
	// long channel
	else if(pnd_type == "1"){
	  var I_0_l = Pnd_I0_l(pnd_Area,pnd_Dn,n_po,ln,pnd_Dp,p_no,lp);
	  var I0 = I_0_l;
	  I_d = Pnd_Id(I_0_l,V_d);
		}
	console.log("Id= "+I_d);
	
	//depletion width
	var xp = X_po(pnd_phi_b,p_po,n_no);
	var xn = X_no(pnd_phi_b,p_po,n_no);
	var xd = X_d(pnd_phi_b,p_po,n_no);
	if (V_d != 0){
		xp = Pnd_xd_bias(xp,V_d,pnd_phi_b);
		xn = Pnd_xd_bias(xn,V_d,pnd_phi_b);
		xd = Pnd_xd_bias(xd,V_d,pnd_phi_b);
		}
	//capacitance without bias
	var cap_j0 = Pnd_cap_j0(pnd_Area,p_po,n_no,pnd_phi_b);
	//capacitance with bias
	var phi_b_bias = pnd_phi_b - V_d;
	var cap_j;
	if (V_d > 0){
		var cap_fb = Pnd_cj_FB(cap_j0);
		cap_j = cap_fb;
	}
	else if (V_d <0){
		var cap_rb = Pnd_cj_RB(cap_j0,V_d,pnd_phi_b);
		cap_j = cap_rb;
	}
	
	
	//diffusion capacitance
	var cap_diff = Pnd_cap_diff(pnd_Area,pnd_Wp,xp,n_po,pnd_Wn,xn,p_no,V_d);
	//small signal conductance
	var g_d = Pnd_g_d(I_d);
	var transitTime = Pnd_transitTime(cap_diff,g_d,pnd_Wn,pnd_Dp);
	var transitTimeSingleSided = Pnd_transitTime(0,0,pnd_Wn,pnd_Dp);
	
	//display
	var display_Potential = document.getElementById("pnd_output_Potential");
	var display_DepRegion_p = document.getElementById("pnd_output_depletionRegion_p");
	var display_DepRegion_n = document.getElementById("pnd_output_depletionRegion_n");
	var display_DepRegion_d = document.getElementById("pnd_output_depletionRegion_d");
	var display_Lp = document.getElementById("pnd_output_Lp");
	var display_Ln = document.getElementById("pnd_output_Ln");
	var display_cj0 = document.getElementById("pnd_output_cj0");
	var display_cj = document.getElementById("pnd_output_cjb");
	var display_cd = document.getElementById("pnd_output_cd");
	var display_I0 = document.getElementById("pnd_output_I0");
	var display_Id = document.getElementById("pnd_output_Id");
	var display_gd = document.getElementById("pnd_output_gd");
	var display_transitTime = document.getElementById("pnd_output_transitTime");
	
	
	display_Potential.value = (pnd_phi_b.toFixed(2));
	display_DepRegion_p.value = (xp.toExponential(3));
	display_DepRegion_n.value = (xn.toExponential(3));
	display_DepRegion_d.value = (xd.toExponential(3));
	display_Lp.value= (lp.toExponential(3));
	display_Ln.value= (ln.toExponential(3));
	display_cj0.value=(cap_j0.toExponential(3));
	if (cap_j !=null){
		display_cj.value=(cap_j.toExponential(3));
	}
	display_cd.value=(cap_diff.toExponential(3));
	display_I0.value=(I0.toExponential(3));
	display_Id.value=(I_d.toExponential(3));
	display_gd.value=(g_d.toExponential(3));
	display_transitTime.value = (transitTime.toExponential(3));
	}

//law of the junction
function LoJ_pn(p_no,V_d){
	var pn = p_no*Math.pow(Math.E,(V_d/V_th));
	console.log("pn: "+pn);
	return pn;
	}
function LoJ_np(n_po,V_d){
	var np = n_po*Math.pow(Math.E,(V_d/V_th));
	console.log("np: "+np);
	return np;
	}
function Pnd_phi_b(p_po,p_no){
	var pnd_phi_b = 0.06*Math.log10(p_po/p_no);
	return pnd_phi_b;
	}
function Pnd_I0_s(Nd,Wn,Na,Wp,A,Dp,Dn){
	var a = Dp/(Nd*Wn);
	var b = Dn/(Na*Wp);
	var i0 = q*Math.pow(ni,2)*A*(a+b);
	console.log("I0= "+i0);
	return i0;
	}
function pnd_L(Diff,tau){
	var l = Math.sqrt(Diff*tau);
	return l;
	}
function Pnd_I0_l(A,Dn,n_po,Ln,Dp,p_no,Lp){
	var a = (Dn*n_po)/Ln;
	var b = (Dp*p_no)/Lp;
	var i0 = q*A*(a+b);
	console.log("I0= "+i0);
	return i0;
	}
function Pnd_Id(I0,V_d){
	var I_d = I0*(Math.pow(Math.E,V_d/V_th)-1);
	return I_d;
	}
function Pnd_cap(C_j,C_d){
	var cap_diode = C_j+C_d;
	console.log("Capacitance_diode: "+cap_diode);
	return cap_diode;
	}
function Pnd_cap_j0(A,NaCon,NdCon,phi_b){
	var a = q*epsilon_s*NaCon*NdCon;
	var b = 2*(Number(NaCon)+Number(NdCon))*phi_b;
	var cj0= A*Math.sqrt(a/b);
	console.log("cj0: "+cj0);
	return cj0;
	}
function Pnd_cj_RB(cj0,V_d,phi_b){
	var a = V_d/phi_b;
	var cj_rb = cj0/(Math.sqrt(1-a));
	console.log("cj_reverse bias: "+cj_rb);
	return cj_rb;
	}
function Pnd_cj_FB(cj0){
	var cj_fb = cj0*Math.sqrt(2);
	console.log("cj_forward bias: "+cj_fb);
	return cj_fb;
	}
function Pnd_cap_diff(A,Wp,Xp,n_po,Wn,Xn,p_no,V_d){
	var a = (Wp - Xp)*n_po;
	var b = (Wn - Xn)*p_no;
	var c = q*A/2*V_th;
	var c_d = c*(a+b)*Math.pow(Math.E,V_d/V_th);
	console.log("diffusion capacitance: "+c_d);
	return c_d;
	}
function Pnd_g_d(Id){
	var gd = Id/V_th;
	console.log("g_d: "+gd);
	return gd;
	}
function Pnd_xd_bias(num,V_d,phi_b){
	num = num*Math.sqrt(1-(V_d/phi_b));
	return num;
	}
function Pnd_transitTime(cap_diff,g_d,pnd_Wn,pnd_Dp){
	var transitTime;
	if(g_d!=0){
	var tau = (cap_diff/g_d);
	transitTime = tau;
	}
	else{
	var tau = (Math.pow(pnd_Wn,2)/(2*pnd_Dp));
	transitTime = tau;
	}
	console.log("transit Time: "+transitTime);
	return transitTime;
	}

//MOSFET
//main
function Execute_MOSFET(){
	var MosfetType=document.querySelector('input[name="MosfetType"]:checked').value;
	var c_ox = eval(document.getElementById("MOSFET_cox").value);
	var mosfet_mob = document.getElementById("MOSFET_mu").value;
	var V_gs = document.getElementById("MOSFET_V_gs").value;
	var V_t = document.getElementById("MOSFET_V_t").value;
	var V_ds = document.getElementById("MOSFET_V_ds").value;
	var lambda = document.getElementById("MOSFET_lambda").value;
	var mosfet_w = document.getElementById("MOSFET_W").value;
	var mosfet_l = document.getElementById("MOSFET_L").value;
	
	var Mosfet_Id;
	var Mosfet_go;
	var RegionOfOperation;
	if (MosfetType == "PMOS"){
			if (V_gs>V_t){
			RegionOfOperation = "Cut off";
			Mosfet_Id = 0;
			Mosfet_go = 0;
			}			  
		else if (V_gs < V_t && V_ds > V_gs+V_t){
			RegionOfOperation = "Linear";
			Mosfet_Id = PMOSFET_I_d_lin(mosfet_w,mosfet_l,c_ox,mosfet_mob,V_gs,V_t,V_ds,lambda);
			Mosfet_go = MOSFET_go(lambda, Mosfet_Id);
			}
		else if (V_gs < V_t && V_ds < V_gs+V_t){
			RegionOfOperation = "Saturation";
			Mosfet_Id = PMOSFET_I_d_sat(mosfet_w,mosfet_l,c_ox,mosfet_mob,V_gs,V_t,V_ds,lambda);
			Mosfet_go = MOSFET_go(lambda, Mosfet_Id);
			}
		else{
			console.log("MOSFET: Something is wrong with the value");
			}
		}
	else if (MosfetType == "NMOS"){
		if (V_gs<V_t){
			RegionOfOperation = "Cut off";
			Mosfet_Id = 0;
			Mosfet_go = 0;
			}			  
		else if (V_gs > V_t && V_ds < V_gs-V_t){
			RegionOfOperation = "Linear";
			Mosfet_Id = NMOSFET_I_d_lin(mosfet_w,mosfet_l,c_ox,mosfet_mob,V_gs,V_t,V_ds,lambda);
			Mosfet_go = MOSFET_go(lambda, Mosfet_Id);
			}
		else if (V_gs > V_t && V_ds > V_gs-V_t){
			RegionOfOperation = "Saturation";
			Mosfet_Id = NMOSFET_I_d_sat(mosfet_w,mosfet_l,c_ox,mosfet_mob,V_gs,V_t,V_ds,lambda);
			Mosfet_go = MOSFET_go(lambda, Mosfet_Id);
			}
		else{
			console.log("MOSFET: Something is wrong with the value");
			}
		}
	
	//display
	var display_rop = document.getElementById("MOSFET_output_ROP");
	var display_Id = document.getElementById("MOSFET_output_Id");
	var display_go = document.getElementById("MOSFET_output_go");
	
	
	display_rop.value = RegionOfOperation;
	display_Id.value = Mosfet_Id.toExponential(3);
	display_go.value = Mosfet_go.toExponential(3);
	}

function NMOSFET_I_d_lin(W,L,c_ox,mu_n,V_gs,V_tn,V_ds,lambda_n){
	var a = W/L;
	var I_d_lin = a*c_ox*mu_n*(V_gs-V_tn-V_ds/2)*V_ds*(1+lambda_n*V_ds);
	console.log("NMOSFET Id_linear: "+I_d_lin);
	return I_d_lin;
	}
function NMOSFET_I_d_sat(W,L,c_ox,mu_n,V_gs,V_tn,V_ds,lambda_n){
	var a = W/2*L;
	var I_d_sat = a*c_ox*mu_n*Math.pow((V_gs-V_tn),2)*(1+lambda_n*V_ds);
	console.log("NMOSFET Id_saturation: "+I_d_sat);
	return I_d_sat;
	}
function PMOSFET_I_d_lin(W,L,c_ox,mu_p,V_sg,V_tp,V_sd,lambda_p){
	var a = W/L;
	var I_d_lin = a*c_ox*mu_p*(V_sg-V_tp-V_sd/2)*V_sd*(1+lambda_p*V_sd);
	console.log("PMOSFET Id_linear: "+I_d_lin);
	return I_d_lin;
	}
function PMOSFET_I_d_sat(W,L,c_ox,mu_p,V_sg,V_tp,V_sd,lambda_p){
	var a = W/2*L;
	var I_d_sat = a*c_ox*mu_p*Math.pow((V_sg+V_tp),2)*(1+lambda_p*V_sd);
	console.log("PMOSFET Id_saturation: "+I_d_sat);
	return I_d_sat;
	}
function MOSFET_lambda_n(L){
	var lambdan= 0.1 / L;
	return lambdan;
	}
function MOSFET_lambda_p(L){
	var lambdap= 0.1 / L;
	return lambdap;
	}
function MOSFET_go(lambda,Id){
	var mosfet_go = lambda*Id;
	console.log("output conductace: "+mosfet_go);
	return mosfet_go;
	}
	
// JavaScript Document