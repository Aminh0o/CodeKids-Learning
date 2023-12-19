export default class Avis {
  nom;
  email;
  message;
  sujet;
  id;

  constructor(params) {
    this.nom = params.nom;
    this.email = params.email;
    this.message = params.message;
    this.sujet = params.sujet;
    this.id = params.id;
  }
}
