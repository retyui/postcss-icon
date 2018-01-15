class FsWathc {
	constructor(w) {
		this.w = w;
		this.isStarted = false;
		this.wather = {};
	}
	startWathc() {
		if (!this.isStarted) {
			this.isStarted = true;
			this.wather = require("fs").watch(
				this.w,
				{ encoding: "buffer" },
				(eventType, filename) => {
					console.log(
						`fs.watch: ${eventType} ${
							filename
								? filename.toString("utf8").replace(cwd, "")
								: ""
						}`
					);
				}
			);
		}
	}
	close() {
		if (this.wather && this.wather.close) {
			this.wather.close();
			this.isStarted = false;
		}
	}
}

const counter = {
	getN(key) {
		if (this[key] === undefined) {
			this[key] = 0;
		}
		return ++this[key];
	}
};

const cwd = process.cwd();

module.exports = compiler => {
	compiler.plugin("invalid", (file, time) => {
		console.log(
			`on invalid ${("0" + counter.getN("invalid")).slice(
				-2
			)}: ${JSON.stringify({
				file: file.replace(cwd, ""),
				time
			})}`
		);
	});

	const tmpWather = new FsWathc("./src/icon-fonts/");
	tmpWather.startWathc();
	compiler.plugin("done", () => {
		tmpWather.close();
	});
};
