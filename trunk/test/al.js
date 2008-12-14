var doc = document.implementation.createDocument();

function piuCriteri(node){
var inner = '<input type="text" name="wcreator" />autore del work<br />
<input type="text" name="wtitle" />titolo work<br />
<input type="text" name="wdate" />data work<br />
<input type="text" name="ecreator" />autore expression<br />
<input type="text" name="edate" />data expression<br />

<div>
<input type="text" name="folksonomia" />folksonomia
</div>
<button onclik="repliMe()">+</button><br />

<input type="text" name="edescription" />nella descrizione<br />
<button onclick="divToForm(this)">Cerca</button>';

node.innerHTML = inner;
}

function previousNonTextSibling(nodo){
	if(nodo.nodeType != 3) return nodo;
	return previousNonTextSibling(nodo.previousSibling);
	}
	
	
	
//replica cio' che lo precede	
function repliMe(myThis){
	var myForm = myThis.parentNode; //
	var toclone = previousNonTextSibling(myThis.previousSibling).cloneNode(true);
	var LF = document.createElement("br");
	myForm.insertBefore(toclone, myThis);}	
	

function getHome(){
var obi = 
{'url': document.location + "home.xml", 
'onSuccess':function(rec){

var appendi = rec.responseXML.documentElement;
var layout = randLay(DFCORR);
var skin = randSkin(DFCORR, layout);
var tronco = acdf.assem(layout, skin);
compose(tronco, "formatta/dati", new Array(appendi)); //qui ho il dom della home da mandare al formatto
var xml = serializza(tronco);
acdf.formatDoc(xml, DFCORR, homeHandl)}; //TODO homeHandl da definire. Deve rimpiazzare l'attuale body.
AjaxRequest.get(obi);}
