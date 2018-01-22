/**
 * PageController
 *
 * @description :: Server-side logic for managing Pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    nextQuestion: function (req, res) {

        if (!req.session.user) {
            return res.redirect('/');
        } else if (req.session.authenticated !== true) {
            return res.redirect('/')
        } else {

            var index = req.param('id');

            index = parseInt(index);

            var fs = require('fs');
            var validateFile = (__dirname + '/object.json')

            fs.readFile(validateFile, function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    const questionIndex = index - 1;

                    const JSON_DATA = JSON.parse(data);

                    if (JSON_DATA.questions.length <= questionIndex || questionIndex < 0) {
                        res.view('/');
                    } else {
                        BsiQuiz.checkUser({
                            user_id: req.session.user
                        }, function (err, user) {

                            if (err) { sails.log.error(err) } else {

                                var lastpage = parseInt(user[0].lastPage);

                                if (lastpage < index) {

                                    BsiQuiz.saveLastPage({
                                        user_id: user[0].id,
                                        lastPage: index
                                    }, function (err, user) {
                                        if (err) {
                                            sails.log.error(err)

                                        } else {

                                            res.view('bsiQuiz/question_1', { data: JSON_DATA.questions[questionIndex], questionLength: JSON_DATA.questions.length });
                                        }
                                    })

                                } else {

                                    var lastPageFromUser = lastpage - 1;

                                    res.view('bsiQuiz/question_1', { data: JSON_DATA.questions[lastPageFromUser], questionLength: JSON_DATA.questions.length });

                                }
                            }
                        });
                    }
                }
            })
        }
    },

    final: function (req, res) {

        var user_name = req.session.user

        if (!user_name) {
            return res.badRequest();

        } else {

            var fs = require('fs');
            var validateFile = (__dirname + '/object.json')

            fs.readFile(validateFile, function readFileCallback(err, data) {
                if (err) {
                    sails.log(err);
                } else {

                    var JSON_DATA = JSON.parse(data)

                    function calculateSumOfPoints(JSON_DATA) {

                        var sumOfMaxQuestionPoints = 0

                        for (i in JSON_DATA.questions) {

                            sumOfMaxQuestionPoints += JSON_DATA.questions[i].points.point
                        }

                        return sumOfMaxQuestionPoints

                    }

                    const getsumOfMaxPoints = calculateSumOfPoints(JSON_DATA);

                    BsiQuiz.checkUser({
                        user_id: user_name
                    }, function (err, user) {

                        if (err) {
                            sails.log(err)
                        } else {

                            const nameOfUser = user[0].user_name
                            const idFromUser = user[0].id
                            const sumOfPoints = user[0].points
                            const lastPageFromUser = user[0].lastPage

                            function finalResult(getsumOfMaxPoints, sumOfPoints) {
                                var sum = (sumOfPoints / getsumOfMaxPoints) * 100

                                return sum;
                            }

                            var percent = finalResult(getsumOfMaxPoints, sumOfPoints)

                            if (percent > 75) {
                                var partial = 0;
                            } else {
                                var partial = 1;

                                BsiQuiz.saveUserRecord({
                                    user_id: idFromUser,
                                    points: -sumOfPoints
                                }, function (err, user) {
                                    if (err) {
                                        sails.log.error(err)
                                    } else {
                                        BsiQuiz.saveLastPage({
                                            user_id: idFromUser,
                                            lastPage: 0
                                        }, function (err, user) {
                                            if (err) {
                                                sails.log.error(err)

                                            } else {

                                                return;
                                            }
                                        })
                                    }
                                })
                            }

                            function date() {
                                var date = new Date();
                                var day = date.getDate();
                                var year = date.getFullYear();
                                var month = date.getMonth();
                                month++;

                                var currentDay = (day + "." + month + "." + year)

                                return currentDay;
                            }

                            var currentDay = date();

                            res.view('bsiQuiz/final', { user: nameOfUser, points: sumOfPoints, percent: percent, sumOfMaxQuestionPoints: getsumOfMaxPoints, getTheRightPartial: partial, currentDay: currentDay })
                        }
                    })
                }
            })
        }
    },

    certificate: function (req, res) {

        var user_id = req.session.user

        BsiQuiz.checkUser({
            user_id: user_id
        }, function (err, user) {
            if (err) {
                sails.log.error(err)
            } else {

                const user_name = user[0].user_name;

                function date() {
                    var date = new Date();
                    var day = date.getDate();
                    var year = date.getFullYear();
                    var month = date.getMonth();
                    month++;

                    var currentDay = (day + "." + month + "." + year)

                    return currentDay;
                }

                var currentDay = date();

                res.view('bsiQuiz/certificate', { user_name: user_name, currentDay: currentDay });

            }
        })
    }
};

