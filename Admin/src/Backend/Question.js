export default class Question {
  question;
  questionID;
  niveau;
  language;
  responses = [];
  code;

  // params = {question, questionId, niveau, language, responses}
  constructor(params) {
    this.question = params.question;
    this.questionID = params.questionId;
    this.niveau = params.niveau;
    this.language = params.language;
    this.responses = params.responses;
    this.code = params.code;
  }
}
