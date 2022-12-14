// v1.8.4
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_vivogame.js", "").replace("/.laya/publish_vivogame.js", "") + "/" : "./../";

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const iconv =  require(ideModuleDir + "iconv-lite");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
const request = require(ideModuleDir + "request");

let commandSuffix = ".cmd";
const fullRemoteEngineList = ["laya.core.min.js", "laya.webgl.min.js", "laya.ui.min.js", "laya.tiledmap.min.js", 
		"laya.pathfinding.min.js", "laya.particle.min.js", "laya.html.min.js", "laya.filter.min.js", "laya.device.min.js",
		"laya.ani.min.js", "laya.d3.min.js", "laya.d3Plugin.min.js"];

let 
    config,
	releaseDir,
    tempReleaseDir, // vivo临时拷贝目录
	projDir, // vivo快游戏工程目录
	isDealNoCompile = true,
	physicsLibsPathList = [],
	isExistEngineFolder = false; // bin目录下是否存在engine文件夹
let projSrc;
let versionCon; // 版本管理version.json
let opensslPath = "openssl";

// 创建vivo项目前，拷贝vivo引擎库、修改index.js
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_VIVO", function(cb) {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "vivogame").replace(/\\/g, "/");
	releaseDir = tempReleaseDir = path.join(releaseDir, "temprelease");
	config = pubsetJson[6]; // 只用到了 config.vivoInfo|config.vivoSign
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	let layarepublicPath = path.join(ideModuleDir, "../", "out", "layarepublic");

	// 检查环境中是否存在openssl
	let otherLibsPath = path.join(layarepublicPath, "../", "vs", "layaEditor", "libs");
	childProcess.exec("openssl version", (error, stdout, stderr) => {
		if (error) {
			if (process.platform === "darwin") {
				opensslPath = path.join(otherLibsPath, "openssl", "darwin", "bin", "openssl");
			} else {
				opensslPath = path.join(otherLibsPath, "openssl", "win", "bin", "openssl.exe");
				let opensslCnfPath = path.join(otherLibsPath, "openssl", "win", "bin", "openssl.cfg");
				// 特别的，当windows没有openssl时，需要额外的OPENSSL_CONF设置变量
				// childProcess.execSync(`set OPENSSL_CONF=${opensslCnfPath}`);
				process.env.OPENSSL_CONF = opensslCnfPath;
				console.log("OPENSSL_CONF: " + childProcess.execSync("echo %OPENSSL_CONF%"));
			}
			opensslPath = `"${opensslPath}"`;
		}
		cb();
	});
});

gulp.task("copyPlatformFile_VIVO", ["preCreate_VIVO"], function() {
	return;
	// let vivoAdapterPath = path.join(layarepublicPath, "LayaAirProjectPack", "lib", "data", "vivofiles");
	// let copyLibsList = [`${vivoAdapterPath}/**/*.*`];
	// var stream = gulp.src(copyLibsList);
	// return stream.pipe(gulp.dest(tempReleaseDir));
});

// 检查是否全局安装了qgame
gulp.task("createGlobalQGame_VIVO", ["copyPlatformFile_VIVO"], function() {
	releaseDir = path.dirname(releaseDir);
	projDir = path.join(releaseDir, config.vivoInfo.projName);
	projSrc = path.join(projDir, "src");
	// npm view @vivo-minigame/cli version
	// npm install -g @vivo-minigame/cli
	let remoteVersion, localVersion;
	let isGetRemote, isGetLocal;
	let isUpdateGlobalQGame = true;
	return new Promise((resolve, reject) => { // 远程版本号
		childProcess.exec("npm view  @vivo-minigame/cli version", function(error, stdout, stderr) {
			if (!stdout) { // 获取 @vivo-minigame/cli 远程版本号失败
				console.log("Failed to get the remote version number");
				resolve();
				return;
			}
			remoteVersion = stdout;
			isGetRemote = true;
			if (isGetRemote && isGetLocal) {
				isUpdateGlobalQGame = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		childProcess.exec("mg -v", function(error, stdout, stderr) {
			if (!stdout) { // 获取  @vivo-minigame/cli 本地版本号失败
				console.log("Failed to get the local version number");
				resolve();
				return;
			}
			localVersion = stdout;
			isGetLocal = true;
			if (isGetRemote && isGetLocal) {
				isUpdateGlobalQGame = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		setTimeout(() => {
			// 如果获取到了本地版本号，但未获取到远程版本号，默认通过
			if (isGetLocal && !isGetRemote) {
				isUpdateGlobalQGame = false;
				console.log("Gets the version number timeout, does not get the remote version number, but the local version number exists, passes by default");
				resolve();
				return;
			}
		}, 10000);
	}).then(() => {
		return new Promise((resolve, reject) => {
			if (!isUpdateGlobalQGame) {
				resolve();
				return;
			}
			console.log("全局安装@vivo-minigame/cli");
			// npm install -g @vivo-minigame/cli
			let cmd = `npm${commandSuffix}`;
			let args = ["install", "@vivo-minigame/cli", "-g"];
			let opts = {
				shell: true
			};
			let cp = childProcess.spawn(cmd, args, opts);
			
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`2 end) npm install -g @vivo-minigame/cli：${code}`);
				resolve();
			});
		});
	}).catch((e) => {
		console.log("catch e", e);
	});
});

gulp.task("createProj_VIVO", ["createGlobalQGame_VIVO"], function() {
	// 如果有即存项目，不再新建
	let isProjExist = fs.existsSync(projDir + "/node_modules") && 
					  fs.existsSync(projDir + "/sign");
	if (isProjExist) {
		// 检测是否需要升级
		let packageCon = fs.readFileSync(`${projDir}/package.json`, "utf8");
		let minigamePath = path.join(projDir, "minigame.config.js");
		if (packageCon.includes("@vivo-minigame/cli-service") && fs.existsSync(minigamePath)) {
			return;
		}
	}
	// 如果有即存项目，但是是旧的项目，删掉后重新创建
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(projDir)) {
			return resolve();
		}
		let delList = [projDir];
		del(delList, { force: true }).then(paths => {
			resolve();
		});
	}).then(function() {
		// 在项目中创建vivo项目
		return new Promise((resolve, reject) => {
			console.log("(proj)开始创建vivo快游戏项目");
			// mg init <project-name>
			let cmd = `mg${commandSuffix}`;
			let args = ["init", config.vivoInfo.projName];
			let opts = {
				cwd: releaseDir,
				shell: true
			};

			let cp = childProcess.spawn(cmd, args, opts);
			
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
			
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
			
			cp.on('close', (code) => {
				cp = null;
				console.log(`子进程退出码：${code}`);
				resolve();
			});
		});
	});
});

// 检查是否安装了adapter
gulp.task("createAdapter_VIVO", ["createProj_VIVO"], function() {
	// npm view @qgame/adapter version
	// npm i -S @qgame/adapter@latest
	let remoteVersion, localVersion;
	let isGetRemote, isGetLocal;
	let isUpdateAdapter = true;
	return new Promise((resolve, reject) => { // 远程版本号
		childProcess.exec("npm view @qgame/adapter version", function(error, stdout, stderr) {
			if (!stdout) { // 获取 @vivo-minigame/cli 远程版本号失败
				console.log("Failed to get the remote adapter version number");
				resolve();
				return;
			}
			remoteVersion = stdout.replace(/[\r\n]/g, "").trim();
			isGetRemote = true;
			if (isGetRemote && isGetLocal) {
				isUpdateAdapter = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		childProcess.exec("npm ls @qgame/adapter version", { cwd: projDir }, function(error, stdout, stderr) {
			if (!stdout) { // 获取  @vivo-minigame/cli 本地版本号失败
				console.log("Failed to get the local adapter version number");
				resolve();
				return;
			}
			let info = stdout.split("@qgame/adapter@"); //@qgame/adapter@1.0.3
			info = Array.isArray(info) && info[1] && info[1].replace(/[\r\n]/g, "").trim();
			localVersion = info;
			isGetLocal = true;
			if (isGetRemote && isGetLocal) {
				isUpdateAdapter = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		setTimeout(() => {
			// 如果获取到了本地版本号，但未获取到远程版本号，默认通过
			if (!isGetLocal || !isGetRemote) {
				console.log("Failed to get the local or remote version number");
				resolve();
				return;
			}
		}, 10000);
	}).then(() => {
		return new Promise((resolve, reject) => {
			if (!isUpdateAdapter) {
				resolve();
				return;
			}
			console.log("安装@qgame/adapter");
			// npm i -S @qgame/adapter@latest
			let cmd = `npm${commandSuffix}`;
			let args = ["install", "-S", "@qgame/adapter@latest"];
			let opts = {
				shell: true,
				cwd: projDir
			};
			let cp = childProcess.spawn(cmd, args, opts);
			
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`2 end) npm i -S @qgame/adapter@latest：${code}`);
				resolve();
			});
		});
	}).catch((e) => {
		console.log("catch e", e);
	});
});

// 拷贝文件到vivo快游戏
gulp.task("copyFileToProj_VIVO", ["createAdapter_VIVO"], function() {
	// 如果有js/main.js，将其删除
	let vivoMainPath = path.join(projDir, "src", "js", "main.js");
	if (fs.existsSync(vivoMainPath)) {
		fs.unlinkSync(vivoMainPath);
	}
	// 将临时文件夹中的文件，拷贝到项目中去
	let originalDir = `${tempReleaseDir}/**/*.*`;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projSrc)));
});

// 拷贝icon到vivo快游戏
gulp.task("copyIconToProj_VIVO", ["copyFileToProj_VIVO"], function() {
	let originalDir = config.vivoInfo.icon;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(projSrc));
});

// 清除vivo快游戏临时目录
gulp.task("clearTempDir_VIVO", ["copyIconToProj_VIVO"], function() {
	// 删掉临时目录
	return del([tempReleaseDir], { force: true });
});

// 生成release签名(私钥文件 private.pem 和证书文件 certificate.pem )
gulp.task("generateSign_VIVO", ["clearTempDir_VIVO"], function() {
    if (!config.vivoSign.generateSign) {
        return;
    }
	// https://doc.quickapp.cn/tools/compiling-tools.html
	return new Promise((resolve, reject) => {
		let cmd = `${opensslPath}`;
		let args = ["req", "-newkey", "rsa:2048", "-nodes", "-keyout", "private.pem", 
					"-x509", "-days", "3650", "-out", "certificate.pem"];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			data += "";
			if (data.includes("Country Name")) {
				cp.stdin.write(`${config.vivoSign.countryName}\n`);
				console.log(`Country Name: ${config.vivoSign.countryName}`);
			} else if (data.includes("Province Name")) {
				cp.stdin.write(`${config.vivoSign.provinceName}\n`);
				console.log(`Province Name: ${config.vivoSign.provinceName}`);
			} else if (data.includes("Locality Name")) {
				cp.stdin.write(`${config.vivoSign.localityName}\n`);
				console.log(`Locality Name: ${config.vivoSign.localityName}`);
			} else if (data.includes("Organization Name")) {
				cp.stdin.write(`${config.vivoSign.orgName}\n`);
				console.log(`Organization Name: ${config.vivoSign.orgName}`);
			} else if (data.includes("Organizational Unit Name")) {
				cp.stdin.write(`${config.vivoSign.orgUnitName}\n`);
				console.log(`Organizational Unit Name: ${config.vivoSign.orgUnitName}`);
			} else if (data.includes("Common Name")) {
				cp.stdin.write(`${config.vivoSign.commonName}\n`);
				console.log(`Common Name: ${config.vivoSign.commonName}`);
			} else if (data.includes("Email Address")) {
				cp.stdin.write(`${config.vivoSign.emailAddr}\n`);
				console.log(`Email Address: ${config.vivoSign.emailAddr}`);
				// cp.stdin.end();
			}
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			// 签名是否生成成功
			let 
				privatePem = path.join(projDir, "private.pem"),
				certificatePem = path.join(projDir, "certificate.pem");
			let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
			if (!isSignExits) {
				throw new Error("签名生成失败，请检查！");
			}
			resolve();
		});
	});
});

// 拷贝sign文件到指定位置
gulp.task("copySignFile_VIVO", ["generateSign_VIVO"], function() {
    if (config.vivoSign.generateSign) { // 新生成的签名
        // 移动签名文件到项目中（Laya & vivo快游戏项目中）
        let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`,
            layaDest = `${workSpaceDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest))
                    .pipe(gulp.dest(layaDest));
    } else if (config.vivoInfo.useReleaseSign && !config.vivoSign.generateSign) { // 使用release签名，并且没有重新生成
        // 从项目中将签名拷贝到vivo快游戏项目中
        let 
            privatePem = path.join(workSpaceDir, "sign", "release", "private.pem"),
            certificatePem = path.join(workSpaceDir, "sign", "release", "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest));
    }
});

gulp.task("deleteSignFile_VIVO", ["copySignFile_VIVO"], function() {
	if (config.vivoSign.generateSign) { // 新生成的签名
		let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
		return del([privatePem, certificatePem], { force: true });
	}
});

gulp.task("modifyFile_VIVO", ["deleteSignFile_VIVO"], function() {
	// 修改manifest.json文件
	let manifestPath = path.join(projSrc, "manifest.json");
	if (!fs.existsSync(manifestPath)) {
		return;
	}
	let manifestContent = fs.readFileSync(manifestPath, "utf8");
	let manifestJson = JSON.parse(manifestContent);
	manifestJson.package = config.vivoInfo.package;
	manifestJson.name = config.vivoInfo.name;
	manifestJson.orientation = config.vivoInfo.orientation;
	manifestJson.config.logLevel = config.vivoInfo.logLevel || "off";
	manifestJson.deviceOrientation = config.vivoInfo.orientation;
	manifestJson.versionName = config.vivoInfo.versionName;
	manifestJson.versionCode = config.vivoInfo.versionCode;
	manifestJson.minPlatformVersion = config.vivoInfo.minPlatformVersion;
	manifestJson.icon = `/${path.basename(config.vivoInfo.icon)}`;
	if (config.vivoInfo.subpack) { // 分包
		manifestJson.subpackages = config.vivoSubpack;
	} else {
		delete manifestJson.subpackages;
	}
	// 增加thirdEngine字段
	let EngineVersion = getEngineVersion();
	if (EngineVersion) {
		manifestJson.thirdEngine = {
			"laya": EngineVersion
		};
	}
	fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 4), "utf8");
	
	if (config.version) {
		let versionPath = projSrc + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// 修改game.js文件
	let gameJsPath = path.join(projSrc, "game.js");
	let content = fs.existsSync(gameJsPath) && fs.readFileSync(gameJsPath, "utf8");
	let reWriteMainJs = !fs.existsSync(gameJsPath) || !content.includes("qgame/adapter");
	if (reWriteMainJs) {
		content = `require("@qgame/adapter");\nif(!window.navigator)\n\twindow.navigator = {};\nwindow.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 VVGame NetType/WIFI Language/zh_CN';
require("./libs.js");\nrequire("./code.js");`;
	} else {
		// 额外的，如果有引擎插件相关代码，需要删掉
		content = content.replace(/if\s\(window\.requirePlugin\)\s{\n[\w\"\.\-\/\(\);\s\n]+\n}\selse\s{\n[\w\"\.\-\/\(\);\s\n]+\n}\n/gm, "");
	}
	fs.writeFileSync(gameJsPath, content, "utf8");

	// vivo项目，修改index.js
	// let filePath = path.join(projSrc, indexJsStr);
	// if (!fs.existsSync(filePath)) {
	// 	return;
	// }
	// let fileContent = fs.readFileSync(filePath, "utf8");
	// fileContent = fileContent.replace(/loadLib(\(['"])/gm, "require$1./");
	// fs.writeFileSync(filePath, fileContent, "utf8");
})

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
	return EngineVersion;
}

gulp.task("version_VIVO", ["modifyFile_VIVO"], function () {
	if (config.version) {
		let versionPath = projSrc + "/version.json";
		let mainJSPath = projSrc + "/game.js";
		let srcList = [versionPath, mainJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(projSrc));
	}
});

// 处理engine文件夹，允许开发者自己在bin下定义engine文件夹，以获得针对性的优化
gulp.task("dealEngineFolder1_VIVO", ["version_VIVO"], function() {
	// 如果项目中有engine文件夹，我们默认该开发者是熟悉VIVO发布流程的，已经处理好所有的逻辑
	// 值得注意的:
	// 1) 如果有engine文件夹而未处理2D物理库(box2d.js/physics.js)，项目将无法运行
	// 2) 如果未处理3D物理库(physics3D.js)，打包时间将会很长
	let engineFolder = path.join(projDir, "src", "engine");
	isExistEngineFolder = fs.existsSync(engineFolder);
	if (!isExistEngineFolder) {
		return;
	}

	// 不想写一堆task任务，500ms默认拷贝完成吧
	// 未来有了更好的解决方案再修改
	return new Promise(function(resolve, reject) {
		// 将engine文件夹拷贝到projRoot下
		setTimeout(resolve, 500);
		var stream = gulp.src([`${engineFolder}/**/*.*`], {base: `${projDir}/src`});
		return stream.pipe(gulp.dest(projDir));
	}).then(function() {
		return new Promise(function(resolve, reject) {
			// 删掉src下的engine和adapter
			setTimeout(resolve, 500);
			return del([engineFolder], { force: true });
		});
	}).catch(function(err) {
		console.log(err);
	});
});

gulp.task("dealEngineFolder2_VIVO", ["dealEngineFolder1_VIVO"], function() {
	if (!isExistEngineFolder) {
		return;
	}
	
	let engineFolder = path.join(projDir, "engine");
	let engineFileList = fs.readdirSync(engineFolder);
	// 修改配置文件
	configVivoConfigFile(engineFileList);
});

// 如果项目中用到了 box2d.js|laya.physics.js/laya.physics3D.js ，需要特殊处理
// 之前处理的是有项目中已经存在engine文件夹的情况，现在开始处理没有文件夹的情况
gulp.task("dealNoCompile1_VIVO", ["dealEngineFolder2_VIVO"], function() {
	if (!isDealNoCompile) {
		return;
	}

	// 将code.js | libs/*.* 全放到engine文件夹中
	let indexJsStr = "libs.js";
	let bundleJsStr = "code.js";

	// 修改index.js，去掉物理库前面的libs
	let filePath = path.join(projSrc, indexJsStr);
	let fileContent = fs.readFileSync(filePath, "utf8");
	let physicsNameList = [];

	// if (fileContent.includes(bundleJsStr)) {
	let adapterJsPath = path.join(projSrc, bundleJsStr);
	physicsNameList.push(bundleJsStr);
	physicsLibsPathList.push(adapterJsPath);
	// }
	if (fs.existsSync(path.join(projSrc, "libs"))) {
		let libsList = fs.readdirSync(path.join(projSrc, "libs"));
		let libsFileName, libsFilePath;
		for (let i = 0, len = libsList.length; i < len; i++) {
			libsFileName = libsList[i];
			if (libsFileName === "min") continue;
			libsFilePath = path.join(projSrc, "libs", libsFileName);
			physicsNameList.push(`libs/${libsFileName}`);
			physicsLibsPathList.push(libsFilePath);
		}
	}
	if (fs.existsSync(path.join(projSrc, "libs", "min"))) {
		let minLibsList = fs.readdirSync(path.join(projSrc, "libs", "min"));
		let minLibsFileName, minLibsFilePath;
		for (let i = 0, len = minLibsList.length; i < len; i++) {
			minLibsFileName = minLibsList[i];
			minLibsFilePath = path.join(projSrc, "libs", "min", minLibsFileName);
			physicsNameList.push(`libs/min/${minLibsFileName}`);
			physicsLibsPathList.push(minLibsFilePath);
		}
	}

	// 修改配置文件
	configVivoConfigFile(physicsNameList);

	// 将物理库拷贝到engine中
	var stream = gulp.src(physicsLibsPathList, {base: projSrc});
	return stream.pipe(gulp.dest(path.join(projDir, "engine")));
});

function configVivoConfigFile(engineFileList, isAppend) {
	let vvConfigPath = path.join(projDir, "minigame.config.js");
	let content = fs.readFileSync(vvConfigPath, "utf8");
	let externalsStr = "";
	let libName;
	// let engineStr = '';
	let inLayaLibs = false, dirName, newLibPath;
	for (let i = 0, len = engineFileList.length; i < len; i++) {
		libName = engineFileList[i];
		if (i !== 0) {
			externalsStr += ',\n';
		}
		newLibPath = libName.replace("libs/min/", "").replace("libs/", "");
		inLayaLibs = config.uesEnginePlugin && fullRemoteEngineList.includes(newLibPath);
		dirName = inLayaLibs ? "laya-library" : "engine";
		if (inLayaLibs) {
			// engineStr += `{\n\t\tmodule_name:'${dirName}/${newLibPath}',\n\t\tmodule_path:'${dirName}/${newLibPath}',\n\t\tmodule_from:'${dirName}/${newLibPath}'\n\t},`;
			externalsStr += `\t{\n\t\tmodule_name:'${dirName}/${newLibPath}',\n\t\tmodule_path:'${dirName}/${newLibPath}',\n\t\tmodule_from:'${dirName}/${newLibPath}'\n\t}`;
		} else {
			externalsStr += `\t{\n\t\tmodule_name:'./${libName}',\n\t\tmodule_path:'./${libName}',\n\t\tmodule_from:'${dirName}/${libName}'\n\t}`;
		}
	}
	if (isAppend) { // 只有源码项目会走这个逻辑
		let oldExternalsReg = content.match(/const externals = (\[([^*].|\n|\r)*\])/);
		if (!oldExternalsReg) {
			throw new Error("源码项目适配vivo引擎插件，设置配置文件出错，请与服务提供商联系(code 3)!");
		}
		externalsStr = oldExternalsReg[1].replace(/\]$/, `,${externalsStr}\n]`);
		externalsStr = `const externals = ${externalsStr}`;
	} else {
		externalsStr = `const externals = [\n${externalsStr}\n]`;
	}
	content = content.replace(/const externals = \[([^*].|\n|\r)*\]/gm, externalsStr);
	fs.writeFileSync(vvConfigPath, content, "utf8");
}

gulp.task("dealNoCompile2_VIVO", ["dealNoCompile1_VIVO"], function() {
	if (!isDealNoCompile || physicsLibsPathList.length === 0) {
		return;
	}
	return del(physicsLibsPathList, { force: true });
});

gulp.task("pluginEngin_VIVO", ["dealNoCompile2_VIVO"], function(cb) {
	let manifestJsonPath = path.join(projSrc, "manifest.json");
	let manifestJsonContent = fs.readFileSync(manifestJsonPath, "utf8");
	let conJson = JSON.parse(manifestJsonContent);
	let copyBinPath;

	if (!config.uesEnginePlugin) { // 没有使用引擎插件，还是像以前一样发布
		delete conJson.plugins;
		manifestJsonContent = JSON.stringify(conJson, null, 4);
		fs.writeFileSync(manifestJsonPath, manifestJsonContent, "utf8");
		return cb();
	}
	// 将所有的min拷贝进来
	if (config.useMinJsLibs || true) {
		copyBinPath = path.join(workSpaceDir, "bin", "libs", "min");
	} else { // 如果不是min
		copyBinPath = path.join(workSpaceDir, "bin", "libs");
	}
	if (config.version) {
		let versionPath = projSrc + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = "libs.js";
	
	// 获取version等信息
	let coreLibPath = path.join(workSpaceDir, "bin", "libs", "laya.core.js");
	let isHasCoreLib = fs.existsSync(coreLibPath);
	let isOldAsProj = fs.existsSync(`${workSpaceDir}/asconfig.json`) && !isHasCoreLib;
	let EngineVersion = getEngineVersion();
	// if (isOldAsProj) {
	// 	console.log("as源码项目，无法使用引擎插件功能!");
	// 	return cb();
	// }
	// js/ts项目，如果没找到min目录，直接报错
	if (!fs.existsSync(`${projDir}/engine/libs/min`) && !isOldAsProj) {
		throw new Error("请使用压缩后的引擎并保持目录结构!");
	}
	if (isOldAsProj) {
		// 下载对应版本js引擎，按照普通项目走
		console.log(`as源码项目(${isOldAsProj})，开始处理引擎`);
		let engineNum = EngineVersion.split("beta")[0];
		let suffix = EngineVersion.includes("beta") ? `_beta${EngineVersion.split("beta")[1]}` : "";
		let engineURL;
		if (canUsePluginEngine(EngineVersion)) { // 1.8.11 开始，下载地址更新为 cos 服务器
			engineURL = `https://ldc-1251285021.cos.ap-shanghai.myqcloud.com/download/Libs/LayaAirJS_${engineNum}${suffix}.zip`;
		} else {
			engineURL = `http://ldc.layabox.com/download/LayaAirJS_${engineNum}${suffix}.zip`;
		}
		let engineDownPath = path.join(releaseDir, `LayaAirJS_${engineNum}${suffix}.zip`);
		let engineExtractPath = path.join(releaseDir, `LayaAirJS_${engineNum}${suffix}`);
		if (config.useMinJsLibs || true) {
			copyBinPath = path.join(engineExtractPath, "js", "libs", "min");
		} else { // 如果不是min
			copyBinPath = path.join(engineExtractPath, "js", "libs");
		}
		// 情况1) 如果已经下载过引擎了，直接开始处理引擎插件
		if (fs.existsSync(copyBinPath)) {
			console.log("情况1) 如果已经下载过引擎了，直接开始处理引擎插件");
			return dealPluginEngine().then(() => {
				// return cb();
			}).catch((err) => {
				console.error("ts源码项目及as源码项目，下载或处理vivo引擎插件项目失败(code 1)!");
				throw err;
			});
		}
		// 情况2) 下载并解压引擎，然后开始处理引擎插件
		console.log("情况2) 下载并解压引擎，然后开始处理引擎插件");
		return downFileToDir(engineURL, engineDownPath).then(() => {
			console.log("下载引擎库成功，开始解压");
			return extractZipFile(engineDownPath, engineExtractPath);
		}).then(() => {
			console.log("解压成功，开始处理引擎插件");
			return dealPluginEngine();
		}).then(() => {
			// return cb();
		}).catch((err) => {
			console.error("ts源码项目及as源码项目，下载或处理vivo引擎插件项目失败(code 2)!");
			throw err;
		})
	}
	// 情况3) 非源码项目，开始处理引擎插件
	console.log("情况3) 非源码项目，开始处理引擎插件");
	return dealPluginEngine().then(() => {
		// return cb();
	}).catch((err) => {
		throw err;
	});

	function dealPluginEngine() {
		// 使用引擎插件
		let localUseEngineList = [];
		let copyEnginePathList;
		return new Promise(function(resolve, reject) {
			console.log(`修改game.js和game.json`);
			// 1) 修改game.js和game.json
			// 修改game.js
			let gameJsPath = path.join(projSrc, "game.js");
			let gameJscontent = `require("@qgame/adapter");\nif(!window.navigator)\n\twindow.navigator = {};\nwindow.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 VVGame NetType/WIFI Language/zh_CN';\nrequirePlugin('layaPlugin');\nrequire("./libs.js");\nrequire("./code.js");`;
			fs.writeFileSync(gameJsPath, gameJscontent, "utf8");
			// 修改manifest.json，使其支持引擎插件
			conJson.plugins = {
				"laya-library": {
					"version": EngineVersion,
					"provider": "",
					"path": "laya-library"
				}
			}
			manifestJsonContent = JSON.stringify(conJson, null, 4);
			fs.writeFileSync(manifestJsonPath, manifestJsonContent, "utf8");
			resolve();
		}).then(function() {
			return new Promise(function(resolve, reject) {
				console.log(`确定用到的插件引擎`);
				// 2) 确定用到了那些插件引擎，并将插件引擎从index.js的引用中去掉
				let indexJsPath = path.join(projSrc, indexJsStr);
				let indexJsCon = fs.readFileSync(indexJsPath, "utf8");
				// 1.x这里会比较麻烦一些，需要处理不带min的情况
				// 处理引擎插件
				let minLibsPath = path.join(projSrc, "libs", "min");
				if (!isOldAsProj && !fs.existsSync(minLibsPath)) {
					fs.mkdirSync(minLibsPath);
				}
				let item, minItem;
				for (let i = 0, len = fullRemoteEngineList.length; i < len; i++) {
					minItem = fullRemoteEngineList[i];
					item = minItem.replace(".min.js", ".js");
					minFullRequireItem = `require("./libs/min/${minItem}")`;
					// fullRequireItem = `require("./libs/${item}")`;
					// 如果引用了未压缩的类库，将其重命名为压缩的类库，并拷贝到libs/min中
					// if (indexJsCon.includes(fullRequireItem)) {
					// 	let oldlibPath = path.join(projSrc, "libs", item);
					// 	let newlibPath = path.join(projSrc, "libs", minItem);
					// 	let newMinlibPath = path.join(projSrc, "libs", "min", minItem);
					// 	fs.renameSync(oldlibPath, newlibPath);
					// 	// fs.copyFileSync(newlibPath, newMinlibPath);
					// 	let con = fs.readFileSync(newlibPath, "utf8");
					// 	fs.writeFileSync(newMinlibPath, con, "utf8");
					// 	fs.unlinkSync(newlibPath);
					// 	localUseEngineList.push(minItem);
					// 	indexJsCon = indexJsCon.replace(fullRequireItem, "");
					// } else 
					if (indexJsCon.includes(minFullRequireItem)) { // 引用了min版类库
						localUseEngineList.push(minItem);
						indexJsCon = indexJsCon.replace(minFullRequireItem, "");
					}
				}
				// 源码项目需要特殊处理
				if (isOldAsProj) {
					indexJsCon = indexJsCon.replace(`require("./laya.js");`, "").replace(`require("./laya.js"),`, "").replace(`require("./laya.js")`, "");
					let layajsPath = path.join(projDir, "src", "laya.js");
					if (fs.existsSync(layajsPath)) {
						fs.unlinkSync(layajsPath);
					}
					indexJsCon = `require("./laya.vvmini.min.js");\n${indexJsCon}`;
					let item, libPath, vivoConfigList = [];
					for (let i = 0, len = fullRemoteEngineList.length; i < len; i++) {
						item = fullRemoteEngineList[i];
						libPath = path.join(copyBinPath, item);

						if (fs.existsSync(libPath)) {
							localUseEngineList.push(item);
							/*config.useMinJsLibs*/ true ?  vivoConfigList.push(`libs/min/${item}`) : vivoConfigList.push(`libs/${item}`);
						}
					}
					// let bundleJsStr = (versionCon && versionCon["js/bundle.js"]) ? versionCon["js/bundle.js"] :  "js/bundle.js";
					// vivoConfigList.push(bundleJsStr);
					configVivoConfigFile(vivoConfigList, true);

					// 特殊处理as项目的 laya.vvmini.min.js ，原因是没有其他地方引用，1.0比较特殊
					configVivoConfigFile(["laya.vvmini.min.js"], true);
					gulp.src(`${copyBinPath}/laya.vvmini.min.js`).pipe(gulp.dest(`${projDir}/engine`));
				}
				fs.writeFileSync(indexJsPath, indexJsCon, "utf8");
				// 再次修改game.js，仅引用使用到的类库
				let pluginCon = "", normalCon = "";
				localUseEngineList.forEach(function(item) {
					pluginCon += `\tqg.requirePlugin("laya-library/${item}");\n`;
					normalCon += `\trequire("laya-library/${item}");\n`;
				});
				let finalyPluginCon = `if (window.requirePlugin) {\n${pluginCon}\n} else {\n${normalCon}\n}`;
				let gameJsPath = path.join(projSrc, "game.js");
				let gameJsCon = fs.readFileSync(gameJsPath, "utf8");
				gameJsCon = gameJsCon.replace(`requirePlugin('layaPlugin');`, finalyPluginCon);
				fs.writeFileSync(gameJsPath, gameJsCon, "utf8");
				resolve();
			});
		}).then(function() {
			return new Promise(function(resolve, reject) {
				console.log(`将本地的引擎插件移动到laya-libs中`);
				// 3) 将本地的引擎插件移动到laya-libs中
				copyEnginePathList = [`${copyBinPath}/{${fullRemoteEngineList.join(",")}}`];
				gulp.src(copyEnginePathList).pipe(gulp.dest(`${projDir}/laya-library`));
				setTimeout(resolve, 500);
			});
		}).then(function() {
			return new Promise(function(resolve, reject) {
				console.log(`将libs中的本地引擎插件删掉`);
				// 4) 将libs中的本地引擎插件删掉
				let deleteList = [`${projDir}/engine/libs/min/{${localUseEngineList.join(",")}}`];
				del(deleteList, { force: true }).then(resolve);
			});
		}).then(function() {
			return new Promise(async function(resolve, reject) {
				console.log(`完善引擎插件目录`);
				// 5) 引擎插件目录laya-libs中还需要新建几个文件，使该目录能够使用
				let 
					layalibsPath = path.join(projDir, "laya-library"),
					engineIndex = path.join(layalibsPath, "index.js"),
					engineplugin = path.join(layalibsPath, "plugin.json");
					// enginesignature = path.join(layalibsPath, "signature.json");
				// index.js
				if (!fs.existsSync(layalibsPath)) {
					throw new Error("引擎插件目录创建失败，请与服务提供商联系!");
				}
				let layaLibraryList = fs.readdirSync(layalibsPath);
				let indexCon = "";
				layaLibraryList.forEach(function(item) {
					if (!["index.js", "plugin.json"].includes(item)) {
						indexCon += `require("./${item}");\n`;
					}
				});
				fs.writeFileSync(engineIndex, indexCon, "utf8");
				// plugin.json
				let pluginCon = {"main": "index.js"};
				fs.writeFileSync(engineplugin, JSON.stringify(pluginCon, null, 4), "utf8");
				// signature.json
				// let signatureCon = {
				// 	"provider": provider,
				// 	"signature": []
				// };
				// localUseEngineList.unshift("index.js");
				// let fileName, md5Str;
				// for (let i = 0, len = localUseEngineList.length; i < len; i++) {
				// 	fileName = localUseEngineList[i];
				// 	let md5Str = await getFileMd5(path.join(releaseDir, "laya-libs", fileName));
				// 	signatureCon.signature.push({
				// 		"path": fileName,
				// 		"md5": md5Str
				// 	});
				// }
				// fs.writeFileSync(enginesignature, JSON.stringify(signatureCon, null, 4), "utf8");
				resolve();
			});
		}).catch(function(e) {
			throw e;
		})
	}
});

function downFileToDir(uri, dest){
	return new Promise((resolve, reject) => {
		if (!uri || !dest) {
			reject(new Error(`downFileToDir 参数不全: ${uri}/${dest}`));
			return;
		}

		let 
			totalLen = 9999,
			progress = 0,
			layaresponse;
		var stream = fs.createWriteStream(dest);
		request(uri).on('error', function(err) {
			console.log("tool down err:" + err);
			reject(err);
		}).on("data", function(data) {
			progress += data.length;
			let downPercent = (progress / totalLen * 100).toFixed(3);
			// console.log(`down: ${downPercent}%`);
		}).on("response", function(response) {
			layaresponse = response;
			totalLen = response.caseless.dict['content-length'];
		}).pipe(stream).on('close', function() {
			if (layaresponse.statusCode == 200) {
				console.log("下载成功!");
				resolve();
			} else {
				reject(new Error(`下载失败，连接关闭 -> ${uri}`));
			}
		});
	});
}

function extractZipFile(zipPath, extractDir) {
	return new Promise((resolve, reject) => {
		if (!zipPath || !extractDir) {
			reject(new Error(`extractZipFile 参数不全: ${zipPath}/${extractDir}`));
			return false;
		}

		zipPath = `"${zipPath}"`;
		let unzipexepath = path.join(ideModuleDir, "../", "out", "codeextension", "updateversion", "tools", "unzip.exe");
		unzipexepath = `"${unzipexepath}"`;
		let cmd;
        if (process.platform === 'darwin') {
            cmd = "unzip -o " + zipPath + " -d " + "\"" + extractDir + "\"";
        } else {
            cmd = unzipexepath + " -o " + zipPath + " -d " + "\"" + extractDir + "\"";
		}
		childProcess.exec(cmd, (error, stdout, stderr) => {
			if (error || stderr) {
				reject(error || stderr);
				return;
			}
			resolve();
		});
	});
}

function canUsePluginEngine(version) {
	const minVersionNum = "1.8.11";
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

// 打包rpk
gulp.task("buildRPK_VIVO", ["pluginEngin_VIVO"], function() {
	// 在vivo轻游戏项目目录中执行:
    // npm run build || npm run release
    let cmdStr = "build";
    if (config.vivoInfo.useReleaseSign) {
        cmdStr = "release";
    }
	return new Promise((resolve, reject) => {
		let cmd = `npm${commandSuffix}`;
		let args = ["run", cmdStr];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn(`npx${commandSuffix}`, ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			console.log(`stderr(iconv): ${iconv.decode(data, 'gbk')}`);
			
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			// rpk是否生成成功
			let distRpkPath = path.join(projDir, "dist", `${config.vivoInfo.package}${config.vivoInfo.useReleaseSign ? ".signed" : ""}.rpk`);
			if (!fs.existsSync(distRpkPath)) {
				throw new Error("rpk生成失败，请检查！");
			}
			resolve();
		});
	});
});

gulp.task("showQRCode_VIVO", ["buildRPK_VIVO"], function() {
	// 在vivo轻游戏项目目录中执行:
	// npm run server
	return new Promise((resolve, reject) => {
		let cmd = `npm${commandSuffix}`;
		let args = ["run", "server"];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn(`npx${commandSuffix}`, ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`${data}`);
			// 输出pid，macos要用: macos无法kill进程树，也无法执行命令获取3000端口pid(没有查询权限)，导致无法kill这个进程
			console.log('vv_qrcode_pid:' + cp.pid);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			console.log(`stderr(iconv): ${iconv.decode(data, 'gbk')}`);
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});


gulp.task("buildVivoProj", ["showQRCode_VIVO"], function() {
	console.log("all tasks completed");
});