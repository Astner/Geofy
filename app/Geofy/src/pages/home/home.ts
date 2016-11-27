import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { SQLite ,GoogleMap, GoogleMapsEvent, GoogleMapsLatLng} from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';


interface spotify{
	limit:number;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

	 map:GoogleMap;
	 data:number;
     res:spotify;
     dataBase: SQLite;
     latitude:any;
     longitude:any;
     currentTrackId:string;
     comment:string;

  constructor(public navCtrl: NavController,public platform:Platform, public http:Http) {
  	platform.ready().then(()=> {
  		this.connectToDatabase();
  			})
  		
		       
  }

 onSuccess = (position)=> {
    
        this.saveLatAndLong(position.coords.latitude,position.coords.longitude);

    };

    // onError Callback receives a PositionError object
    //
    onError =(error) => {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

     saveLatAndLong = (lat,long)=>{
        alert("in on success" );

    	   this.latitude =  lat;
        this.longitude = 	 long;

    }
  hitMeOnClick =()=>{
  	navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
  	this.currentTrackId = "4PjcfyZZVE10TFd9EKA72r";
  	this.comment = "success";
  }

  connectToDatabase=()=>{
  	this.dataBase = new SQLite();
            this.dataBase.openDatabase({
                name: "data.db",
                location: "default"
            }).then(() => {
                this.dataBase.executeSql("DROP TABLE IF EXISTS TRACKS", {})
                this.dataBase.executeSql("CREATE TABLE IF NOT EXISTS TRACKS (track_id TEXT, lat TEXT, long TEXT, comment TEXT)", {})
                .then((data) => {
                    alert("TABLE CREATED: "+ data);
                }, (error) => {
                    alert("Unable to execute sql"+ error);
                })
            }, (error) => {
                alert("Unable to open database"+ error);
            });
  }


  saveToDatabase=()=>{
	    this.dataBase.openDatabase({
	        name: "data.db",
	        location: "default"
	    }).then(() => {
        alert("in saving" );

	        this.dataBase.executeSql('INSERT INTO TRACKS (track_id , lat , long , comment) VALUES (?,?,?,?);',[this.currentTrackId,this.latitude,this.longitude,
	        	this.comment])
	        .then((data) => {
	            alert("data saved: "+ data);
	        }, (error) => {
	            alert("Unable to execute sql"+ error.code);
	        })
	    }, (error) => {
	        alert("Unable to open database"+ error);
	    });
  }

  getAllToDatabase=()=>{
	    this.dataBase.openDatabase({
	        name: "data.db",
	        location: "default"
	    }).then(() => {
	        this.dataBase.executeSql("SELECT * FROM TRACKS", {})
	        .then((results) => {
	        	for (var i=0; i<results.rows.length; i++) 
                   { 
                       alert("data stored: "+ results.rows.item(i)['track_id'] + '\n'+
										results.rows.item(i)['lat'] + '\n'+
										results.rows.item(i)['long'] + '\n'+
										results.rows.item(i)['comment'] + '\n'
	            	);
                   } 

	            
	        }, (error) => {
	            alert("Unable to execute sql"+ error);
	        })
	    }, (error) => {
	        alert("Unable to open database"+ error);
	    });
  }
  getSongFromSpotify =(songID)=>{
  	//var url ='https://api.spotify.com/v1/search?q=tania%20bowra&type=track';
  	var url ='https://api.spotify.com/v1/traks/4PjcfyZZVE10TFd9EKA72r'; // this needs authentication

        var response = this.http.get(url).map(res => res.json()).subscribe(data =>{
        	alert(<string>data.tracks.limit);
        });
  }
}
