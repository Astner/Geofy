import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { SQLite ,GoogleMap, GoogleMapsEvent, GoogleMapsLatLng} from 'ionic-native';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

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

  constructor(public navCtrl: NavController,public platform:Platform, public http:Http) {
        //this.setupGoogleMap()

        var url ='https://api.spotify.com/v1/search?q=tania%20bowra&type=track';
        var response = this.http.get(url).map(res => res.json()).subscribe(data =>{
        	alert(<string>data.tracks.limit);
        });

        
        //this.res = JSON.parse(this.data);

       
  }

 onSuccess(position) {
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

  onClick(){
  	//navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);

  	let db = new SQLite();
            db.openDatabase({
                name: "data.db",
                location: "default"
            }).then(() => {
                db.executeSql("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)", {}).then((data) => {
                    alert("TABLE CREATED: "+ data);
                }, (error) => {
                    alert("Unable to execute sql"+ error);
                })
            }, (error) => {
                alert("Unable to open database"+ error);
            });
  }

  setupGoogleMap(){
  	let location = new GoogleMapsLatLng(-34.9290,138.6010);
  	alert("inside");

    this.map = new GoogleMap('map', {
          'backgroundColor': 'green',
          'controls': {
            'compass': true,
            'myLocationButton': true,
            'indoorPicker': true,
            'zoom': true
          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            'latLng': location,
            'tilt': 30,
            'zoom': 15,
            'bearing': 50
          }
        });
 
        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            alert('Map is ready!');


        });
        this.map.on(GoogleMapsEvent.CAMERA_IDLE).subscribe(() => {
            alert('Map is idle!');


        });

  }

}
