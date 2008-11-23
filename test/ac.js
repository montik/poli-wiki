//todo manca una utility che crei l'albero xml
//da mandare al formatto
var ar = new AjaxRequest();
var u = new Util();

var acds = {

	
			socket: ar;
			tools: u;
			dsCats: new Array("http://mtotaro.web.cs.unibo.it/xml/catalogo_ds.xml",
					  "http://ltw0807.web.cs.unibo.it/ds/catalog.xml",
					  "http://ltw0802.web.cs.unibo.it/DS/catalogo.xml")
			ds: new Array();
			
			init: function(){	
			
				for(var key in dsCats){

					this.socket.get(
					'url': sdCats[key];
					'onSuccess': function(this.socket){ 
						var domDoc = xml2dom(this.socket.responseXML);//fixme .. 
						//ocho all'import()
						var name = this.tools.getStr(domDoc, "./globale/nome");
						var qury = this.tools.getStr(domDoc, "./accesso/queryURI");
						var sury = this.tools.getStr(domDoc, "./accesso/salvaURI");

								
						//riempio i campi del key-esimo oggettino DS	
						this.ds.push(new DS(name));
						this.ds[key].setQury(qury);
						this.ds[key].setSury(suri);}) 	//todo si potrebbe aggiungere onError
								      		// o qualche altra finezza					
									      } //fine del foreach
							} //fine della init


			
			//ritorna un array di dom .. non piu' alberone response
			// .. andra' maneggiato da qualche altra parte.
			query: function(qform){var qstring = this.socket.serializeForm(qform);

								
					var arrayResp = new Array();


					       for(var key in ds){
							
							//attenzione alla simultaneita' delle richieste.
							//potrebbe essere necessario dereferenziare l'oggetto
							//interno socket.req
							this.socket.get(
								
								{
									'url': this.ds[key].queryUri + qstring; //FIXME 
									
									
									//prende ogni responseXML da ogni query e lo infila
									//nell' array arrayResp.
									'onSuccess': function(){
											
											arrayResp.push(socket.responseXML);
										
												
			
											}
										}
									   ) //fine oggetto parametro della GET
									} // fine del foreach
				
					}  //fine della query()  
			

			//salva schedaXml, che e' una stringa xml, sul data source ds
			salva: function(schedaXml, dove){ 
			
				var encoded = escape(encodeURIcomponent(scheda, ds));
				var uri = this.ds[dove].salvaURI;

				//costruzione dell'oggetto da passare alla post
				var par = {
						'uri': uri;
						'onError': function(){alert("salvataggio non riuscito");}
						'scheda': encoded;	}
						
				this.socket.post(par);
			
			
			
			}

} //fine acds

var acdf = {

		
		socket: ar;
		tools: u;

		dfref: new Array(
					"http://ltw0807.web.cs.unibo.it/df/xhtml/catalog.xml",	
					"http://ltw0807.web.cs.unibo.it/df/pdf/catalog.xml",
					"http://ltw0802.web.cs.unibo.it/DF/catalogo.xml");
		
		
		
		
		


		// risma di oggettini DF
		df: new Array();


		init: function(){
		
					for(key in dfref){
					
							//parametro per la get()
							var par = {

									'uri': dfref[key]
									'onSuccess': function(){
										
										var respDom = socket.responseXML //forse socket.req.responseXML
										var nome = tools.getStr(respDom, "./global/@name");
										var llay = tools.getStr(respDom, "./global/@list-layout")
										var frmtDoc = tools.getStr(respDom, "./format/@document-URI");
										var frmtFra = tools.getStr(respDom, "./format/@fragment-URI");
									
										var dfist = new DS(nome);	
										dfist.setLayoUri(llay);
										dfist.setDformUri(frmtDoc);
										dfist.setFformUri(frmtFra);
										
										df.push(dfist);
									
									
									
									} //fine dichiarazione funzione onSuccess
							
									
							
							
							
							
							} // fine oggetto da passare alla get
					
					
					
					socket.get(par);

					} //fine for per ogni df
		
		
		// aggiorna lista layout skin
		for(var key in ds) update(key);
		
		
		} // fine init

		// funzione che aggiorna la lista dei layout di un df, TODO chiamare anche in fase di init
		update: function(dfname){


				var layUpdateUri = df[dfname].layoutUri; //url da querare per ricevere elenco layouts/skin

				var parobj = {
				
				
							
							'uri': layUpdateUri;

							//setta la lista di skins e la lista di layouts
							//del DF dfname
							'onSuccess': function(){
									
									//lista di layout
				var laydomlist = document.evaluate("./elenco_layout/layout", socket.responseXML, null, XPathResult.ANY_TYPE, null);
				var skidomlist = document.evaluate("./elenco_layout/skin", socket.responseXML, null, XPathResult.ANY_TYPE, null); 
							
							
							
							
				//creo due array, uno con lista layout, l'ltro skin
				//layout
				var layList = new Array();
				for(var i=0; i<=laydomlist.length; i++){
				
					var str = tools.getStr(laydomlist.iterateNext(), "./@id"); //il primo parametro e' il nodo contesto
					layList.push(str);
				
				}
				
				
				//skin
				var skiList = new Array();
				for(var i=0; i<=skidomlist.length; i++){
				
					var str = tools.getStr(skidomlist.iterateNext(), "./@id"); //il primo parametro e' il nodo contesto
					skiList.push(str);
				
				}
							
							
				//infine aggiungo le due liste all'oggetto DF in questione
				df[dfname].setSkin(skiList);
				df[dfname].setLayout(layList);

							} //fine function onSuccess			
				
				
				
				} // fine costruzione oggetto parametro

			socket.get(parobj);
		
		
		} //fine dichiarazione metodo update

		
		//formatta documento intero, vuole l'xml gia pronto e il nome del df
		formatFrag(frag, df){
		
		var uri = this.df[df].fformUri;
		var xml = escape(encodeURIcomponent(frag));

		//creo il parametro per la post()
		var parobj = {
		
			'uri': uri;
			'dati': xml;
			'onError': function(){alert("gestiscilo anche nelle altre richieste .. .onError!!!")}}
			'onSuccess': function(){alert("modificare dom della pagina");}

		socket.post(parobj);

		}


		formatDoc(doc, df){
		
		var uri = this.df[df].dformUri;
		var xml = escape(encodeURIcomponent(doc));

		//creo il parametro per la post()
		var parobj = {
		
			'uri': uri;
			'dati': xml;
			'onError': function(){alert("gestiscilo anche nelle altre richieste .. .onError!!!")}}
			'onSuccess': function(){alert("modifica dom visualizzazione finale")}
		socket.post(parobj);

		}
		
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
		}

		
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

