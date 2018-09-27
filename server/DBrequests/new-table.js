const newTable = function(req, res, next)
{
    req.new_body = 
    {
        name: req.body.name,
        headers: req.body.headers,
        data: []
    }
    req.create_new = true //tells the next middlware that it shoul use req.new_body
    next()
}

module.exports = newTable