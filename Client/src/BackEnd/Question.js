export default class Question {
  question;
  questionID;
  niveau;
  language;
  responses = [];
  gotCorrect = false;
  chosenResponse = -1;
  code;

  // params = {question, questionId, niveau, language, responses, code}
  constructor(params) {
    this.question = params.question;
    this.questionID = params.questionId;
    this.niveau = params.niveau;
    this.language = params.language;
    this.responses = params.responses;
    this.code = params.code
  }

  setGotCorrect(gotCorrect) {
    this.gotCorrect = gotCorrect;
  }

  setChosenResponse(indexOfAnswer) {
    this.chosenResponse = indexOfAnswer;
  }
}
