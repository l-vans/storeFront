/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
var controller;

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
	controller = new StoreFront();

}

function StoreFront() {
	var selectedFile;
    var address_id;
	var store_id;
	var a;
	address_id = create_UUID();
	$("#address_id").val(address_id);
	store_id = create_UUID();
	$("#store_id").val(store_id);
	
	
	var usernameWarning = $('#usernameResult');
	
	document.getElementById("fileUpload").addEventListener("change", function(event) {
		selectedFile = event.target.files[0];
	});

	
	//iterate over each object (in resultant)
		//iterate over each key in each object
			//Object.keys(myObject)
	// for(var i = 0; i < json.length; i++) {
    // var obj = json[i];

    // console.log(obj.id);
	// }		
	$(function(){
		$("#uploadExcel").on("click", function() {
			var fileReader = new FileReader();
			fileReader.onload = function(event) {
			var data = event.target.result;
			var workbook = XLSX.read(data,{type:"binary"});
			console.log(workbook);
			workbook.SheetNames.forEach(sheet => {
				let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
				console.log(selectedFile);
				for (let x in rowObject) {
					for(let key in rowObject[x]){
						if(key.toLowerCase() !== key){
							rowObject[x][key.toLowerCase()] = rowObject[x][key];
							delete rowObject[x][key];
						}
					}	
				}
				for (let y in rowObject) {
					let product_id = create_UUID();
					let name = "";
					let description = "";
					let type = "";
					let model = "";
					let brand = "";
					let color = "";
					let model_number = "";
					let version = "";
					let price = "";
					for(let k in rowObject[y]){
						
						if(k.includes('name')){
							name = (rowObject[y][k]);
						}
						else if(k.includes('description')){
							description = (rowObject[y][k]);
						}
						else if(k.toLowerCase().includes('type')){
							type = (rowObject[y][k]);
						}
						else if(k.includes('model')){
							model = (rowObject[y][k]);
						}
						else if(k.includes('brand')){
							brand = (rowObject[y][k]);
						}
						else if(k.includes('color')){
							color = (rowObject[y][k]);
						}
						else if(k.includes('model_number')){
							model_number = (rowObject[y][k]);
						}						
						else if(k.includes('version')){
							version = (rowObject[y][k]);
						}
						else if(k.includes('price')){
							price = (rowObject[y][k]);
						}
						else {
							delete rowObject[y][k];
						}
					}
					let p = 
					{ 
						"product_id":product_id,
						"store_id":store_id,
						"name":name,
						"description":description,
						"type":type,
						"model":model,
						"brand":brand,
						"color":color,
						"model_number":model_number,
						"version":version,
						"price":price
					};
					let s = JSON.stringify(p);
					s = s.replace('+', ' ');
					$.ajax({
						type:"POST",					
						url:'http://localhost/php_rest_showp/api/product/create.php',
						data : s,
						ContentType:"application/json",
						success:function(){
							alert('successfully posted');
						},
						error:function(){
							alert('Could not be posted');
						}
					});
				}
				
			});
			};
			fileReader. readAsBinaryString(selectedFile);
		});
		
	});
	
	$(function(){
		$("#deets").on('click',function(e){
			e.preventDefault();
			console.log(document.getElementById('address_id').value);
			var ser = $('form').serialize();
			console.log(ser);
			function getSerVars(ser) {
				var hash;
				var myJson = {};
				var hashes = ser.slice(ser.indexOf('?') + 1).split('&');
				console.log(hashes);
				for (var i = 0; i < hashes.length; i++) {
					hash = hashes[i].split('=');
					myJson[hash[0]] = hash[1];
				}
				
				return JSON.stringify(myJson);
				
			}
			var test = getSerVars(ser);
			// test = test.replace('%20', ' ');
			console.log(test);
			
				$.ajax({
					type:"POST",					
					url:'http://localhost/php_rest_showp/api/store/uploadStore.php',
					data : test,
					ContentType:"application/json",
					success:function(){
						alert('successfully posted');
					},
					error:function(){
						alert('Could not be posted');
					}
			});
		});
	});
	
	$(function(){
		
		$("#store_name").on('click',function(e){
			e.preventDefault();
			var store_id = $("#store_id").val();
			var name = $("#name").val();
			let object = {"store_id":store_id,"address_id":address_id,"name":name};
			var s = JSON.stringify(object);
			$.ajax({
				type:"POST",					
				url:'http://localhost/php_rest_showp/api/storeName/uploadStoreName.php',
				data : s,
				ContentType:"application/json",
				success:function(){
					alert('successfully posted');
				},
				error:function(){
					alert('Could not be posted');
				}
			});
	
		});
	});
	
	
	function create_UUID(){
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (dt + Math.random()*16)%16 | 0;
			dt = Math.floor(dt/16);
			return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		});
		a_id = uuid;
		return a_id;
	}


	// $("#").click(function(){
		// $('#address_upload').prepend
	// });
	
	
}

