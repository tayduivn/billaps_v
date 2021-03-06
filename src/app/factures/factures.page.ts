import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FacturesService} from "../_services/factures.service";
import {Facture} from "../_model/facture";
import {AlertController, LoadingController, PopoverController} from '@ionic/angular';
import {PopoverFacturesComponent} from '../_components/popover-factures/popover-factures.component';
import {FacturesArbreYear} from '../_model/facturesArbre';
import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {AuthentificationService} from '../_services/authentification.service';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.page.html',
  styleUrls: ['./factures.page.scss'],
})
export class FacturesPage implements OnInit {
  //on crée la liste de factures
  public factures:Array<Facture>;
  //on crée la liste des factures en arbres
  public facturesArbre:Array<FacturesArbreYear>=[];
  //variable pour fermer tous les accordéon
  //Si false, alors quand on clique sur un autre accordéon, les autres reste ouverts
  //si true, quand on clique su un accordéon, les autres se ferment
  automaticClose = false;
  //on affiche open si l'accordéon est ouvert
  open:boolean;

  constructor(private router:Router,
              private alertCtrl:AlertController,
              public authService:AuthentificationService,
              public facturesService:FacturesService,
              public loadingController: LoadingController,
              public popoverController: PopoverController) {

    //l'accordéon est fermé à la création de la page
    this.open=false;
  }

  ngOnInit() {
  }

  //cette méthode se lance à chaque ouverture de l'écran, on récupère donc toute les factures
  async ionViewWillEnter(){
    //on regarde si on doit reset les factures lorsque l'on se login
    if(this.authService.resetFactures){
      this.authService.resetFactures=false;
      this.facturesService.factures= await null;
      this.facturesService.facturesArbre=await null;
    }

    //on récupère les valeurs du services
    this.factures=this.facturesService.factures;
    this.facturesArbre=this.facturesService.facturesArbre;
    //on vérifie que les dates de mises a jour entre telephone et firebase sont ok
    // on peut pas faire ca car sinon on ferait des appel tout le temps a firebase, trop couteux
    //il faudra gérer ca avec les notif, quand tu change de telephone, une notif est envoyé à l'ancien qui le déconnecte
    /*if(this.facturesService.isDateDifferent()){
      this.onGetFactures();
    }*/
    //on vérifie ques les factures sont vident avant de lancer le chargement si besoin ou si on doit reset les factures
    if((this.factures==null)||((this.factures!=null)&&(this.factures.length==0))){
      this.onGetFactures();
    }
  }

  async onGetFactures() {
    //on met un loader
    const loading = await this.loadingController.create({
      //spinner: null,
      message: 'Chargement',
      translucent: true,
    });
    loading.present();
    //on charge les données de factures
    await this.facturesService.getFactures().then(async data=>{
      this.factures=await data;
      //on récupère l'arbre du service
      this.facturesArbre=await this.facturesService.facturesArbre;
    });

    loading.dismiss();
  }

  onNewFacture() {
    //on affecte la variable du type de la page newFacture
    this.facturesService.typeNewFacture='add';
    this.router.navigateByUrl('facture-new');
  }

  onDetailFacture(facture:Facture) {
    //on stocke la facture sélectionné
    this.facturesService.currentFacture=facture;
    //on va vers le détail de la facture
    this.router.navigateByUrl('facture-detail');
  }

  delete(facture:Facture) {
    //on demande la confirmation de l'utilisateur
    let alert = this.alertCtrl.create({
      message: 'Etes-vous sûr de vouloir supprimer cette facture?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            let index=this.factures.indexOf(facture);
            this.factures.splice(index,1);
            //on met à jour les factures dans l'application
            this.facturesService.updateFactures(this.factures);
            //on supprime la facture du back-end
            this.facturesService.deleteFacture(facture);
          }
        },
        {
          text: 'Non',
          handler: () => {
          }
        }
      ]
    }).then(alert=>alert.present());


  }

  //Affichage des options dans factures
  async presentPopover(event){
    const popover = await this.popoverController.create({
      component :PopoverFacturesComponent,
      event:event,
      translucent: true
    });

    // il faut mettre à jour les facture dans la page pour voir la modification
    popover.onDidDismiss().then(async (data)=>{
      //loading.present();
      this.factures=this.facturesService.factures;
      // on alimente ou pas la variable arbre
      if(this.facturesService.typeAffichage=='arbre'){
        this.facturesArbre=this.facturesService.facturesArbre;
      } else {
        this.facturesArbre=null;
      }
    });

    return await popover.present();

  }



  //Accordeon sur l'année
  toggleSection(index){
    //on change l'ouverture de l'année
    this.facturesArbre[index].open = !this.facturesArbre[index].open;

    //Ca ferme tous les autres accordéon
    if(this.automaticClose && this.facturesArbre[index].open){
      this.facturesArbre
          .filter((item, itemIndex) => itemIndex != index)
          .map(item => item.open = false);

    }

    //on met à jour l'accordéon
    this.open=this.checkOpen();
  }

  //accordéon sur le mois
  toggleItem(index,childIndex){
    this.facturesArbre[index].liste[childIndex].open = !this.facturesArbre[index].liste[childIndex].open;

    //on met à jour l'accordéon
    this.open=this.checkOpen();
  }

  //permet de fermer tous les accordéons
  closeToggle(){
    //on réinitialise toutes les valeurs
    this.open=false;
    this.facturesArbre.forEach(function(fYear) {
      fYear.liste.forEach(function(fMonth) {
        fMonth.open=false;
      });
      fYear.open=false;
    });
  }

  //Cette méthode permet de vérifier si l'accordéon est ouvert à un endroit
  private checkOpen() {
    var open=false;
    // on vérifie s'il y a encore quelque chose d'ouvert dans l'accordéon
    for(var i=0;i<this.facturesArbre.length;i++){
      if(this.facturesArbre[i].open){
        open=true;
        return true;
      }
      for(var j=0;j<this.facturesArbre[i].liste.length;j++){
        if(this.facturesArbre[i].liste[j].open){
          open=true;
          return true;
        }
      }
    }
    // si tout est faux, on retourne open
    return open;
  }
}
