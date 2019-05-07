'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _foodtruck = require('../model/foodtruck');

var _foodtruck2 = _interopRequireDefault(_foodtruck);

var _review = require('../model/review');

var _review2 = _interopRequireDefault(_review);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //CRUD - Create Read Update Delete

    // '/v1/foodtruck' - Read (GET all food trucks)
    api.get('/', function (req, res) {
        _foodtruck2.default.find({}, function (err, foodtrucks) {
            if (err) {
                res.send(err);
            }
            res.json(foodtrucks);
        });
    });

    // '/v1/foodtruck/:id' GET Specific food truck
    api.get('/:id', function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(foodtruck);
        });
    });

    // '/v1/foodtruck/add' -POST add a food truck
    api.post('/add', _authMiddleware.authenticate, function (req, res) {
        var newFoodtruck = new _foodtruck2.default();
        newFoodtruck.name = req.body.name;
        newFoodtruck.foodtype = req.body.foodtype;
        newFoodtruck.avgcost = req.body.avgcost;
        newFoodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
        newFoodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

        // newFoodtruck.save()
        // .then(data => {
        //     res.json({ message: 'Foodtruck saved successfully' });
        // }).catch(err => {
        //     res.status(500).send({
        //         message: err.message || "Some error occured"
        //     });
        // });

        newFoodtruck.save(function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json({ message: 'Foodtruck saved successfully' });
        });
    });

    // '/v1/foodtruck/:id' -Delete
    api.delete('/:id', _authMiddleware.authenticate, function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {

            if (err) {
                res.status(500).send(err);
                return;
            }
            if (foodtruck === null) {
                res.status(404).send("Food truck not found");
                return;
            }
            _foodtruck2.default.remove({
                _id: req.params.id
            }, function (err, foodtruck) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json({ message: "Foodtruck and Reviews successfully Removed!" });
                // res.json({ foodtruck : foodtruck.reviews });
            });
            _review2.default.remove({
                foodtruck: req.params.id
            }, function (err, review) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
            });
        });
    });

    // 'v1/foodtruck:id' -Update
    api.put('/:id', _authMiddleware.authenticate, function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            foodtruck.name = req.body.name;
            foodtruck.foodtype = req.body.foodtype;
            foodtruck.avgcost = req.body.avgcost;
            foodtruck.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
            foodtruck.geometry.coordinates.long = req.body.geometry.coordinates.long;

            foodtruck.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json({ message: 'Foodtruck info updated' });
            });
        });
    });

    // add review for a specific foodtruck ID
    // 'v1/foodtruck/reviews/add/:id
    api.post('/reviews/add/:id', _authMiddleware.authenticate, function (req, res) {
        _foodtruck2.default.findById(req.params.id, function (err, foodtruck) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            var newReview = new _review2.default();

            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.foodtruck = foodtruck._id;

            newReview.save(function (err, review) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                foodtruck.reviews.push(review);
                foodtruck.save(function (err) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    res.json({ message: 'Foodtruck review saved!' });
                });
            });
        });
    });

    // '/v1/foodtruck/reviews/:id' GET reviews for specific truck
    api.get('/reviews/:id', function (req, res) {
        _review2.default.find(req.params.id, function (err, reviews) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(reviews);
        });
    });

    return api;
};
//# sourceMappingURL=foodtruck.js.map