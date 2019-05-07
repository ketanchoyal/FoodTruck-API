import mongoose from 'mongoose';
import { Router } from 'express';
import Foodtruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';


export default({ config, db}) => {
    let api = Router();

    //CRUD - Create Read Update Delete

    // '/v1/foodtruck' - Read (GET all food trucks)
    api.get('/', (req, res) => {
        Foodtruck.find({}, (err, foodtrucks) => {
            if (err) {
                res.send(err);
            }
            res.json(foodtrucks);
        });
    });

    // '/v1/foodtruck/:id' GET Specific food truck
    api.get('/:id', (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if (err) {
                res.send(err);
            }
            res.json(foodtruck);
        });
    });

    // '/v1/foodtruck/add' -POST add a food truck
    api.post('/add', authenticate, (req, res) => {
        let newFoodtruck = new Foodtruck();
        newFoodtruck.name = req.body.name;
        newFoodtruck.foodtype = req.body.foodtype;
        newFoodtruck.avgcost = req.body.avgcost;
        newFoodtruck.geometry.coordinates = req.body.geometry.coordinates;

        // newFoodtruck.save()
        // .then(data => {
        //     res.json({ message: 'Foodtruck saved successfully' });
        // }).catch(err => {
        //     res.status(500).send({
        //         message: err.message || "Some error occured"
        //     });
        // });

        newFoodtruck.save(err => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Foodtruck saved successfully' });
        });
    });  

    // '/v1/foodtruck/:id' -Delete
    api.delete('/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {

            if (err) {
                res.status(500).send(err);
                return;
            }
            if (foodtruck === null) {
                res.status(404).send("Food truck not found");
                return;
            }
            Foodtruck.remove({
                _id: req.params.id
            },(err, foodtruck) => {
                if (err) {
                res.status(500).send(err);
                return;
                }
                res.json({ message : "Foodtruck and Reviews successfully Removed!"});
                // res.json({ foodtruck : foodtruck.reviews });
            });
            Review.remove({
                foodtruck: req.params.id
            },(err, review) => {
                if (err) {
                    res.send(err);
                }
            });
        });
    });

    // 'v1/foodtruck:id' -Update
    api.put('/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if (err) {
                res.send(err);
            }
            foodtruck.name = req.body.name;
            foodtruck.foodtype = req.body.foodtype;
            foodtruck.avgcost = req.body.avgcost;
            foodtruck.geometry.coordinates = req.body.geometry.coordinates;

            foodtruck.save(err => {
                if (err) {
                res.status(500).send(err);
                return;
                }
                res.json({message : 'Foodtruck info updated'});
            });
        });
    })

    // add review for a specific foodtruck ID
    // 'v1/foodtruck/reviews/add/:id
    api.post('/reviews/add/:id', authenticate, (req, res) => {
        Foodtruck.findById(req.params.id, (err, foodtruck) => {
            if (err) {
                res.send(err);
            }
            let newReview = new Review();

            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.foodtruck = foodtruck._id;

            newReview.save((err, review) => {
                if (err) {
                    res.send(err);
                }
                foodtruck.reviews.push(review);
                foodtruck.save((err) => {
                    if(err) {
                        res.send(err);
                    }
                    res.json({ message : 'Foodtruck review saved!' });
                });
            });
        });
    });

    // '/v1/foodtruck/reviews/:id' GET reviews for specific truck
    api.get('/reviews/:id', (req, res) => {
        Review.find(req.params.id, (err, reviews) => {
            if (err) {
                res.send(err);
            }
            res.json(reviews);
        });
    });

    return api;
}