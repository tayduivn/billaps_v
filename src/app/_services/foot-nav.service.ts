import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FootNavService {
  public pageCible:string='factures';
  public ttocr:any;
  constructor() { }

}
