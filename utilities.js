exports.notAuthorized = function(){
    ret = {
        statusCode: 400,
        message: "You are not authorized to perform this operation"
    };
    return ret;
}

exports.getPageParams = function(req){
    var page = req.query.page || 1;
    var limit = req.query.perPage || 20;
    var offset = (parseInt(page)-1)*parseInt(limit);
    var pageParams = {
        page: page,
        limit: limit,
        offset: offset
    };
    return pageParams;
}

exports.makeid = function(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() *  charactersLength)));
   }
   return result.join('');
}

exports.getDaysOnMarket = function(start, end){
    var time = end - start;
    var days = time / (1000 * 3600 * 24);
    return Math.floor(days);
}

exports.getDaysInMonth = function(end){
    var date = new Date(end);
    
    var month = date.getMonth();
    var year = date.getYear();
    return new Date(year, month, 0).getDate();
}