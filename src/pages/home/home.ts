import { Component , ChangeDetectorRef} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';
import { IotProvider }  from '../../providers/iot/iot'
import { Observable } from 'rxjs'
// import {evothings} from 'cordova-plugin-eddystone'
declare var evothings: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  distance: any;
  rssi: any;
  tx: any;
  beaconInfo: any;
  distanceS: any;
  count = 0;
  bottom='5%'
  show_cf: boolean;
  show_hm: boolean;
  found_once = false;
  shown_once = false;

  constructor(public navCtrl: NavController, public iot: IotProvider, public platform: Platform,public changeRef: ChangeDetectorRef ) {

  }

  ionViewDidEnter() {
    // Only called once on first enter.
    // Not called on navigation back from second page.
    // Observable.interval(500).subscribe(x => {
      
    //   this.count++;
    // })
    this.startScan();
    Observable.interval(2000).subscribe( () =>{
      console.log('Requesting')
      this.iot.updateDistance(this.distance).subscribe((response) => {
        console.log(response)
      }, err => console.error(err));
      this.iot.updateMap(this.distance).subscribe();
    })

  }

  setBottom(val:number){
    // Expects val to be between 0 and 100
    let perc=  5.0 + val*95;
    if(perc>95){
      perc=95;
    }
    this.bottom = perc +'%';
  }

  startDistanceQuery() {
    //Calculate distance 
    // this.distanceS =  Observable.interval(1000).subscribe(() => {
    //   var distance = evothings.eddystone.calculateAccuracy(
    //     this.beaconInfo.txPower, this.beaconInfo.rssi);
    //       this.distance = parseFloat(distance)*10;
    //       if (isNaN(this.distance)) {
    //         this.distance = 0.8568657456 + "  Metres";
    //       }
    //       else{
    //         this.distance = this.distance + "  Metres";
    //       }
    //       this.count++;


    //       // setTimeout(() => {
    //       //   this.change.detectChanges();
    //       // },2000);
    //       console.log("distance: ",distance);
    // });
    var distance = evothings.eddystone.calculateAccuracy(
      this.beaconInfo.txPower, this.beaconInfo.rssi);
    this.distance = parseFloat(distance) * 10;

    // let subscribable = this.iot.updateDistance(this.distance);
    // if(subscribable!=null){
    //   subscribable.subscribe(res => {
    //     console.log('subscription res ' + res)
    //   });
    // }
    // if (isNaN(this.distance)) {
    //   this.distance = 0.8568657456 + "  Metres";
    // }
    // else {
    //   this.distance = this.distance + "  Metres";
    // }
    this.count = this.count+1;


    // setTimeout(() => {
    //   this.change.detectChanges();
    // },2000);
    this.rssi = -this.beaconInfo.rssi;
    this.tx = this.beaconInfo.txPower;
    console.log("distance: ", this.rssi);
    // console.log("distance: ", this.count);
    if(this.distance>=0.6){
      // this.show_hm =;
      setTimeout(()=> {
        this.show_cf=true
        if(!this.shown_once){
          this.iot.registerBannerShowedEvent().subscribe();
          this.shown_once = true;
      }
      },1000
      );
       
      // this.show_cf =true;
    }
    // if (this.rssi>=80){
    //   this.show_hm =false;
    //   this.show_cf =true;
    // } else {
    //   this.show_hm =false;
    //   this.show_cf =false;
    // }
    // this.setBottom((this.rssi-55)/(90-40))
    this.setBottom((this.distance)/(0.5))
    this.changeRef.detectChanges();

  }

  startScan() {
    this.platform.ready().then(() => {
      evothings.eddystone.startScan((beaconInfo) => {
        console.log(beaconInfo);
        const fayyas = "AwOq/hUWqv4Av/GqcqaOE4h7+ItVQgdXlCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
        const saffar = "AwOq/hUWqv4Ayc8I9gzKOeDGT70AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
        
        if (beaconInfo.scanRecord === fayyas) {
          this.beaconInfo = beaconInfo;
          if(!this.found_once){
            this.iot.registerEntryEvent().subscribe();
            this.found_once = true;
          }
          this.startDistanceQuery();
        } else {
          // console.log(beaconInfo)
        }

        // evothings.eddystone.stopScan();
      })

    });
  }

}
