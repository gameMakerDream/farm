// v1.8.1
// 获取Node插件和工作路径
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_qqgame.js", "").replace("/.laya/publish_qqgame.js", "") + "/" : "./../";

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
let commandSuffix = ".cmd";
const provider = "1109760542";
const fullRemoteEngineList = ["laya.core.min.js", "laya.qqmini.min.js", "laya.webgl.min.js", "laya.ui.min.js", "laya.tiledmap.min.js", 
		"laya.pathfinding.min.js", "laya.particle.min.js", "laya.html.min.js", "laya.filter.min.js", "laya.device.min.js", "laya.debugtool.min.js",
		"laya.ani.min.js", "laya.d3.min.js", "laya.d3Plugin.min.js"];

let 
    config,
    releaseDir;
let isGlobalCli = true;
let versionCon; // 版本管理version.json
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_QQ", function() {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "qqgame").replace(/\\/g, "/");
	config = pubsetJson[2];
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	// let copyLibsList = [`${workSpaceDir}/bin/libs/laya.qqmini.js`];
	// var stream = gulp.src(copyLibsList, { base: `${workSpaceDir}/bin` });
	// return stream.pipe(gulp.dest(releaseDir));
	return;
});

gulp.task("copyPlatformFile_QQ", ["preCreate_QQ"], function() {
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "qqfiles");
	let hasPublishPlatform = 
		fs.existsSync(path.join(releaseDir, "game.js")) &&
		fs.existsSync(path.join(releaseDir, "game.json")) &&
		fs.existsSync(path.join(releaseDir, "project.config.json"));
	if (hasPublishPlatform) {
		copyLibsList = [`${adapterPath}/weapp-adapter.js`];
	} else {
		copyLibsList = [`${adapterPath}/*.*`];
	}
	let stream = gulp.src(copyLibsList);
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("version_QQ", ["copyPlatformFile_QQ"], function() {
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		let gameJSPath = releaseDir + "/game.js";
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(releaseDir));
	}
});

gulp.task("pluginEngin_QQ", ["version_QQ"], function(cb) {
	if (!config.uesEnginePlugin) { // 没有使用微信引擎插件，还是像以前一样发布
		return cb();
	}
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = "libs.js";
	
	// 获取version等信息
	let coreLibPath = path.join(workSpaceDir, "bin", "libs", "laya.core.js");
	let isHasCoreLib = fs.existsSync(coreLibPath);
	let isOldAsProj = fs.existsSync(`${workSpaceDir}/asconfig.json`) && !isHasCoreLib;
	let EngineVersion = getEngineVersion();
	if (!EngineVersion) {
		throw new Error(`读取引擎版本号失败，请于服务提供商联系!`);
	}
	if (!EngineVersion || EngineVersion.includes("beta") || !canUsePluginEngine(EngineVersion)) {
		throw new Error(`该版本引擎无法使用引擎插件功能(engineVersion: ${EngineVersion})`);
	}
	console.log(`通过版本号检查:  ${EngineVersion}`);
	// 使用引擎插件
	let localUseEngineList = [];
	let copyEnginePathList;
	new Promise(function(resolve, reject) {
		console.log(`修改game.js和game.json`);
		// 1) 修改game.js和game.json
		// 修改game.js
		let gameJsPath = path.join(releaseDir, "game.js");
		let gameJscontent = `require("weapp-adapter.js");\nrequirePlugin('layaPlugin');\nwindow.loadLib = require;\nrequire("./${indexJsStr}");\nrequire("./code.js");`;
		fs.writeFileSync(gameJsPath, gameJscontent, "utf8");
		// 修改game.json，使其支持引擎插件
		let gameJsonPath = path.join(releaseDir, "game.json");
		let gameJsonContent = fs.readFileSync(gameJsonPath, "utf8");
		let conJson = JSON.parse(gameJsonContent);
		conJson.plugins = {
			"layaPlugin": {
				"version": EngineVersion,
				"provider": provider,
				"path": "laya-libs"
			}
		}
		gameJsonContent = JSON.stringify(conJson, null, 4);
		fs.writeFileSync(gameJsonPath, gameJsonContent, "utf8");
		resolve();
	}).then(function() {
		return new Promise(function(resolve, reject) {
			console.log(`确定用到的插件引擎`);
			// 2) 确定用到了那些插件引擎，并将插件引擎从index.js的引用中去掉
			let indexJsPath = path.join(releaseDir, indexJsStr);
			let indexJsCon = fs.readFileSync(indexJsPath, "utf8");
			// 1.x这里会比较麻烦一些，需要处理不带min的情况
			// 处理引擎插件
			let minLibsPath = path.join(releaseDir, "libs", "min");
			if (!isOldAsProj && !fs.existsSync(minLibsPath)) {
				fs.mkdirSync(minLibsPath);
			}
			let item, minItem;
			for (let i = 0, len = fullRemoteEngineList.length; i < len; i++) {
				minItem = fullRemoteEngineList[i];
				item = minItem.replace(".min.js", ".js");
				minFullRequireItem = `require("./libs/min/${minItem}")`;
				fullRequireItem = `require("./libs/${item}")`;
				// 如果引用了未压缩的类库，将其重命名为压缩的类库，并拷贝到libs/min中
				if (indexJsCon.includes(fullRequireItem)) {
					let oldlibPath = path.join(releaseDir, "libs", item);
					let newlibPath = path.join(releaseDir, "libs", minItem);
					let newMinlibPath = path.join(releaseDir, "libs", "min", minItem);
					fs.renameSync(oldlibPath, newlibPath);
					// fs.copyFileSync(newlibPath, newMinlibPath);
					let con = fs.readFileSync(newlibPath, "utf8");
					fs.writeFileSync(newMinlibPath, con, "utf8");
					fs.unlinkSync(newlibPath);
					localUseEngineList.push(minItem);
					indexJsCon = indexJsCon.replace(fullRequireItem, "");
				} else if (indexJsCon.includes(minFullRequireItem)) { // 引用了min版类库
					localUseEngineList.push(minItem);
					indexJsCon = indexJsCon.replace(minFullRequireItem, "");
				}
			}
			if (isOldAsProj) { // 如果as语言，开发者将laya.js也写入index.js中了，将其删掉
				fullRequireItem = `require("./laya.js")`;
				if (indexJsCon.includes(fullRequireItem)) {
					indexJsCon = indexJsCon.replace(fullRequireItem, "");
				}
			}
			fs.writeFileSync(indexJsPath, indexJsCon, "utf8");
			// ts/js再次修改game.js，仅引用使用到的类库
			// as因为本地只有laya.js，无法仅引用使用到的类库
			if (!isOldAsProj) {
				let pluginCon = "";
				localUseEngineList.forEach(function(item) {
					pluginCon += `requirePlugin("layaPlugin/${item}");\n`;
				});
				let gameJsPath = path.join(releaseDir, "game.js");
				let gameJsCon = fs.readFileSync(gameJsPath, "utf8");
				gameJsCon = gameJsCon.replace(`requirePlugin('layaPlugin');`, pluginCon);
				fs.writeFileSync(gameJsPath, gameJsCon, "utf8");
			}
			resolve();
		});
	}).then(function() {
		return new Promise(function(resolve, reject) {
			console.log(`将本地的引擎插件移动到laya-libs中`);
			// 3) 将本地的引擎插件移动到laya-libs中
			copyEnginePathList = [`${releaseDir}/libs/min/{${localUseEngineList.join(",")}}`];
			if (isOldAsProj) { // 单独拷贝laya.js
				copyEnginePathList = [`${releaseDir}/laya.js`];
			}
			gulp.src(copyEnginePathList).pipe(gulp.dest(`${releaseDir}/laya-libs`));
			setTimeout(resolve, 500);
		});
	}).then(function() {
		return new Promise(function(resolve, reject) {
			console.log(`将libs中的本地引擎插件删掉`);
			// 4) 将libs中的本地引擎插件删掉
			del(copyEnginePathList, { force: true }).then(resolve);
		});
	}).then(function() {
		return new Promise(async function(resolve, reject) {
			console.log(`完善引擎插件目录`);
			// 5) 引擎插件目录laya-libs中还需要新建几个文件，使该目录能够使用
			if (isOldAsProj) { // 单独拷贝laya.js
				localUseEngineList.push("laya.js");
			}
			let 
				layalibsPath = path.join(releaseDir, "laya-libs"),
				engineIndex = path.join(layalibsPath, "index.js"),
				engineplugin = path.join(layalibsPath, "plugin.json"),
				enginesignature = path.join(layalibsPath, "signature.json");
			// index.js
			if (!fs.existsSync(layalibsPath)) {
				throw new Error("引擎插件目录创建失败，请与服务提供商联系!");
			}
			let indexCon = "";
			localUseEngineList.forEach(function(item) {
				indexCon += `require("./${item}");\n`;
			});
			fs.writeFileSync(engineIndex, indexCon, "utf8");
			// plugin.json
			let pluginCon = {"main": "index.js"};
			fs.writeFileSync(engineplugin, JSON.stringify(pluginCon, null, 4), "utf8");
			// signature.json
			let signatureCon = {
				"provider": provider,
				"signature": []
			};
			localUseEngineList.unshift("index.js");
			let fileName, md5Str;
			for (let i = 0, len = localUseEngineList.length; i < len; i++) {
				fileName = localUseEngineList[i];
				let md5Str = await getFileMd5(path.join(releaseDir, "laya-libs", fileName));
				signatureCon.signature.push({
					"path": fileName,
					"md5": md5Str
				});
			}
			fs.writeFileSync(enginesignature, JSON.stringify(signatureCon, null, 4), "utf8");
			resolve();
		});
	})
	.then(function() {
		cb();
	}).catch(function(e) {
		throw e;
	})
});

function getEngineVersion() {
	let coreLibPath = path.join(workSpaceDir, "bin", "libs", "laya.core.js");
	let isHasCoreLib = fs.existsSync(coreLibPath);
	let isOldAsProj = fs.existsSync(`${workSpaceDir}/asconfig.json`) && !isHasCoreLib;
	let isNewTsProj = fs.existsSync(`${workSpaceDir}/src/tsconfig.json`) && !isHasCoreLib;
	let EngineVersion;
	if (isHasCoreLib) {
		let con = fs.readFileSync(coreLibPath, "utf8");
		let matchList = con.match(/Laya\.version\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
		if (!Array.isArray(matchList)) {
			return null;
		}
		EngineVersion = matchList[1];
	} else { // newts项目和旧版本as项目
		if (isOldAsProj) {
			let coreLibFilePath = path.join(workSpaceDir, "libs", "laya", "src", "Laya.as");
			if (!fs.existsSync(coreLibFilePath)) {
				return null;
			}
			let con = fs.readFileSync(coreLibFilePath, "utf8");
			let matchList = con.match(/version:String\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
			if (!Array.isArray(matchList)) {
				return null;
			}
			EngineVersion = matchList[1];
		} else if (isNewTsProj) {
			let coreLibFilePath = path.join(workSpaceDir, "libs", "Laya.ts");
			if (!fs.existsSync(coreLibFilePath)) {
				return null;
			}
			let con = fs.readFileSync(coreLibFilePath, "utf8");
			let matchList = con.match(/static\s*version:\s*string\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
			if (!Array.isArray(matchList)) {
				return null;
			}
			EngineVersion = matchList[1];
		}
	}
	// 特殊处理，因为历史原因，我们有一些4位的正式版本，调整为3位
	if (EngineVersion && /[\d\.]+/.test(EngineVersion) && EngineVersion.split(".").length > 3) {
		let verList = EngineVersion.split(".");
		verList.length = 3;
		EngineVersion = verList.join(".");
	}
	return EngineVersion;
}

function getFileMd5(filePath) {
	return new Promise(function(resolve, reject) {
		let md5 = crypto.createHash('md5');
		let stream = fs.createReadStream(filePath);
		stream.on("data", function(data) {
			md5.update(data);
		});
		stream.on("end", function() {
			let md5Str = md5.digest('hex');
			return resolve(md5Str);
		});
	});
}

function canUsePluginEngine(version) {
	const minVersionNum = "1.8.4";
	let compileMacthList = minVersionNum.match(/^(\d+)\.(\d+)\.(\d+)/);
	let matchList = version.match(/^(\d+)\.(\d+)\.(\d+)/);
	let 
		s1n = Number(matchList[1]), // src first number
		s2n = Number(matchList[2]),
		s3n = Number(matchList[3]),
		t1n = Number(compileMacthList[1]), // to first number
		t2n = Number(compileMacthList[2]),
		t3n = Number(compileMacthList[3]);
    if (s1n > t1n) {
        return true;
	}
    if (s1n === t1n && s2n > t2n) {
        return true;
    }
    if (s1n === t1n && s2n === t2n && s3n >= t3n) {
        return true;
    }
    return false;
}

gulp.task("buildQQProj", ["pluginEngin_QQ"], function() {
	console.log("all tasks completed");
});