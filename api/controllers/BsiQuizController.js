/**
 * BsiQuizController
 *
 * @description :: Server-side logic for managing bsiquizs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    // handle user input from start page 
    userInput: function (req, res) {

        var username = req.body.username;

        BsiQuiz.createUser({
            user_name: username,
            points: 0
        }, function (err, user) {

            if (err) { return res.ok() };

            req.session.user = user.user_name

            res.ok(req.session);
        })
    },

    validateAnswer: function (req, res) {

        var user_name = req.session.user

        var answer = req.body

        if (!user_name) {

            res.status(401);
            res.send();

        } else if (answer.questionId === 'final') {

            return res.send(answer)

        } else {

            BsiQuiz.checkUser({

                user_name: user_name

            }, function (err, user) {

                if (err) { sails.log.error(err) } else {

                    var fs = require('fs');
                    var validateFile = (__dirname + '/object.json')
                    fs.readFile(validateFile, function readFileCallback(err, data) {
                        if (err) {
                            sails.log(err);
                        } else {

                            const JSON_DATA = JSON.parse(data)

                            for (i in JSON_DATA.questions) {

                                if (JSON_DATA.questions[i].questionId == answer.questionId) {

                                var answerReasonFromJsonObject = JSON_DATA.questions[i].answer_reason.reason;

                                    const seroPoints = 0;
                                    const falseAnswer = answerReasonFromJsonObject[0];
                                    const fallbackResponse = [falseAnswer, answer.questionId, seroPoints, JSON_DATA.questions.length]

                                    if (!answer.answerid || JSON_DATA.questions[i].answerId.id.length != answer.answerid.length) {
                                        return res.send(fallbackResponse);
                                    } else {

                                        var answerID = JSON_DATA.questions[i].answerId.id

                                        var answerId_Int = answer.answerid.map(Number);
                                        answerId_Int.sort(function (a, b) {
                                            return a - b;
                                        });

                                        function diff(answerID, answerId_Int) {

                                            for (y in answerID) {

                                                if (answerId_Int.indexOf(answerID[y]) === -1) {

                                                    return false;
                                                }

                                                return true;
                                            }
                                        };

                                        var compareAnswersFromUserAndJsonObject = diff(answerID, answerId_Int);

                                        function calculateSumOfPoints(JSON_DATA) {

                                            var sumOfMaxQuestionPoints = 0

                                            for (x in JSON_DATA.questions) {

                                                sumOfMaxQuestionPoints += JSON_DATA.questions[x].points.point
                                            }

                                            return sumOfMaxQuestionPoints

                                        }

                                        const getsumOfMaxPoints = calculateSumOfPoints(JSON_DATA)

                                        if (compareAnswersFromUserAndJsonObject === false) {

                                            var responseFalse = [answerReasonFromJsonObject[0], answer.questionId, seroPoints, JSON_DATA.questions.length, getsumOfMaxPoints]

                                            return res.send(responseFalse);

                                        } else {

                                            const points = JSON_DATA.questions[i].points.point

                                            BsiQuiz.saveUserRecord({
                                                user_id: user[0].id,
                                                points: points
                                            }, function (err, user) {
                                                if (err) {
                                                    sails.log.error(err)

                                                } else {

                                                    var responseTrue = [answerReasonFromJsonObject[1], answer.questionId, points, JSON_DATA.questions.length, getsumOfMaxPoints]

                                                    return res.send(responseTrue)
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            })
        }
    },
};



