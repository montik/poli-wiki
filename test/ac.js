var ar = new AjaxRequest();
var u = new Util();

var acds = {

	
			socket: ar;
			tools: u;
			dsCats: new Array("http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml",
					  "http://ltw0807.web.cs.unibo.it/ds/catalog.xml",
					  "http://ltw0802.web.cs.unibo.it/DS/catalogo.xml")
			ds: new Array();
			xml2dom: function(xml) {var domDoc = document.implementation.createDocument("", "", null).load(xml);
						return domDoc;}
			init: function(){	
			

				for(var key in dsCats){

					this.socket.get(
					'url': sdCats[key];
'onSuccess': function(this.socket){ 
					var domDoc = xml2dom(this.socket.responseXML);
					//ocho all'import()
					var name = this.tools.getStr(domDoc, "./globale/nome");
					var qury = this.tools.getStr(domDoc, "./accesso/queryURI");
					var sury = this.tools.getStr(domDoc, "./accesso/salvaURI");

								
					//riempio i campi del key-esimo oggettino DS	
					this.ds.push(new DS());
					this.ds[key].setQury(qury);
					this.ds[key].setSury(suri);}) //todo si potrebbe aggiungere onError
								      // o qualche altra finezza					
								      }
					} //fine della init


			

			query: function(qform){var qstring = this.socket.serializeForm(qform);

								
					var respRad = document.createElement("response");


					       for(var key in ds){ //quero ogni ds e fondo tutto in un unico response
								
							this.socket.get(
								
								{
									'url': this.ds[key].queryUri + qstring; //FIXME 
									'onSuccess': function(){
										var alberino = this.xml2dom(this.socket.responseXML);
					//raccolgo l'insieme dei figli di response che sono tutti elementi di tipo
					//metadati, per poi fonderli in un unico albero response
					var metaList = document.evaluate("./*", alberino, null, XPathReult.ANY_TYPE, null);		
					this.tools.compose(respRad, ".", metaList); // respRad e' creato fuori dal loop
		
			
											}
										} ) 
									}
				
					}  //fine della query()  

			salva:

}

/*
 Data Sources:

 - http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml (Michele)
 - http://ltw0807.web.cs.unibo.it/ds/catalog.xml (Gruppo Cer+Ritucci, powerchiosco)
 - http://ltw0802.web.cs.unibo.it/DS/catalogo.xml (tilotta)

 ***************************************

 Data Formatters

 - http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml,
   http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml
 - http://ltw0802.web.cs.unibo.it/DF/catalogo.xml
 - mail a umezzogo@cs.unibo.it
 */

