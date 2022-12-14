// v1.1.4
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_taobaominiapp.js", "").replace("/.laya/publish_taobaominiapp.js", "") + "/" : "./../";

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
let subList = [];

// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_TBMini", function() {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "taobaominiapp").replace(/\\/g, "/");
	releaseDir = tempReleaseDir = path.join(releaseDir, "temprelease");
	config = pubsetJson[11];

	if (process.platform === "darwin") {
		commandSuffix = "";
	}
});

gulp.task("copyPlatformFile_TBMini", ["preCreate_TBMini"], function() {
	releaseDir = path.dirname(releaseDir);
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "taobaofiles");
	let hasPublishPlatform = 
		fs.existsSync(path.join(releaseDir, "app.js")) &&
		fs.existsSync(path.join(releaseDir, "app.json")) &&
		fs.existsSync(path.join(releaseDir, "package.json"));
	let copyLibsList;
	if (hasPublishPlatform) {
		copyLibsList = [`${adapterPath}/node_modules/layaengine/adapter.js`];
	} else {
		copyLibsList = [`${adapterPath}/**/*.*`];
	}
	var stream = gulp.src(copyLibsList, {base: adapterPath});
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("copyFiles2Pages_TBMini", ["copyPlatformFile_TBMini"], function() {
	return gulp.src(`${tempReleaseDir}/**/*.*`).pipe(gulp.dest(`${releaseDir}/pages/index`));
});

gulp.task("moveToLibs_TBMini", ["copyFiles2Pages_TBMini"], function() {
	let libsPath = path.join(tempReleaseDir, "libs");
	let layaenginePath = path.join(releaseDir, "node_modules", "layaengine", "libs");
	return gulp.src(`${libsPath}/**/*.*`)
			.pipe(gulp.dest(layaenginePath));
});

gulp.task("delFiles_TBMini", ["moveToLibs_TBMini"], function(cb) {
	let delList = [`${tempReleaseDir}/**`];
	del(delList, { force: true }).then(paths => {
		cb();
	}).catch((err) => {
		throw err;
	})
});

gulp.task("delPagesLibsFiles_TBMini", ["delFiles_TBMini"], function(cb) {
	if (!fs.existsSync(`${releaseDir}/pages/index/libs`)) {
		return cb();
	}
	let delList = [`${releaseDir}/pages/index/libs/**`];
	del(delList, { force: true }).then(paths => {
		cb();
	}).catch((err) => {
		throw err;
	})
});

gulp.task("modifyFile_TBMini", ["delPagesLibsFiles_TBMini"], function() {
	if (config.version || config.enableVersion) {
		let versionPath = path.join(releaseDir, "pages", "index", "version.json");
		versionCon = fs.readFileSync(versionPath, "utf-8");
		versionCon = JSON.parse(versionCon);
	}

	// 修改 app.json mini.project.json 文件
	let miniProJJsonPath = path.join(releaseDir, "mini.project.json");
	let minicontent = fs.readFileSync(miniProJJsonPath, "utf8");
	let miniConJson = JSON.parse(minicontent);
	let appJsonPath = path.join(releaseDir, "app.json");
	let content = fs.readFileSync(appJsonPath, "utf8");
	let conJson = JSON.parse(content);
	// 先删掉之前的记录
	delete conJson.subPackages;
	delete conJson.subPackageBuildType;
	delete miniConJson.enableEnhancedBuild;
	let index = 0, value;
	while(miniConJson.include.length > index) {
		value = miniConJson.include[index];
		if (value.match(/[\w]+\/\*\*/mg)) {
            miniConJson.include.splice(index, 1);
			continue;
        }
		index++;
	}
	if (config.taobaoInfo.subpack) { // 分包
		let subpack = config.taobaoSubpack;
		let subitem, obj;
		conJson.subPackages = [];
		for (let i = 0, len = subpack.length; i < len; i++) {
			subitem = subpack[i];
			obj = {
				"root": subitem.name
			};
			if (config.taobaoInfo.ispagesub) { // 页面分包
				if (!subitem.root) continue;
				obj.pages = subitem.root.split(",")
			} else { // 资源分包
				conJson.subPackageBuildType = "shared";
				miniConJson.enableEnhancedBuild = true;
				if (!miniConJson.include) miniConJson.include = [];
				miniConJson.include.push(`${subitem.name}/**`);
			}
			conJson.subPackages.push(obj);
		}
	}
	content = JSON.stringify(conJson, null, 4);
	fs.writeFileSync(appJsonPath, content, "utf8");
	minicontent = JSON.stringify(miniConJson, null, 4);
	fs.writeFileSync(miniProJJsonPath, minicontent, "utf8");

	// 修改libs.js
	let indexJsStr = (versionCon && versionCon["libs.js"]) ? versionCon["libs.js"] :  "libs.js";
	let indexFilePath = path.join(releaseDir, "pages", "index", indexJsStr);
	if (!fs.existsSync(indexFilePath)) {
		return;
	}
	let indexFileContent = fs.readFileSync(indexFilePath, "utf-8");
	indexFileContent = indexFileContent.replace(/require\("\.\/libs/gm, `require("layaengine/libs`);
	indexFileContent = indexFileContent.replace(`require("./laya.js")`, `require("layaengine/laya.js")`);
	// 特殊的，增加清除缓存
	indexFileContent = indexFileContent.replace(/(require(\(['"][\w\/\.]+['"]\));?)/gm, "delete require.cache[require.resolve$2];\n$1");
	fs.writeFileSync(indexFilePath, indexFileContent, "utf-8");
})

gulp.task("movesubpack_TBMini", ["modifyFile_TBMini"], function() {
	if (!config.taobaoInfo.subpack) { // 分包
		return;
	}
	let subpack = config.taobaoSubpack;
	let subitem, obj;
	// conJson.subPackages = [];
	for (let i = 0, len = subpack.length; i < len; i++) {
		subitem = subpack[i];
		subList.push(`${subitem.name}/**`);
	}
	let source = `${path.join(releaseDir, "pages", "index")}/${subList.length > 1 ? `{${subList.join(",")}}` : `${subList[0]}`}`;
	return gulp.src(source, { base: path.join(releaseDir, "pages", "index") }).pipe(gulp.dest(releaseDir));
})
gulp.task("rmsubpack_TBMini", ["movesubpack_TBMini"], function(cb) {
	if (!config.taobaoInfo.subpack || subList.length == 0) { // 分包
		return cb();
	}
	let delList = [];
	for (let i = 0, len = subList.length; i < len; i++) {
		delList.push(`${releaseDir}/pages/index/${subList[i]}`);
	}
	del(delList, { force: true }).then(paths => {
		cb();
	}).catch((err) => {
		throw err;
	})
});

gulp.task("modifyMinJs_TBMini", ["rmsubpack_TBMini"], function() {
	// 如果保留了平台文件，如果同时取消使用min类库，就会出现文件引用不正确的问题
	// if (config.keepPlatformFile) {
	// 	let fileJsPath = path.join(releaseDir, "pages", "index", "game.js");
	// 	let content = fs.readFileSync(fileJsPath, "utf-8");
	// 	content = content.replace(/min\/laya(-[\w\d]+)?\.tbmini\.min\.js/gm, "laya.tbmini.js");
	// 	fs.writeFileSync(fileJsPath, content, 'utf-8');
	// }
	// if (!config.useMinJsLibs) {
	// 	return;
	// }
	// let fileJsPath = path.join(releaseDir, "pages", "index", "game.js");
	// let content = fs.readFileSync(fileJsPath, "utf-8");
	// content = content.replace(/(min\/)?laya(-[\w\d]+)?\.tbmini(\.min)?\.js/gm, "min/laya.tbmini.min.js");
	// fs.writeFileSync(fileJsPath, content, 'utf-8');
});

gulp.task("modifyLibsJs_TBMini", ["modifyMinJs_TBMini"], function() {
	const NONCORESTR = "var window = $global.window;\nvar document = window.document;\nvar XMLHttpRequest = window.XMLHttpRequest;\nvar Config = window.Config;\nvar Config3D = window.Config3D;\nvar Laya = window.Laya;\nvar Laya3D = window.Laya3D;\nvar laya = window.laya;\n";
	const CORESTR =    "var window = $global.window;\nvar document = window.document;\nvar XMLHttpRequest = window.XMLHttpRequest;\nvar laya = window.laya = {};\n";
	// libs
	let libsPath = path.join(releaseDir, "node_modules", "layaengine", "libs", config.useMinJsLibs ? "min" : "");
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
	let bundlePath = path.join(releaseDir, "pages", "index", codeJsStr);
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
	let layaPath = path.join(releaseDir, "pages", "index", layaJsStr);
	if (fs.existsSync(layaPath)) {
		let con = fs.readFileSync(layaPath, "utf8");
		con = CORESTR + con;

		// 移动到 layaengine 下
		let newLayaPath = path.join(releaseDir, "node_modules", "layaengine", layaJsStr);
		fs.writeFileSync(newLayaPath, con, "utf8");
		fs.unlinkSync(layaPath);
	}
});

gulp.task("version_TBMini", ["modifyLibsJs_TBMini"], function() {
	// 如果保留了平台文件，如果同时开启版本管理，就会出现文件引用不正确的问题
	if (config.keepPlatformFile) {
		let fileJsPath = path.join(releaseDir, "pages", "index", "game.js");
		let content = fs.readFileSync(fileJsPath, "utf-8");
		content = content.replace(/laya(-[\w\d]+)?\.tbmini/gm, "laya.tbmini");
		content = content.replace(/index(-[\w\d]+)?\.js/gm, "index.js");
		fs.writeFileSync(fileJsPath, content, 'utf-8');
	}
	if (config.version) {
		let versionPath = path.join(releaseDir, "pages", "index", "version.json");
		let gameJSPath = path.join(releaseDir, "pages", "index", "game.js");
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(`${releaseDir}/pages/index`));
	}
});

gulp.task("buildTBMiniProj", ["version_TBMini"], function() {
	console.log("all tasks completed");
});