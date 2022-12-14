// v1.8.3
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

let commandSuffix = ".cmd";

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
	if (!fs.existsSync(filePath)) {
		let fileContent = `window.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 OPPO MiniGame NetType/WIFI Language/zh_CN';
	require("libs.js");\nrequire("code.js");`;
		fs.writeFileSync(filePath, fileContent, "utf8");
	}

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

// 打包rpk
gulp.task("buildRPK_OPPO", ["version_OPPO"], function() {
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
	if (!config.oppoInfo.oppoDebug) {
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