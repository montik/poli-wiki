//todo manca una utility che crei l'albero xml
//da mandare al formatto
var array1 = new Array();
var proxy =  "http://stanisci.web.cs.unibo.it/cgi-bin/pps.php5?yws_path="; //attaccarci la query 
var acds = {
			

			hello: function(){alert("hello");},
			dsCats: new Array("http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml",
					  "http://ltw0807.web.cs.unibo.it/ds/catalog.xml",
					  "http://ltw0802.web.cs.unibo.it/DS/catalogo.xml"),
			ds: [],
			
			init: function(){	
		var c = new DS("xxx");	
		this.ds.push(c);
debugger;
				for(var key in this.dsCats){

				AjaxRequest.get(	
					{
					'url': proxy + this.dsCats[key],
					'onSuccess': function(req){ 
						//ocho all'import()
						var name = Util.getStr(req.responseXML, "/catalogo/globale/nome");
						var qury = Util.getStr(req.responseXML, "string(/catalogo/accesso/*[1])");
						// la stringa /catalogo/accesso/queryURI non funziona, forse a causa dell'upper case ??
						var sury = Util.getStr(req.responseXML, "/catalogo/accesso/*[2]");
						//riempio i campi del key-esimo oggettino DS
						var pippo = new DS(name);
debugger;
						this.ds.push(pippo);
						this.ds[name].setQury(qury);
						this.ds[name].setSury(suri);}
					}) 
							     } //fine del foreach
			}, //fine della init


			
			//ritorna un array di dom .. non piu' alberone response
			// .. andra' maneggiato da qualche altra parte.
			query: function(qform){var qstring = this.AjaxRequest.serializeForm(qform);

								
					var arrayResp = new Array();


					       for(var key in ds){
							
							//attenzione alla simultaneita' delle richieste.
							//potrebbe essere necessario dereferenziare l'oggetto
							//interno AjaxRequest.req
							this.AjaxRequest.get(
								
								{
									'url': this.ds[key].queryUri + qstring, //FIXME 
									
									
									//prende ogni responseXML da ogni query e lo infila
									//nell' array arrayResp.
									'onSuccess': function(){
											
											arrayResp.push(AjaxRequest.responseXML);
										
												
			
											}
										}
									   ) //fine oggetto parametro della GET
									
								} // fine del foreach
				
					},  //fine della query()  
			

			//salva schedaXml, che e' una stringa xml, sul data source ds
			salva: function(schedaXml, dove){ 
			
				var encoded = escape(encodeURIcomponent(scheda, ds));
				var uri = this.ds[dove].salvaURI;

				//costruzione dell'oggetto da passare alla post
				var par = {
						'uri': uri,
						'onError': function(){alert("salvataggio non riuscito");},
						'scheda': encoded
						
							}
						
				this.AjaxRequest.post(par);
			
			
			
			},

} //fine acds

var acdf = {

		
		dfref: new Array(
					"http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml",	
					"http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml",
					"http://ltw0802.web.cs.unibo.it/DF/catalogo.xml"),
		
		
		// risma di oggettini DF
		df: new Array(),


		init: function(){
		
					for(key in dfref){
					
							//parametro per la get()
							var par = {

									'uri': dfref[key],
									'onSuccess': function(){
										
										var respDom = AjaxRequest.responseXML //forse AjaxRequest.req.responseXML
										var nome = Util.getStr(respDom, "./global/@name");
										var llay = Util.getStr(respDom, "./global/@list-layout")
										var frmtDoc = Util.getStr(respDom, "./format/@document-URI");
										var frmtFra = Util.getStr(respDom, "./format/@fragment-URI");
									
										var dfist = new DS(nome);	
										dfist.setLayoUri(llay);
										dfist.setDformUri(frmtDoc);
										dfist.setFformUri(frmtFra);
										
										df.push(dfist);
									
									
									
									} //fine dichiarazione funzione onSuccess
							
									
							
							
							
							
							}; // fine oggetto da passare alla get
					
					
					
					AjaxRequest.get(par);

					} //fine for per ogni df
		
		
		// aggiorna lista layout skin
		for(var key in ds) update(key);
		
		
		}, // fine init

		// funzione che aggiorna la lista dei layout di un df, TODO chiamare anche in fase di init
		update: function(dfname){


				var layUpdateUri = df[dfname].layoutUri; //url da querare per ricevere elenco layouts/skin

				var parobj = {
				
				
							
							'uri': layUpdateUri,

							//setta la lista di skins e la lista di layouts
							//del DF dfname
							'onSuccess': function(){
									
									//lista di layout
				var laydomlist = document.evaluate("./elenco_layout/layout", AjaxRequest.responseXML, null, XPathResult.ANY_TYPE, null);
				var skidomlist = document.evaluate("./elenco_layout/skin", AjaxRequest.responseXML, null, XPathResult.ANY_TYPE, null); 
							
							
							
							
				//creo due array, uno con lista layout, l'ltro skin
				//layout
				var layList = new Array();
				for(var i=0; i<=laydomlist.length; i++){
				
					var str = Util.getStr(laydomlist.iterateNext(), "./@id"); //il primo parametro e' il nodo contesto
					layList.push(str);
				
				}
				
				
				//skin
				var skiList = new Array();
				for(var i=0; i<=skidomlist.length; i++){
				
					var str = Util.getStr(skidomlist.iterateNext(), "./@id"); //il primo parametro e' il nodo contesto
					skiList.push(str);
				
				}
							
							
				//infine aggiungo le due liste all'oggetto DF in questione
				df[dfname].setSkin(skiList);
				df[dfname].setLayout(layList);

							} //fine function onSuccess			
				
				
				
				}; // fine costruzione oggetto parametro

			AjaxRequest.get(parobj);
		
		
		},//fine dichiarazione metodo update

		
		//formatta documento intero, vuole l'xml gia pronto e il nome del df
		formatFrag: function(frag, df){
		
			var uri = this.df[df].fformUri;
			var xml = escape(encodeURIcomponent(frag));
	
			//creo il parametro per la post()
		var parobj = {
		
			'uri': uri,
			'dati': xml,
			'onError': function(){alert("gestiscilo anche nelle altre richieste .. .onError!!!");},
			'onSuccess': function(){alert("modificare dom della pagina");}
				
					};

		AjaxRequest.post(parobj);

		},


		formatDoc: function(doc, df){
		
			var uri = this.df[df].dformUri;
			var xml = escape(encodeURIcomponent(doc));
	
			//creo il parametro per la post()
			var parobj = {
			
				'uri': uri,
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
		},

		
//todo funzione che appende gli elementi che si vogliono formattare
//al nodo DATI dell'albero FORMATA precedentemente creato dalla funzione assem.



	} //fine oggetto


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

