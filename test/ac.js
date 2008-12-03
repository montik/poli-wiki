var df = {}; 
var ds = {};

var acds = {
			

			hello: function(){alert("hello bello")},
			dsCats: new Array("catalogo.xml"),
				

			init: function(){	

				for(var key in this.dsCats){
	          
                 
                     var obi = {
					'url': this.dsCats[key],
					
					'onSuccess':	function(parametro){ 
						 
						
					
						var myNode = document.importNode(parametro.responseXML.documentElement, true);
				                var name = Util.getStr(myNode, ".//nome");

						var qury = Util.getStr(myNode, ".//accesso/*[position()=1]");
						var sury = Util.getStr(myNode, ".//accesso/*[2]");

						var pippo = new DS(name);
						pippo.setQuri(qury);	
						pippo.setSuri(sury);
						ds[name] = pippo;
			}
							
						}; //fine oggetto get
							
				AjaxRequest.get(obi);
					

							} //fine del foreach

						}, //fine della init


			query: function(qform){var qstring = AjaxRequest.serializeForm(qform);

								
					var arrayResp = new Array();

			
			for(var key in ds){
				
				var parobj = {'url': ds[key].queryUri + qstring, //FIXME 
					      'onSuccess': function(doc){arrayResp.push(doc.responseXML);}.bind(this)};			
						
						AjaxRequest.get(parobj);}
					return arrayResp;
					}, 
			

			salva: function(schedaXml, dove){ 
			
				var encoded = escape(encodeURIcomponent(scheda, ds));
				var uri = ds[dove].salvaURI;

				var par = {
						'url': uri,
						'onError': function(){alert("salvataggio non riuscito");},
						'scheda': encoded
									};
						
				AjaxRequest.post(par);}

}; //fine acds

var acdf = {

		
//		dfref: new Array(
//					"http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml",	
//					"http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml",
//					"http://ltw0802.web.cs.unibo.it/DF/catalogo.xml"),
		dfref: new Array("cata_df.xml"),		
		
		init: function(){
				for(key in this.dfref){
				//parametro per la get()
				var par = {
					'url': this.dfref[key],
					'onSuccess': function(parametro){
						var myNode = document.importNode(parametro.responseXML.documentElement, true);//todo provare con this
						var nome = Util.getStr(myNode, "./global/@name");
						var llay = Util.getStr(myNode, "./global/@list-layout")
						var frmtDoc = Util.getStr(myNode, "./format/@*[position()=1]");
						var frmtFra = Util.getStr(myNode, "./format/@*[position()=2]");
						var dfist = new DF(nome);	
						dfist.setLayoUri(llay);
						dfist.setDformUri(frmtDoc);
						dfist.setFformUri(frmtFra);
						df[nome] = dfist;
								} //fine dichiarazione funzione onSuccess
			}; // fine oggetto da passare alla get
					AjaxRequest.get(par);
					}//fine perOgni
	
			},//fine init().

		// funzione che aggiorna la lista dei layout di un df, TODO chiamare anche in fase di init
		update: function(dfname){
				var layUpdateUri = df[dfname].layoutUri; //url da querare per ricevere elenco layouts/skin
				var parobj = {		
							'url': layUpdateUri,
							//setta la lista di skins e la lista di layouts
							//del DF dfname
			
			'onSuccess': function(parametro){
					var myNode = document.importNode(parametro.responseXML.documentElement, true);
					var laydomlist = document.evaluate("layout", myNode, null, XPathResult.ANY_TYPE, null);

					//function proc(domlist){	
					var n = laydomlist.iterateNext();
					var outer = new Array(); //contiene la lista di tutti i ly relativi al DF
	
					while(n){	
						

						var layNome = Util.getStr(n, "./@id");
						if(n.getElementsByTagName("skin").length > 0){
						var skidomlist = document.evaluate("skin", n, null, XPathResult.ANY_TYPE, null); 
						var inner = new Array();
						s = skidomlist.iterateNext();
						while(s){
							
							var skiNome = Util.getStr(s, "./@id");
							inner.push(skiNome);
						s = skidomlist.iterateNext();
								}
						outer[layNome] = inner;
						alert(outer[layNome]);
						}
						else outer[laynome];
						n = laydomlist.iterateNext();}
						

						df[dfname].setLayout(outer);
							} //fine function onSuccess di update()			
				}; // fine costruzione oggetto parametro
			AjaxRequest.get(parobj);
						
	},//fine dichiarazione metodo update().


		




		//formatta documento intero, vuole l'xml gia pronto e il nome del df
		formatFrag: function(frag, df){
		
			var uri = df[df].fformUri;
			var xml = escape(encodeURIcomponent(frag));
	
			//creo il parametro per la post()
		var parobj = {
		
			'url': uri,
			'dati': xml,
			'onError': function(){alert("gestiscilo anche nelle altre richieste .. .onError!!!");},
			'onSuccess': function(){alert("modificare dom della pagina");}
				
					};

		AjaxRequest.post(parobj);

		},


		formatDoc: function(doc, df){
		
			var uri = df[df].dformUri;
			var xml = escape(encodeURIcomponent(doc));
	
			//creo il parametro per la post()
			var parobj = {
			
				'url': uri,
				'dati': xml,
				'onError': function(){alert("gestiscilo anche nelle altre richieste .. .onError!!!");},
				'onSuccess': function(){alert("modifica dom visualizzazione finale");}
				};

			AjaxRequest.post(parobj);
	
			},
		
		//funzione che costruisce l'intestazione dell'albero formatta.
		//prende layout ed opz. skin.Ritorna l'abero con l'elemento DATI
		//da completare con i/il documento desiderato

		assem: function(lay, skin){
		
				

				//costruzione della radice
				var formatta = document.createElement("formatta");
				var info = document.createElement("info");


				formatta.appendChild(info);

				//costruzione nodo layout al quale appendere il nodo
				//attributo ID
				var layout = document.createElement("layout");
				
				//setto il valore dell'attributo ID
				var id = document.createAttribute("id");
				id.nodeValue = lay;
				layout.appendChild(id);

				info.appendChild(layout);
				
				if(skin) {var skinnode = document.createElement("skin");
					  var id = document.createAttribute("id");
					  id.nodeValue = skin;
					  skinnode.appendChild(id);

					  info.appendChild(skinnode);
					  }
				//fine prima parte dell'albero
		
			var dati = document.createElement("dati");

			formatta.appendChild(dati);
			return formatta;
		}

		
//todo funzione che appende gli elementi che si vogliono formattare
//al nodo DATI dell'albero FORMATA precedentemente creato dalla funzione assem.



	}; //fine oggetto


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
