// v1.0.1
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_taobaowidget.js", "").replace("/.laya/publish_taobaowidget.js", "") + "/" : "./../";

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
    releaseDir,
	tempReleaseDir;
let isGlobalCli = true;
let isOpendataProj;
let versionCon; // 版本管理version.json
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_TBWidget", function() {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "taobaowidget").replace(/\\/g, "/");
	releaseDir = tempReleaseDir = path.join(releaseDir, "temprelease");
	config = pubsetJson[13];

	if (process.platform === "darwin") {
		commandSuffix = "";
	}
});

gulp.task("copyPlatformFile_TBWidget", ["preCreate_TBWidget"], function() {
	releaseDir = path.dirname(releaseDir);
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "taobaowidgetfiles");
	let hasPublishPlatform = 
		fs.existsSync(path.join(releaseDir, "client")) &&
		fs.existsSync(path.join(releaseDir, "widget")) &&
		fs.existsSync(path.join(releaseDir, "mini.project.json"));
	let copyLibsList;
	if (hasPublishPlatform) {
		copyLibsList = [`${adapterPath}/widget/component/adapter.js`];
	} else {
		copyLibsList = [`${adapterPath}/**/*.*`];
	}
	var stream = gulp.src(copyLibsList, {base: adapterPath});
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("copyFiles2Pages_TBWidget", ["copyPlatformFile_TBWidget"], function() {
	return gulp.src(`${tempReleaseDir}/**/*.*`).pipe(gulp.dest(`${releaseDir}/widget/component`));
});

gulp.task("delFiles_TBWidget", ["copyFiles2Pages_TBWidget"], function(cb) {
	let delList = [`${tempReleaseDir}/**`];
	del(delList, { force: true }).then(paths => {
		cb();
	}).catch((err) => {
		throw err;
	})
});

gulp.task("modifyFile_TBWidget", ["delFiles_TBWidget"], function() {
	if (config.version || config.enableVersion) {
		let versionPath = path.join(releaseDir, "widget", "component", "version.json");
		versionCon = fs.readFileSync(versionPath, "utf-8");
		versionCon = JSON.parse(versionCon);
	}
	// 修改libs.js
	let indexJsStr = (versionCon && versionCon["libs.js"]) ? versionCon["libs.js"] :  "libs.js";
	let indexFilePath = path.join(releaseDir, "widget", "component", indexJsStr);
	if (!fs.existsSync(indexFilePath)) {
		return;
	}
	let indexFileContent = fs.readFileSync(indexFilePath, "utf-8");
	indexFileContent = indexFileContent.replace(/require\("\.\/libs/gm, `require("./libs`);
	indexFileContent = indexFileContent.replace(`require("./laya.js")`, `require("./laya.js")`);
	// 特殊的，增加清除缓存
	indexFileContent = indexFileContent.replace(/(require(\(['"][\w\/\.]+['"]\));?)/gm, "delete require.cache[require.resolve$2];\n$1");
	fs.writeFileSync(indexFilePath, indexFileContent, "utf-8");
})

gulp.task("modifyMinJs_TBWidget", ["modifyFile_TBWidget"], function() {
	// 如果保留了平台文件，如果同时取消使用min类库，就会出现文件引用不正确的问题
	// if (config.keepPlatformFile) {
	// 	let fileJsPath = path.join(releaseDir, "widget", "component", "game.js");
	// 	let content = fs.readFileSync(fileJsPath, "utf-8");
	// 	content = content.replace(/min\/laya(-[\w\d]+)?\.TBWidget\.min\.js/gm, "laya.TBWidget.js");
	// 	fs.writeFileSync(fileJsPath, content, 'utf-8');
	// }
	// if (!config.useMinJsLibs) {
	// 	return;
	// }
	// let fileJsPath = path.join(releaseDir, "widget", "component", "game.js");
	// let content = fs.readFileSync(fileJsPath, "utf-8");
	// content = content.replace(/(min\/)?laya(-[\w\d]+)?\.TBWidget(\.min)?\.js/gm, "min/laya.TBWidget.min.js");
	// fs.writeFileSync(fileJsPath, content, 'utf-8');
});

gulp.task("modifyLibsJs_TBWidget", ["modifyMinJs_TBWidget"], function() {
	const NONCORESTR = "var window = $global.window;\nvar document = window.document;\nvar XMLHttpRequest = window.XMLHttpRequest;\nvar Config = window.Config;\nvar Config3D = window.Config3D;\nvar Laya = window.Laya;\nvar Laya3D = window.Laya3D;\nvar laya = window.laya;\n";
	const CORESTR =    "var window = $global.window;\nvar document = window.document;\nvar XMLHttpRequest = window.XMLHttpRequest;\nvar laya = window.laya = {};\n";
	// libs
	let libsPath = path.join(releaseDir, "widget", "component", "libs", config.useMinJsLibs ? "min" : "");
	let libsList = [];
	if (fs.existsSync(libsPath)) {
		libsList = fs.readdirSync(libsPath);
	}
	for (let libName, fullPath, con, isDir, len = libsList.length, i = 0; i < len; i++) {
		libName = libsList[i];
		fullPath = path.join(libsPath, libName);
		isDir = fs.statSync(fullPath).isDirectory();
		if (isDir) {
			continue;
		}
		con = fs.readFileSync(fullPath, "utf8");
		if (/laya(-[\w\d]+)?\.core/gm.test(libName)) {
			con = CORESTR + con;
		} else {
			con = NONCORESTR + con;
		}
		fs.writeFileSync(fullPath, con, "utf8");
	}
	// code.js
	let codeJsStr = (versionCon && versionCon["code.js"]) ? versionCon["code.js"] :  "code.js";
	let bundlePath = path.join(releaseDir, "widget", "component", codeJsStr);
	let con = fs.readFileSync(bundlePath, "utf8");
	if (fs.existsSync(path.join(workSpaceDir, "asconfig.json"))
		&& !fs.existsSync(path.join(workSpaceDir, "bin", "h5", "laya.js"))) { // as 没有laya.js，则认为code.js为核心包
		con = CORESTR + con;
	} else {
		con = NONCORESTR + con;
	}
	fs.writeFileSync(bundlePath, con, "utf8");
	// laya.js
	let layaJsStr = (versionCon && versionCon["laya.js"]) ? versionCon["laya.js"] :  "laya.js";
	let layaPath = path.join(releaseDir, "widget", "component", layaJsStr);
	if (fs.existsSync(layaPath)) {
		let con = fs.readFileSync(layaPath, "utf8");
		con = CORESTR + con;
		fs.writeFileSync(layaPath, con, "utf8");
	}
});

gulp.task("version_TBWidget", ["modifyLibsJs_TBWidget"], function() {
	// 如果保留了平台文件，如果同时开启版本管理，就会出现文件引用不正确的问题
	if (config.keepPlatformFile) {
		let fileJsPath = path.join(releaseDir, "widget", "component", "game.js");
		let content = fs.readFileSync(fileJsPath, "utf-8");
		content = content.replace(/laya(-[\w\d]+)?\.TBWidget/gm, "laya.TBWidget");
		content = content.replace(/index(-[\w\d]+)?\.js/gm, "index.js");
		fs.writeFileSync(fileJsPath, content, 'utf-8');
	}
	if (config.version) {
		let versionPath = path.join(releaseDir, "widget", "component", "version.json");
		let gameJSPath = path.join(releaseDir, "widget", "component", "game.js");
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(`${releaseDir}/widget/component`));
	}
});

gulp.task("buildTBWidgetProj", ["version_TBWidget"], function() {
	console.log("all tasks completed");
});