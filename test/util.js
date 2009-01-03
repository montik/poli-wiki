function serializza(node)
	{
	    if (typeof XMLSerializer != "undefined") 
		return new XMLSerializer().serializeToString(node);
	    else if (node.xml) return node.xml; 
	    else throw "errore nella serializzazione " + node; 
	};





/*
* classe che rappresenta l'oggetto DS
* eliminando tutte le informazioni non
* necessarie tenendo solo nome,
 * queryURI e salvaURI
 */

	function DS(n){

		this.nome = n;

		this.setQuri = function(s){this.queryUri = s;}
		this.setSuri = function(s){this.salvaUri = s;}
}


/*miniclasse che rappresenta una coppia layout-skin FIXME classe quasi deprecata!!!
 * con skin non obbligatorio

	function LaySkin(n){
	this.layout = n; //vale anche da nome
	
	this.setSkin = function(s) {this.skin = s;}
	
	}
*/


/* classe che rappresenta l'oggetto DF,
 * considera: nome, list-layout (da querare SEMPRE),
 * dformat che memorizza l'uri per la formattazione di
 * documenti interi,
 * fformat che memorizza l'url per la formattazione
 * di FRAMMENTI di docuento,
 * stuff che memorizza un oggettino LaySkin.DEPRECATO:w
 **/
	function DF(n){

		this.nome = n;
		
		/*this.layoutUri;
		this.dformUri;
		this.fformUri;
		this.stuff;*/
				
		this.setLayoUri = function(s) {this.layoutUri = s;} //uri dov'e' l'elenco dei layouts
		this.setDformUri = function(s) {this.dformUri = s;} //uri di richiesta formattazione documenti interi
		this.setFformUri = function(s) {this.fformUri = s;} //uri di richiesta formattazione frammenti
		this.setLayout = function(s) {this.layout = s;} //lista degli ULTIMI layout+skin implementati
		this.setPdata = function(s) {this.pdata = s;} // il nome della variabile in cui va incapsulato l'xml
								//nel post
		this.setSpec = function(s) {this.spec = s;} //array con nomi dei tag speciali supportati
}	






/* Attacca nodeList al nodo indirizzato con xpathExpr
 * eventualmente rimpiazzandolo, con sub=true.
 * 
 * SINTASSI: ??? compose(contextNode, xpathExpr, nodeList[, sub])
 *
 *	- contextNode: nodo contesto dal quale si risolve l'espressione xpath.
 *	- xpathExpr: indirizzo XPath del nodo (sotto-radice) al quale aggiungere figli.
 *	- nodeList: array (NON NodeList) di figli (tipo Element) da attaccare, eventualmente anche contenente un solo elemento
 *	- sub: se true il nodo sotto-radice viene sostituito dall'_UNICO_ nodo presente in nodeList
 *
 *	todo tipo di ritorno
 */
	function compose(contextNode, xpathExpr, listaNodi, sub)
	{
		function iter2arr(iter){
			var e = listaNodi.iterateNext();
			var a = new Array();			 

			while(e){

				a.push(e);
				e = listaNodi.iterateNext();}
			return a;}
	
		var listaNodi2; 	
		if(typeof(listaNodi.length) == "undefined") var listaNodi2 = iter2arr(listaNodi);
		else listaNodi2 = listaNodi; 



		var srad = contextNode.ownerDocument.evaluate(xpathExpr, contextNode, null, XPathResult.ANY_TYPE, null).iterateNext(); //sotto-radice, ev.nte da sostituire

		if(sub){ //caso di sostituzione
			
			if(listaNodi2.length != 1){
			
				alert("impossibile sostituire un nodo con 2 o piu");
				return null;
				}
			else{
			var newNode = listaNodi2[0];
			var padreSrad = srad.parentNode; //fixme caso in cui srad=rad(tutto)
			var rplcd = padreSrad.replaceChild(newNode, srad); //aggiungere debug
					}
		
		}

		else{

for(var i=0; i<listaNodi2.length; i++)
{
   var figlio = listaNodi2[i];
   srad.appendChild(figlio);
				}
			}

	}

/* Ritorna valori di tipo stringa associati all'elemento indirizzato
 * da una espressione XPath; evita di settare ogni volta il tipo di ritorno
 * nella document.eval(..), ovvero XPathResult.ANY_STRING.
 *
 * SINTASSI: String getVal(contextNode, xpathExpr)
 *
 * 	- contextNode: come sopra
 * 	- xpathExpr: stringa XPath che indirizza il nodo di cui si vuole il valore.
 * 		     Puo' essere specificata sia nel modo canonico per la
 * 		     restituizione di stringhe, es. string(xpath_addr) sia invece
 * 		     con solo l'indirizzo del nodo voluto, ossia solo xpath_addr.
 */
	function getStr(contextNode, xpathExpr) 
	{ 
	/*	var regex = /^string/;
		
		if(!regex.exec(xpathExpr)){ //la stringa non e' canonica
		var newxp = "string(" + xpathExpr + ")";
			}
		
		else*/ var newxp = xpathExpr;
		var str = document.evaluate(newxp, contextNode, null, XPathResult.ANY_TYPE, null);
		//var str = document.evaluate(newxp, contextNode, null, XPathResult.STRING_TYPE, null);
		var ciccio =  str.iterateNext().textContent;
		return ciccio;
	}


/* Setta valori di tipo stringa negli elementi indirizzati da una query XPath 
 *
 * SINTASSI: ?? setVal(contextNode, xpathExpr)
 *
 * 	- contextNode: come sopra
 * 	- xpathExpr: query XPath, calcolata da contexNode, del nodo voluto
 *	- newVal: il nuovo valore da settare
 */
	function setStr(contextNode, xpathExpr, newVal){


		var node = document.evaluate(xpathExpr, contextNode, null, XPathResult.ANY_TYPE, null);

		node.iterateNext().textContent = newVal;




	}

	/* da chiamare con l'operatore new */
	 var Util = {
		
		setStr: setStr,
		getStr: getStr,
		compose: compose	
					};


/*	
	function main(){

	var uu = new Util();
	var H3 = document.createElement('h4');
	var p0 = document.createElement('p');
	p0.textContent = "questo e p zero";

	var p1 = document.createElement('p');
	p1.textContent = "questo e p uno";

	//H3.appendChild(p0);
	//H3.appendChild(p1);

	var harry = new Array();
	harry.push(H3);
	harry.push(p0);
	uu.compose(document.body, ".", harry, true);
}*/
