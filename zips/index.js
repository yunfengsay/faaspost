const mongoose = require('mongoose');

module.exports = function(ctx, next) {
	ctx.body = {
		success: true,
		msg: 'from message'
	}
}
