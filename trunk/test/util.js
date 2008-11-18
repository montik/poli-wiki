/*function main1(){

var req = new XMLHttpRequest();
req.onreadystatechange = function(){

	if(req.state == 4) {var u = new Util();
			    var xmldoc = req.textXML;
			    alert(xmldoc);
			    }


}
req.open('GET', 'http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml', 'true');
req.send(null);




}*/

/* classe che rappresenta l'oggetto DS
 * eliminando tutte le informazioni non
 * necessarie tenendo solo nome,
 * queryURI e salvaURI
 */

	function DS(n){

		this.nome = n;
		this.queryUri;
		this.salvaUri;

		//this.setNome = function(s){this.nome = s;}
		this.setQuri = function(s){this.queryUri = s;}
		this.setSuri = function(s){this.salvaUri = s;}
}


/*miniclasse che rappresenta una coppia layout-skin
 * con skin non obbligatorio*/

	function LaySkin(n){
	this.layout = n;
	this.setSkin(s){this.skin = s;}
	
	}


/* classe che rappresenta l'oggetto DF,
 * considera: nome, list-layout (da querare SEMPRE),
 * dformat che memorizza l'uri per la formattazione di
 * documenti interi,
 * fformat che memorizza l'url per la formattazione
 * di FRAMMENTI di docuento,
 * stuff che memorizza un oggettino LaySkin.*/

	function DF(n){

		this.nome = n;
		this.layoutUri;
		this.dformUri;
		this.fformUri;
		this.stuff;

		this.setLayoUri(s){this.layoutUri = s;}
		this.setDformUri(s){this.dformUri = s;}
		this.setFformUri(s){this.fformUri = s;}
		this.setStuff(s){this.stuff = s;}

}	






/* TODO test di FIRST_ORDRED_NODE_TYPE
 * Questa classe fornisce metodi generici
 * per la manipolazione di DOM, nonche'
 * getter e setter di stringhe, sempre su DOM.
 *
 */


/* Attacca (in testa? in coda?) una NodeList ad un nodo di un albero dato,
 * indirizzato con XPath, eventualmente con sostituzione della (sotto-)radice
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
		
		var srad = document.evaluate(xpathExpr, contextNode, null, XPathResult.ANY_TYPE, null).iterateNext(); //sotto-radice, ev.nte da sostituire


		if(sub){ //caso di sostituzione
			
			if(listaNodi.length != 1){
			
				dump("impossibile sostituire un nodo con 2 o piu");
				return null;
				
				
				}
			var newNode = listaNodi[0];
			var padreSrad = srad.parentNode; //fixme caso in cui srad=rad(tutto)
			var rplcd = padreSrad.replaceChild(newNode, srad); //aggiungere debug

		
		}

		else{ //nota: i figli vengono appesi in coda

			for(var i=0; i<listaNodi.length; i++){
			
				var figlio = listaNodi[i];
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
		var regex = /^string/;
		
		if(!regex.exec(xpathExpr)){ //la stringa non e' canonica
		var newxp = "string(" + xpathExpr + ")";
			}
		
		else var newxp = xpathExpr;
		alert(newxp);
		var str = document.evaluate(newxp, contextNode, null, XPathResult.SRING_TYPE, null);
		return str.stringValue;


	
	
	
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


//		var node = document.evaluate(xpathExpr, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		var node = document.evaluate(xpathExpr, contextNode, null, XPathResult.ANY_TYPE, null);

		node.iterateNext().textContent = newVal;




	}

	/* da chiamare con l'operatore new */
	function Util(){
		
		this.setStr = setStr;
		this.getStr = getStr;
		this.compose = compose;	
	}


	
	function main(){

	var uu = new Util();
	var H3 = document.createElement('h4');
	var p0 = document.createElement('p');
	p0.textContent = "questo e p zero";

	var p1 = document.createElement('p');
	p1.textContent = "questo e p uno";

	H3.appendChild(p0);
	H3.appendChild(p1);
	var harry = new Array();
	harry[0] = H3;
	uu.compose(document.body, ".", harry, false);


//	uu.setStr(document.body, "./p[1]", "Siamo un gruppo di fighi");

//var xxx = uu.getStr(document, "//head/meta/@content");	
				}


	
	window.onload = main;
