var mongoose = require('mongoose')
var User = mongoose.model('User')
var Mydoc = mongoose.model('Doc')
exports.index = function(req, res) {
    if (req.session.user) {
        res.render('index', {})
    } else {
        res.render('index', {})
    }
}
exports.edit = function(req, res) {
    User.findOne({
            _id: req.session.user._id
        })
        .populate("group.groupFile")
        .exec(function(err, exec_user) {
            // console.log(exec_user.group.groupFile)
            var treedata = new Array()
            exec_user.group.forEach(function(_group) {
                treedata.push({
                    label: _group.groupName,
                    children: _group.groupFile.map(function(obj) {
                        var child = new Object()
                        child.label = obj.originalName
                        child.docid = obj._id
                        return child
                    })
                })
            })
            res.render('edit', {
                userTreeData: JSON.stringify(treedata)
            })
        })
}
exports.extract = function(req, res) {
    Mydoc.findById(req.body.docid, function(err, doc) {
        if (err) {
            console.log(err)
        } else {
            
            var filter = req.body.filter
            var result = new Array()

            result = filter[0].keyword ? doc.Events.filter(function(events) {
                return events.CONTENT.indexOf(filter[0].keyword) > -1
            }):doc.Events;
            for (var i = 1; i < filter.length; i++) {
                if (filter[i].logic == "or") {
                    var temp_result = doc.Events.filter(function(events) {
                        return events.CONTENT.indexOf(filter[i].keyword) > -1
                            //merge result and temp_result
                        temp_result.forEach(function(item) {
                            if (result.indexOf(item) == -1) {
                                result.push(item)
                            }
                        })
                    })
                }
                if (filter[i].logic == "and") {
                    result = result.filter(function(events) {
                        return events.CONTENT.indexOf(filter[i].keyword) > -1
                    })
                }
                if (filter[i].logic == "not") {
                    result = result.filter(function(events) {
                        return events.CONTENT.indexOf(filter[i].keyword) == -1
                    })
                }
            }
            //105.40661;28.89428

            res.json(result)
        }
    })
}

exports.photos= function(req,res){
    res.setHeader("Access-Control-Allow-Origin","*"); 
    res.json([{
    "key": "RosavpwgPDeNW_d7ok1lsQ",
    "skey": "NQj03esO7swkvvOfw5MROw",
    "lat": 39.7426725,
    "lon": 119.7784573,
    "clat": null,
    "clon": null,
    "location": null,
    "ca": 246.359411239624,
    "cd": 5.0,
    "image_url": "https://d1cuyjsrcm0gby.cloudfront.net/RosavpwgPDeNW_d7ok1lsQ/",
    "map_image_versions": [{
        "name": "thumb-320",
        "filename": "thumb-320.jpg",
        "url": "http://127.0.0.1:3000/img/logo.png"
    }, {
        "name": "thumb-640",
        "filename": "thumb-640.jpg",
        "url": "http://127.0.0.1:3000/img/mac.png"
    }, {
        "name": "thumb-1024",
        "filename": "thumb-1024.jpg",
        "url": "https://d1cuyjsrcm0gby.cloudfront.net/RosavpwgPDeNW_d7ok1lsQ/thumb-1024.jpg"
    }, {
        "name": "thumb-2048",
        "filename": "thumb-2048.jpg",
        "url": "https://d1cuyjsrcm0gby.cloudfront.net/RosavpwgPDeNW_d7ok1lsQ/thumb-2048.jpg"
    }]
}])
}