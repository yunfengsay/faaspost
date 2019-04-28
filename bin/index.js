#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const zipper = require('zip-local');
const request = require('request');
const download = require('download-git-repo');
const {buildjs}  = require('./util.js');

program
	.option('-p, --publish <publishtype>', '发布类型', 'd')
	.option('-f, --func <func>', '函数文件夹')
	.option('init, --init <init>', '初始化', '')
	.command('init') //设置的命令
	.action(function() {
		//用于设置命令执行的相关回调
	});
program.parse(process.argv);

let zipDir = async (dirname) => {
	await zipper.sync.zip(`${process.cwd()}/funcs/${dirname}/dist`).compress().save(`${process.cwd()}/zips/${dirname}.zip`);
}

async function  postFunc2server(funcdirname) {
	await zipDir(funcdirname);
	const formData = {
		filename: funcdirname,
		file: fs.createReadStream(process.cwd() + '/zips/' + funcdirname + '.zip'),
	}
	request.post({url: 'http://118.25.13.120:5555/savefunc', formData:formData}, function callback(err, response, body) {
		if(err) {
			return console.error('upload failed :', err);
		}
		console.log('success')
	})
}
let run = async () => {
	let { func, publish, init } = program;
	if( init ) {
		download('yunfengsay/faas_self_funcs_template#node', `./funcs/${init}`, false, err => {
			if(err) {
				console.log(`create faas func ${init} error!`)
				return;
			}
			console.log(`create faas func ${init} success!`)

		})
	}
	if(	func ) {
		const funcsrc = `./funcs`;	
		await buildjs(func, funcsrc);
		await postFunc2server(func);
	}
}

run();
