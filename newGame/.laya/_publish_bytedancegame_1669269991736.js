// v1.0.0
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_bytedancegame.js", "").replace("/.laya/publish_bytedancegame.js", "") + "/" : "./../";

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
let commandSuffix = ".cmd";

let 
    config,
    releaseDir;
let isGlobalCli = true;
let isOpendataProj;
let versionCon; // 版本管理version.json
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_Byte", function() {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "bytedancegame").replace(/\\/g, "/");
	config = pubsetJson[9];

	if (process.platform === "darwin") {
		commandSuffix = "";
	}
});

gulp.task("copyPlatformFile_Byte", ["preCreate_Byte"], function() {
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "bytefiles");
	let hasPublishPlatform = 
		fs.existsSync(path.join(releaseDir, "game.js")) &&
		fs.existsSync(path.join(releaseDir, "game.json")) &&
		fs.existsSync(path.join(releaseDir, "project.config.json"));
	if (hasPublishPlatform) {
		copyLibsList = [`${adapterPath}/microgame-adapter.js`];
	} else {
		copyLibsList = [`${adapterPath}/*.*`];
	}
	let stream = gulp.src(copyLibsList);
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("version_Byte", ["copyPlatformFile_Byte"], function() {
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		let gameJSPath = releaseDir + "/game.js";
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(releaseDir));
	}
});

gulp.task("buildByteProj", ["version_Byte"], function() {
	console.log("all tasks completed");
});