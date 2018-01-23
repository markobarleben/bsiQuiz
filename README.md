# bsiQuiz v.0.7

![bsiQuiz](https://github.com/markobarleben/bsiQuiz/blob/master/bsiQuiz.gif)

# Description 
bsiQuiz is a student project. Goal of this project was to develop a survey software especially for Civil servants and employees of public administration.

# How it works
After sucessefully answer the security survey finaly the user get a certificate. 

# Setup

## object.json

All what you need to do is to fill out the object.json. You found this file here: */api/controllers/* 

        {
            "questionId": 1,
            "facts": " Just imagine you fly with your x-Wing in a group of Tie-Fighters.  "
            text_question: { Is that a bad or good idea?},
            "text_answer": {
                "answer": [
                    "bad",
                    "good"
                ]
            },
            "answer_reason": {
                "reason": [
                    "bad idea",
                    "good idea"
                ]
            },
            "answerId": {
                "id": [
                    1
                ]
            },
            "points": {
                "point": 1
            }
        },
        
 
# Hints
Works only in Safari or Chrome (Desktop)

