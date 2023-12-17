export default class Question {
  question;
  questionID;
  niveau;
  language;
  responses = [];
  gotCorrect = false;

  // params = {question, questionId, niveau, language, responses}
  constructor(params) {
    this.question = params.question;
    this.questionID = params.questionId;
    this.niveau = params.niveau;
    this.language = params.language;
    this.responses = params.responses;
  }

  setGotCorrect(gotCorrect) {
    this.gotCorrect = gotCorrect;
  }
}
