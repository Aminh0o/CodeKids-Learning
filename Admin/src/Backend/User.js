export default class User {
  nom;
  prenom;
  email;
  id;
  dateNaissance;
  languagePrefere;
  banned = false;

  constructor(params) {
    this.email = params.email;
    this.nom = params.nom;
    this.prenom = params.prenom;
    this.id = params.id;
    this.dateNaissance = params.dateNaissance;
    this.languagePrefere = params.languagePrefere;
    this.banned = params.banned || false;
  }
}
