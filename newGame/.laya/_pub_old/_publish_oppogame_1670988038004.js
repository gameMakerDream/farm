// v1.9.1
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_oppogame.js", "").replace("/.laya/publish_oppogame.js", "") + "/" : "./../";

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
const iconv =  require(ideModuleDir + "iconv-lite");
const request = require(ideModuleDir + "request");

let commandSuffix = ".cmd";
const fullRemoteEngineList = ["laya.core.min.js", "laya.webgl.min.js", "laya.ui.min.js", "laya.tiledmap.min.js", 
		"laya.pathfinding.min.js", "laya.particle.min.js", "laya.html.min.js", "laya.filter.min.js", "laya.device.min.js",
		"laya.ani.min.js", "laya.d3.min.js", "laya.d3Plugin.min.js"];

let 
    config,
	releaseDir,
    toolkitPath,
    tempReleaseDir, // OPPO临时拷贝目录
	projDir; // OPPO快游戏工程目录
let versionCon; // 版本管理version.json
let adbPath = "adb",
	opensslPath = "openssl";
// 创建OPPO项目前，拷贝OPPO引擎库、修改index.js
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_OPPO", function(cb) {
	let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
	let content = fs.readFileSync(pubsetPath, "utf8");
	let pubsetJson = JSON.parse(content);
	releaseDir = path.join(workSpaceDir, "release", "oppogame").replace(/\\/g, "/");
	releaseDir = tempReleaseDir = path.join(releaseDir, "temprelease");
	config = pubsetJson[5]; // 只用到了 config.oppoInfo|config.oppoSign
    toolkitPath = path.join(ideModuleDir, "../", "out", "layarepublic", "oppo", "quickgame-toolkit");
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	let layarepublicPath = path.join(ideModuleDir, "../", "out", "layarepublic");

	// 检查环境中是否存在adb和openssl
	let otherLibsPath = path.join(layarepublicPath, "../", "vs", "layaEditor", "libs");
	childProcess.exec("adb version", (error, stdout, stderr) => {
		if (error) {
			if (process.platform === "darwin") {
				adbPath = path.join(otherLibsPath, "adb", "darwin", "adb");
			} else {
				adbPath = path.join(otherLibsPath, "adb", "win", "adb.exe");
			}
			adbPath = `"${adbPath}"`;
		}
		global.adbPath = adbPath;
		if (global.opensslPath) {
			cb();
		}
	});
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
		global.opensslPath = opensslPath;
		if (global.adbPath) {
			cb();
		}
	});
});

// 新建OPPO项目-OPPO项目与其他项目不同，需要安装OPPO quickgame node_modules，并打包成.rpk文件
gulp.task("installModules_OPPO", ["preCreate_OPPO"], function() {
	releaseDir = path.dirname(releaseDir);
	projDir = path.join(releaseDir, config.oppoInfo.projName);
    // 如果IDE里对应OPPO包已经install node_modules了，忽略这一步
    if (fs.existsSync(path.join(toolkitPath, "node_modules"))) {
        return;
    }
	// 安装OPPO quickgame node_modules
	return new Promise((resolve, reject) => {
		console.log("开始安装OPPO quickgame node_modules，请耐心等待...");
		let cmd = `npm${commandSuffix}`;
		let args = ["install"];
        let opts = {
			cwd: toolkitPath,
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
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

// 拷贝文件到OPPO快游戏
gulp.task("copyFileToProj_OPPO", ["installModules_OPPO"], function() {
	// 将临时文件夹中的文件，拷贝到项目中去
	let originalDir = `${tempReleaseDir}/**/*.*`;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projDir)));
});

// 拷贝icon到OPPO快游戏
gulp.task("copyIconToProj_OPPO", ["copyFileToProj_OPPO"], function() {
	let originalDir = config.oppoInfo.icon;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projDir)));
});

// 清除OPPO快游戏临时目录
gulp.task("clearTempDir_OPPO", ["copyIconToProj_OPPO"], function() {
	// 删掉临时目录
	return del([tempReleaseDir], { force: true });
});

// 生成release签名(私钥文件 private.pem 和证书文件 certificate.pem )
gulp.task("generateSign_OPPO", ["clearTempDir_OPPO"], function() {
    if (!config.oppoSign.generateSign) {
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
				cp.stdin.write(`${config.oppoSign.countryName}\n`);
				console.log(`Country Name: ${config.oppoSign.countryName}`);
			} else if (data.includes("Province Name")) {
				cp.stdin.write(`${config.oppoSign.provinceName}\n`);
				console.log(`Province Name: ${config.oppoSign.provinceName}`);
			} else if (data.includes("Locality Name")) {
				cp.stdin.write(`${config.oppoSign.localityName}\n`);
				console.log(`Locality Name: ${config.oppoSign.localityName}`);
			} else if (data.includes("Organization Name")) {
				cp.stdin.write(`${config.oppoSign.orgName}\n`);
				console.log(`Organization Name: ${config.oppoSign.orgName}`);
			} else if (data.includes("Organizational Unit Name")) {
				cp.stdin.write(`${config.oppoSign.orgUnitName}\n`);
				console.log(`Organizational Unit Name: ${config.oppoSign.orgUnitName}`);
			} else if (data.includes("Common Name")) {
				cp.stdin.write(`${config.oppoSign.commonName}\n`);
				console.log(`Common Name: ${config.oppoSign.commonName}`);
			} else if (data.includes("Email Address")) {
				cp.stdin.write(`${config.oppoSign.emailAddr}\n`);
				console.log(`Email Address: ${config.oppoSign.emailAddr}`);
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
gulp.task("copySignFile_OPPO", ["generateSign_OPPO"], function() {
    if (config.oppoSign.generateSign) { // 新生成的签名
        // 移动签名文件到项目中（Laya & OPPO快游戏项目中）
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
    } else if (config.oppoInfo.useReleaseSign && !config.oppoSign.generateSign) { // 使用release签名，并且没有重新生成
        // 从项目中将签名拷贝到OPPO快游戏项目中
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

gulp.task("deleteSignFile_OPPO", ["copySignFile_OPPO"], function() {
	if (config.oppoSign.generateSign) { // 新生成的签名
		let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
		return del([privatePem, certificatePem], { force: true });
	}
});

gulp.task("modifyFile_OPPO", ["deleteSignFile_OPPO"], function() {
	// 修改manifest.json文件
	let manifestPath = path.join(projDir, "manifest.json");
	let IDEManifestPath = path.join(toolkitPath, "tpl", "manifest.json");
	if (!fs.existsSync(IDEManifestPath) && !fs.existsSync(manifestPath)) {
		return;
	}
	let manifestContent;
	if (fs.existsSync(manifestPath)) {
		manifestContent = fs.readFileSync(manifestPath, "utf8");
	} else {
		manifestContent = fs.readFileSync(IDEManifestPath, "utf8");
	}
	let manifestJson = JSON.parse(manifestContent);
	manifestJson.package = config.oppoInfo.package;
	manifestJson.name = config.oppoInfo.name;
	manifestJson.orientation = config.oppoInfo.orientation;
	manifestJson.config.logLevel = config.oppoInfo.logLevel || "off";
	manifestJson.versionName = config.oppoInfo.versionName;
	manifestJson.versionCode = config.oppoInfo.versionCode;
	manifestJson.minPlatformVersion = config.oppoInfo.minPlatformVersion;
	manifestJson.icon = `./${path.basename(config.oppoInfo.icon)}`;
	if (config.oppoInfo.subpack) {
		manifestJson.subpackages = config.oppoSubpack;
	}
	fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 4), "utf8");

	if (config.version) {
		let versionPath = projDir + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// OPPO项目，修改main.js
	let filePath = path.join(projDir, "main.js");
	let fileContent;
	if (!fs.existsSync(filePath)) {
		fileContent = `window.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 OPPO MiniGame NetType/WIFI Language/zh_CN';
	require("libs.js");\nrequire("code.js");`;
	} else {
		// 额外的，如果有引擎插件相关代码，需要删掉
		fileContent = fs.readFileSync(filePath, "utf8");
		fileContent = fileContent.replace(/if\s\(window\.requirePlugin\)\s{\n[\w\"\.\-\/\(\);\s\n]+\n}\selse\s{\n[\w\"\.\-\/\(\);\s\n]+\n}\n/gm, "");
	}
	fs.writeFileSync(filePath, fileContent, "utf8");

	// OPPO项目，修改index.js
	// let indexFilePath = path.join(projDir, indexJsStr);
	// if (!fs.existsSync(indexFilePath)) {
	// 	return;
	// }
	// let indexFileContent = fs.readFileSync(indexFilePath, "utf8");
	// indexFileContent = indexFileContent.replace(/loadLib(\(['"])/gm, "require$1./");
	// fs.writeFileSync(indexFilePath, indexFileContent, "utf8");
});

gulp.task("version_OPPO", ["modifyFile_OPPO"], function () {
	if (config.version) {
		let versionPath = projDir + "/version.json";
		let mainJSPath = projDir + "/main.js";
		let srcList = [versionPath, mainJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(projDir));
	}
});

gulp.task("pluginEngin_OPPO", ["version_OPPO"], function(cb) {
	let manifestJsonPath = path.join(projDir, "manifest.json");
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
		let versionPath = projDir + "/version.json";
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
	if (!fs.existsSync(`${projDir}/libs/min`) && !isOldAsProj) {
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
				console.error("ts源码项目及as源码项目，下载或处理oppo引擎插件项目失败(code 1)!");
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
			console.error("ts源码项目及as源码项目，下载或处理oppo引擎插件项目失败(code 2)!");
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
			console.log(`修改main.js和manifest.json`);
			// 1) 修改main.js和manifest.json
			// 修改main.js
			let gameJsPath = path.join(projDir, "main.js");
			let gameJscontent = `window.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 OPPO MiniGame NetType/WIFI Language/zh_CN';\nrequirePlugin('layaPlugin');\nrequire("libs.js");\nrequire("code.js");`;
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
				let indexJsPath = path.join(projDir, indexJsStr);
				let indexJsCon = fs.readFileSync(indexJsPath, "utf8");
				// 1.x这里会比较麻烦一些，需要处理不带min的情况
				// 处理引擎插件
				let minLibsPath = path.join(projDir, "libs", "min");
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
					// 	let oldlibPath = path.join(projDir, "libs", item);
					// 	let newlibPath = path.join(projDir, "libs", minItem);
					// 	let newMinlibPath = path.join(projDir, "libs", "min", minItem);
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
					let item, libPath/*, oppoConfigList = []*/;
					for (let i = 0, len = fullRemoteEngineList.length; i < len; i++) {
						item = fullRemoteEngineList[i];
						libPath = path.join(copyBinPath, item);

						if (fs.existsSync(libPath)) {
							localUseEngineList.push(item);
							// /*config.useMinJsLibs*/ true ?  oppoConfigList.push(`libs/min/${item}`) : oppoConfigList.push(`libs/${item}`);
						}
					}
					// let bundleJsStr = (versionCon && versionCon["js/bundle.js"]) ? versionCon["js/bundle.js"] :  "js/bundle.js";
					// oppoConfigList.push(bundleJsStr);
					// configoppoConfigFile(oppoConfigList, true);

					// 特殊处理as项目的 laya.vvmini.min.js ，原因是没有其他地方引用，1.0比较特殊
					// configoppoConfigFile(["laya.vvmini.min.js"], true);
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
				let gameJsPath = path.join(projDir, "main.js");
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
gulp.task("buildRPK_OPPO", ["pluginEngin_OPPO"], function() {
	// 在OPPO轻游戏项目目录中执行:
    // quickgame pack || quickgame pack release
    // quickgame subpack --no-build-js || quickgame subpack release --no-build-js
	let cmdStr = "";
	let packStr = "pack";
	let nobuildjs = "";
	if (config.oppoInfo.subpack) {
		packStr = "subpack";
		nobuildjs = "--no-build-js";
	}
    if (config.oppoInfo.useReleaseSign) {
        cmdStr = "release";
    }
	return new Promise((resolve, reject) => {
		let cmd = path.join(toolkitPath, "lib", "bin", `quickgame${commandSuffix}`);
		let args = [packStr, cmdStr, nobuildjs];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(`"${cmd}"`, args, opts);
		// let cp = childProcess.spawn('npx.cmd', ['-v']);
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
			let distRpkPath = path.join(projDir, "dist", `${config.oppoInfo.package}${config.oppoInfo.useReleaseSign ? ".signed" : ""}.rpk`);
			if (!fs.existsSync(distRpkPath)) {
				throw new Error("rpk生成失败，请检查！");
			}
			resolve();
		});
	});
});

gulp.task("pushRPK_OPPO", ["buildRPK_OPPO"], function() {
	if (!config.oppoInfo.adbDebug) {
        return;
    }
	// 在OPPO轻游戏项目目录中执行:
    // adb push dist/game.rpk sdcard/games
	// adb push idePath/resources/app/out/layarepublic/oppo/instant_app_settings.properties
	// adb shell am start -n com.nearme.instant.platform/com.oppo.autotest.main.InstantAppActivity
	return new Promise((resolve, reject) => {
		let cmd = `${adbPath}`;
		let sdGamesPath = config.oppoInfo.subpack ? "sdcard/subPkg" : "sdcard/games";
		let args = ["push", `dist/${config.oppoInfo.package}${config.oppoInfo.useReleaseSign ? ".signed" : ""}.rpk`, sdGamesPath];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn('npx.cmd', ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`1) push_RPK 子进程退出码：${code}`);
			resolve();
		});
	}).then(() => {
		return new Promise((resolve, reject) => {
			// 如果是分包，需要修改里面的内容
			let oppoPropPath = path.join(ideModuleDir, "../", `/out/layarepublic/oppo/instant_app_settings.properties`);
			if (config.oppoInfo.subpack) {
				fs.writeFileSync(oppoPropPath, "default_tab_index=4", "utf8");
			} else {
				fs.writeFileSync(oppoPropPath, "default_tab_index=2", "utf8");
			}
			let cmd = `${adbPath}`;
			let args = ["push", oppoPropPath, "sdcard/"];
			let opts = {
				cwd: projDir,
				shell: true
			};
			let cp = childProcess.spawn(cmd, args, opts);
			// let cp = childProcess.spawn('npx.cmd', ['-v']);
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`2) push_RPK 子进程退出码：${code}`);
				resolve();
			});
		});
	}).then(() => {
		return new Promise((resolve, reject) => {
			let cmd = `${adbPath}`;
			let args = ["shell", "am", "start", "-n", "com.nearme.instant.platform/com.oppo.autotest.main.InstantAppActivity"];
			let opts = {
				cwd: projDir,
				shell: true
			};
			let cp = childProcess.spawn(cmd, args, opts);
			// let cp = childProcess.spawn('npx.cmd', ['-v']);
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`3) push_RPK 子进程退出码：${code}`);
				resolve();
			});
		});
	});
});

gulp.task("buildOPPOProj", ["pushRPK_OPPO"], function() {
	console.log("all tasks completed");
});