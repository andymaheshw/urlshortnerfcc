import express from 'express';
import mongoose from 'mongoose';

const app = express();
const mongo = require('mongodb').MongoClient;
const url = process.env.MONGODB;
let counter = 2;
exports.app = app;



app.get('/:endpoint(\\d+)?', (req, res) => {
	console.log("wrong entry");
    const endpoint = req.params.endpoint;
    console.log("endpoint")
    if (endpoint) {
        if (endpoint % 1 === 0) {
            mongo.connect(url + "", function(err, db) {
                if (err) console.log(err)
                var redirect = db.collection('redirect');
                redirect.find({
                    endpoint: parseInt(endpoint)
                }).toArray(function(err, docs) {
                    db.close();
                    if (!docs.length) {
                        res.end("nothing found at that endpoint");
                    } else {
                        let address = docs[0].url;
                        res.redirect(docs[0].url)
                    }
                })


            });
        } else {
            console.log("endpoint", endpoint);
            res.end("must be integer");
        }

    } else {
        res.status(200).send({
            "hi": "bye"
        });
    }
});



app.get('/new/*', (req, res) => {
    const website = req.params[0];
    console.log("entered", website);
    if (website) {
    	console.log("website", website);
    	if (!website.includes("http"))
                {
                	res.end("wrong address");
                }
        mongo.connect(url + "", function(err, db) {
            if (err) throw err
            var redirect = db.collection('redirect')
            redirect.find({
                'url': website
            }).toArray(function(err, docs) {
                if (err) throw err
                let doc = {
                    url: website,
                    endpoint: counter
                };
                if (!docs.length) { //not found
                    redirect.insert(doc, function(err, data) {
                    	console.log("insert")
                        if (err) throw err
                        db.close();
                        res.send(JSON.stringify(doc));
                        counter += 1;
                    })
                } else { //found
                	console.log("what is happenin here")
                    db.close();
                    res.redirect(docs[0].url);
                }

            })
        });
    } else {
        res.end("provide address")
    }
});