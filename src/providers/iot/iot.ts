import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { tap} from 'rxjs/operators'


/*
  Generated class for the IotProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IotProvider {

  ready_request = true;
  count = 0;

  base_url = "http://navbuddy.iotsolutionbuilder.ooredoo.qa"
  httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic dXNlcjpBZG1pbi4xMjM=',
        Accept:'application/json',
        // 'Access-Control-Request-Method': 'POST',
        // 'Access-Control-Request-Headers': 'Content-Type',
        // 'Origin': 'http://localhost:8100',
      })
    };

  constructor(public http: HttpClient) {
    console.log('Hello IotProvider Provider');
  }

  updateDistance(val: Number) {
    const data ={
        "time": new Date().toISOString(),
        "source": {
            "id": "302"
        },
        "type": "c8y_Position",
        "c8y_Positions": {
            "T": {
                "value": val
            }
        }
    };
    console.log('requesting check')
    // if(this.ready_request){
    //   console.log('requesting')
    //   this.ready_request=false;
    //   this.count++;
   return this.http.post(this.base_url+'/measurement/measurements', data, this.httpOptions)
      // .pipe( tap(() => {
      //   this.ready_request = true
      //   this.count--;
      //   console.log('counter: ' + this.count)
      // }) )
    // }else {
    //   return null;
    // }
    }

    updateMap(val: any) {
      const data ={
            "time": new Date().toISOString(),
            "source": {
                "id": "302"
            },
            "type": "c8y_map_pos",
            "c8y_map_pos": {
                "T": {
                    "value": ((val/0.5)*(799-418))+418
                }
            }
        };
        console.log('requesting check')
        // if(this.ready_request){
        //   console.log('requesting')
        //   this.ready_request=false;
        //   this.count++;
      return this.http.post(this.base_url+'/measurement/measurements', data, this.httpOptions)
          // .pipe( tap(() => {
          //   this.ready_request = true
          //   this.count--;
          //   console.log('counter: ' + this.count)
          // }) )
        // }else {
        //   return null;
        // }
      }

  registerEntryEvent(){
    const data = {
      "source": {
          "id":"302" 
      },
        "type": "BeaconEvent",
        "text": "Found reference beacon 473",
        "time": new Date().toISOString(),
    };
    return this.http.post(this.base_url+'/event/events', data, this.httpOptions)
    
  }

  registerBannerShowedEvent(){
    // return this.http.post(this.base_url+'').map( res => {
    //   return true;
    // }).catch(error => {
    //   console.log(error);
    // });
    const data =  {
      "source": {
          "id":"302" 
      },
        "type": "BannerEvent",
        "text": "User was shown Carrefour banner",
        "time": new Date().toISOString(),
    };
    return this.http.post(this.base_url+'/event/events', data, this.httpOptions)
  }

}
