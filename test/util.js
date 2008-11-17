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
	function compose(contextNode, xpathExpr, nodeList, sub)
	{
		debugger;
		
		var srad = document.evaluate(xpathExpr, contextNode, null, XPathResult.ANY_TYPE, null); //sotto-radice, ev.nte da sostituire


		if(sub){ //caso di sostituzione
			
			if(nodeList.length != 1){
			
				dump("impossibile sostituire un nodo con 2 o piu");
				return null;
				
				
				}
			var newNode = nodeList[0];
			var padreSrad = srad.parentNode; //fixme caso in cui srad=rad(tutto)
			    padreSrad.replaceChild(newNode, srad); //aggiungere debug

		
		}

		else{ //nota: i figli vengono appesi in coda

			for(var i=0; i<nodeList.lentgh; i++){
			
				var figlio = nodeList[i];
				srad.appendChild(figlio);
				alert("appeso");				
				
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
	var H3 = document.createElement('h3');
	H3.textContent = "sei scemo";
	debugger;
	var harry = new Array();
	harry[0] = "H3";
	debugger;
	uu.compose(document.body, "./small", harry, false);


//	uu.setStr(document.body, "./p[1]", "Siamo un gruppo di fighi");

//var xxx = uu.getStr(document, "//head/meta/@content");	
				}


	
	window.onload = main;












