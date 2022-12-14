// v1.8.0
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_alipaygame.js", "").replace("/.laya/publish_alipaygame.js", "") + "/" : "./../";

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
let commandSuffix = ".cmd";

let 
    config,
    releaseDir;
let isGlobalCli = true;
let versionCon; // 版本管理version.json
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_Alipay", function() {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "Alipaygame").replace(/\\/g, "/");
	config = pubsetJson[8];
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	// let copyLibsList = [`${workSpaceDir}/bin/libs/laya.Alipaymini.js`];
	// var stream = gulp.src(copyLibsList, { base: `${workSpaceDir}/bin` });
	// return stream.pipe(gulp.dest(releaseDir));
	return;
});

gulp.task("copyPlatformFile_Alipay", ["preCreate_Alipay"], function() {
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "Alipayfiles");
	let hasPublishPlatform = 
		fs.existsSync(path.join(releaseDir, "game.js")) &&
		fs.existsSync(path.join(releaseDir, "game.json"));
	let copyLibsList;
	if (hasPublishPlatform) {
		copyLibsList = [`${adapterPath}/my-adapter.js`];
	} else {
		copyLibsList = [`${adapterPath}/*.*`];
	}
	let stream = gulp.src(copyLibsList);
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("modifyFile_Alipay", ["copyPlatformFile_Alipay"], function() {
	// 修改game.json文件
	let gameJsonPath = path.join(releaseDir, "game.json");
	let content = fs.readFileSync(gameJsonPath, "utf8");
	let conJson = JSON.parse(content);
	conJson.screenOrientation = config.AlipayInfo.screenOrientation;
	content = JSON.stringify(conJson, null, 4);
	fs.writeFileSync(gameJsonPath, content, "utf8");

	// 修改game.js
	let filePath = path.join(releaseDir, "game.js");
	let fileContent = fs.existsSync(filePath) && fs.readFileSync(filePath, "utf8");
	let reWriteMainJs = !fs.existsSync(filePath) || !fileContent.includes("my-adapter");
	if (reWriteMainJs) {
		fileContent = `require("./my-adapter.js");
require("./libs.js");\nrequire("./code.js");`;
		fs.writeFileSync(filePath, fileContent, "utf8");
	}
})

gulp.task("version_Alipay", ["modifyFile_Alipay"], function () {
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		let gameJSPath = releaseDir + "/game.js";
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(releaseDir));
	}
});

gulp.task("buildAlipayProj", ["version_Alipay"], function() {
	console.log("all tasks completed");
});