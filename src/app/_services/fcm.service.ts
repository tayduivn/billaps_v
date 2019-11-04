import { Injectable } from '@angular/core';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class FcmService {

  constructor(private firebase: FirebaseX,
              private afs: AngularFirestore,
              private platform: Platform) {}

  async getToken() {
    let token;

    //phone
    if(this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        token = await this.firebase.getToken();
      }

      if (this.platform.is('ios')) {
        token = await this.firebase.getToken();
        await this.firebase.grantPermission();
      }

      this.saveToken(token);
    } else {
      //Web
      //TODO : get token for angular web application
      //token = await this.firebase.getToken();
    }
  }

  private saveToken(token) {
    if (!token) return;

    const devicesRef = this.afs.collection('devices');

    const data = {
      token,
      userId: 'testUserId'
    };

    return devicesRef.doc(token).set(data);
  }

  onNotifications() {
    return this.firebase.onMessageReceived();
  }
}
