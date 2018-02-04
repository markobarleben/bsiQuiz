[![Version](https://img.shields.io/badge/Version-0.8-green.svg)]()
[![Crates.io](https://img.shields.io/crates/l/rustc-serialize.svg?style=plastic)]()
[![npm](https://img.shields.io/npm/v/npm.svg?style=plastic)]()
[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=bsiquiz.herokuapp.com&style=plastic)](https://bsiQuiz.herokuapp.com)

# bsiQuiz

![bsiQuiz](https://github.com/markobarleben/bsiQuiz/blob/master/bsiQuiz.gif)

# Description 
bsiQuiz is a student project. Goal of this project was to develop a survey software especially for Civil servants and employees of public administration. </br>

Works only in Safari or Chrome (Desktop)


# How it works
After sucessefully answer the security survey finaly the user get a certificate. 

# Setup

## object.json

All what you need to do is to fill out the object.json. You find this file here: */api/controllers/* 

        {
            "questionId": 1,
            "facts": " Just imagine you fly with your x-Wing in a group of Tie-Fighters.  "
            text_question: { Is that a bad or good idea?},
            "text_answer": {
                "answer": [
                    "bad idea",
                    "good idea"
                ]
            },
            "answer_reason": {
                "reason": [
                    "You're right! A Jedi acts calmly!",
                    "Your answer is unfortunately wrong!"
                ]
            },
            "answerId": {
                "id": [
                    0
                ]
            },
            "points": {
                "point": 1
            }
        },

## homepage.ejs

You can design your own start page. You find the homepage.ejs here: /views/homepage.ejs

## certificate.ejs

A certificate is a good proof to show other people your great knowledge about the Jedis. That is the reason why the User gets a certificate after succesfully answer all questions. You find the certificate.ejs here: /views/bsiQuiz/certificate.ejs

## Styles

Maybe you want change the color or the font size. All the information can you find in the layout.ejs file. You found layout.ejs here: /views/layout.ejs
 
[![Twitter_follow](https://img.shields.io/twitter/url/https/twitter.com/fold_left.svg?style=social&label)](https://twitter.com/mabarleb)

