/**
 * BsiQuizController
 *
 * @description :: Server-side logic for managing bsiquizs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    /**
     * handle user input from start page 
     */

    userInput: function (req, res) {

        var username = req.body.username;

        if(!username) {
           return res.ok('error');
        }

        BsiQuiz.createUser({
            user_name: username,
            points: 0
        }, function (err, user) {

            if (err) {
                 return sails.log.error(err);
            } else {

                req.session.user = user.id;
                req.session.authenticated = true;

            }

            res.ok(req.session);
        })
    },

    validateAnswer: function (req, res) {

        var user_name = req.session.user

        var answer = req.body

        if (!user_name) {

            res.status(401);
            res.send();

        } else {

            BsiQuiz.checkUser({

                user_id : user_name

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

                                /***********************************************************************
                                * responseFalseAnswer if user should not choose enough boxes 
                                ************************************************************************/

                                if (JSON_DATA.questions[i].questionId == answer.questionId) {

                                    var answerReasonFromJsonObject = JSON_DATA.questions[i].answer_reason.reason;

                                    /***********************************************************************
                                    * responseFalseAnswer if user should not choose enough boxes 
                                    ************************************************************************/

                                    const seroPoints = 0;
                                    const falseAnswer = answerReasonFromJsonObject[0];
                                    const responseFalseAnswer = [falseAnswer, answer.questionId, seroPoints, JSON_DATA.questions.length]

                                    /***********************************************************************
                                    * compare answer.lenght if not the right lenght user gets FALSE response 
                                    ************************************************************************/

                                    if (!answer.answerid || JSON_DATA.questions[i].answerId.id.length != answer.answerid.length) {
                                        return res.send(responseFalseAnswer);

                                    } else {

                                        var answerID = JSON_DATA.questions[i].answerId.id


                                        /****************************************
                                        * sort answer array from user / min to max
                                        *****************************************/
                                       
                                        var answerId_Int = answer.answerid.map(Number);

                                        answerId_Int.sort(function (a, b) {
                                            return a - b;
                                        });


                                        /*****************************************************
                                        * compare answerId in object.json with answer from user
                                        ******************************************************/
                                    
                                        function diff(answerID, answerId_Int) {

                                            for (y in answerID) {
                                                if (answerId_Int.indexOf(answerID[y]) === -1) {

                                                    return false;
                                                }
                                            }
                                        };

                                        var compareAnswersFromUserAndJsonObject = diff(answerID, answerId_Int);


                                        /****************************************
                                        * calculate maximum points in object.json 
                                        *****************************************/
                                      
                                        function calculateSumOfPoints(JSON_DATA) {

                                            var sumOfMaxQuestionPoints = 0

                                            for (x in JSON_DATA.questions) {

                                                sumOfMaxQuestionPoints += JSON_DATA.questions[x].points.point
                                            }

                                            return sumOfMaxQuestionPoints

                                        }

                                        const getsumOfMaxPoints = calculateSumOfPoints(JSON_DATA)


                                            /*********************************
                                             * response message to user FALSE 
                                             *********************************/

                                        if (compareAnswersFromUserAndJsonObject === false) {

                                            var responseFalse = [answerReasonFromJsonObject[0], answer.questionId, seroPoints, JSON_DATA.questions.length, getsumOfMaxPoints]

                                            return res.send(responseFalse);

                                            /*********************************
                                             * response message to user TRUE 
                                             *********************************/

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



