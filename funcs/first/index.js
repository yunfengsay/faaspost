const mongoose = require('mongoose');

module.exports = function(ctx, next) {
	console.log(mongoose)
	ctx.body = {
		success: true,
		msg: 'from message'
	}
}
