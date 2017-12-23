import { expect } from "chai";
import postcss from "postcss";
import postcssIcon from "../dist/index";
import { objectMap } from "../dist/utils.js";

function clearStr(str) {
	return str.replace(/\s/g, "");
}

function test({ input, output, done, plugins, clearCss = true }) {
	postcss(plugins)
		.process(input)
		.then(({ css }) => {
			// console.log('\n',css,'\n')
			css =
				clearCss === true
					? clearStr(css)
					: typeof clearCss === "function" ? clearCss(css) : css;
			output =
				clearCss === true
					? clearStr(output)
					: typeof clearCss === "function"
						? clearCss(output)
						: output;

			expect(css).to.eql(output);
			done();
		});
}

const exampleData = [
	{
		prefix: "",
		data: {
			mail: [
				".extend::after { color: gold; }",
				".extend { width: 28px; height: 18px; }",
				".extend::before { position: absolute; }",
				".extend { box-sizing: border-box; }"
			]
		}
	},
	{
		prefix: "vendor-",
		data: {
			mail: [".extend { display: inline-block; }"]
		}
	},
	{
		prefix: "vendor2-",
		data: {
			next: [
				'.extend::after, .extend::before { content: ""; pointer-events: none; }',
				".extend { box-sizing: border-box; }"
			]
		}
	}
];

describe("postcss-icon", () => {
	describe("Syntax", () => {
		const output = `
			.icon.mail::after {
				color: gold;
			}
			.icon.mail::before {
				position: absolute;
			}
			.icon.mail {
				width: 28px;
				height: 18px;
				box-sizing: border-box;
			}`;
		const testOpt = {
			output,
			plugins: postcssIcon([exampleData[0]])
		};
		it("@icon: name;", done => {
			test({
				...testOpt,
				input: ".icon.mail { @icon: mail; }",
				done
			});
		});
		it("@icon name;", done => {
			test({
				...testOpt,
				input: ".icon.mail { @icon: mail; }",
				done
			});
		});
		it("@icon: 'name';", done => {
			test({
				...testOpt,
				input: ".icon.mail { @icon: mail; }",
				done
			});
		});
		it("@icon 'name';", done => {
			test({
				...testOpt,
				input: ".icon.mail { @icon: mail; }",
				done
			});
		});
	});
	describe("Prefix", () => {
		const outputDataNext = `
			.icon.next::after,
			.icon.next::before {
				content: "";
				pointer-events: none;
			}
			.icon.next {
				box-sizing: border-box;
			}
			`;
		it("check dublicated", done => {
			test({
				input: ".icon.mail { @icon: dubl-mail; }",
				output: `
					.icon.mail {
						display: inline-block;
					}
				`,
				plugins: postcssIcon(
					{
						...exampleData[1],
						prefix: "dubl-"
					},
					{
						...exampleData[0],
						prefix: "dubl-"
					}
				),
				done
			});
		});

		it("check empty prefix", done => {
			test({
				input: ".icon.next { @icon: next; }",
				output: outputDataNext,
				plugins: postcssIcon({
					...exampleData[2],
					prefix: ""
				}),
				done
			});
		});
		it("check custom prefix", done => {
			test({
				input: ".icon.next { @icon: custom-next; }",
				output: outputDataNext,
				plugins: postcssIcon({
					...exampleData[2],
					prefix: "custom-"
				}),
				done
			});
		});
	});
	describe("Extend", () => {
		const clearCss = css =>
			css
				.replace(/[\n\t]/g, "")
				.replace(/\{\s/g, "{")
				.replace(/\s\}/g, "}");
		it("current props", done => {
			test({
				clearCss,
				input: `
				.icon.next {
					display: block;
					@icon: vendor-mail;
				}
				`,
				output: `
				.icon.next {
					 display: inline-block;
					display: block;
				}
				`,
				plugins: postcssIcon(exampleData[1]),
				done
			});
		});
		it("&::after , &::before, & span", done => {
			test({
				clearCss,
				input: `
				.icon {
					color: blue;
					@icon: mail;
				}
				`,
				output: `
				.icon,
				.icon span {
					 position: relative;
				}
				.icon::before,
				.icon:after {
					 position: absolute;
				}
				.icon {
					 color: gold;
					 background: red;
					color: blue;
				}
				`,
				plugins: postcssIcon({
					prefix: "",
					data: {
						mail: [
							".extend{ color: gold; }",
							".extend,.extend span { position: relative; }",
							".extend::before, .extend:after { position: absolute; }",
							".extend { background: red; }"
						]
					}
				}),
				done
			});
		});
	});
	describe("Options", () => {
		it("empty", done => {
			test({
				input: ".icon.mail { @icon: mail; }",
				output: ".icon.mail { /* @icon: mail */ }",
				plugins: postcssIcon(),
				done
			});
		});
		describe("array", () => {
			describe("", () => {
				it("length === 1", done => {
					test({
						input: ".icon.mail { @icon: mail; }",
						output: `
						.icon.mail::after {
							color: gold;
						}
						.icon.mail::before {
							position: absolute;
						}
						.icon.mail {
							width: 28px;
							height: 18px;
							box-sizing: border-box;
						}`,
						plugins: postcssIcon([exampleData[0]]),
						done
					});
				});
				it("length > 1", done => {
					test({
						input:
							".icon.mail { @icon: mail; }.icon.404 { @icon: '400'; }",
						output: `
						.icon.mail::after {
							color: gold;
						}
						.icon.mail::before {
							position: absolute;
						}
						.icon.mail {
							width: 28px;
							height: 18px;
							box-sizing: border-box;
						}
						.icon.404{
							/* @icon: '400' */
						}
							`,
						plugins: postcssIcon([
							exampleData[0],
							exampleData[1],
							exampleData[2]
						]),
						done
					});
				});
			});
		});
		describe("arguments", () => {
			describe("", () => {
				it("length === 1", done => {
					test({
						input: ".icon.mail { @icon: vendor-mail; }",
						output: `.icon.mail {
							display: inline-block;
						}`,
						plugins: postcssIcon(exampleData[1]),
						done
					});
				});
				it("length > 1", done => {
					test({
						input:
							".icon.mail { @icon: mail; } .icon.next { @icon: vendor2-next; } .icon.404 { @icon: '400'; }",
						output: `
						.icon.mail::after {
							color: gold;
						}
						.icon.mail::before {
							position: absolute;
						}
						.icon.mail {
							width: 28px;
							height: 18px;
							box-sizing: border-box;
						}
						.icon.next::after,
						.icon.next::before {
							content: "";
							pointer-events: none;
						}
						.icon.next {
							box-sizing: border-box;
						}
						.icon.404 {
							/* @icon: '400' */
						}
						`,
						plugins: postcssIcon(
							exampleData[0],
							exampleData[1],
							exampleData[2]
						),
						done
					});
				});
			});
		});
	});

	it("Madia Query", done => {
		test({
			plugins: postcssIcon(exampleData[2]),
			input: `
				.icon2 {
					@icon: vendor2-next;
				}
				@media(max-width: 767px){
					.icon {
						@icon: vendor2-next;
					}
				}
			`,
			output: `
			.icon2::after,
			.icon2::before {
				content: "";
				pointer-events: none;
			}
			.icon2 {
				box-sizing: border-box;
			}
			@media(max-width: 767px) {
				.icon::after, .icon::before {
					content: "";
					pointer-events: none;
				}
				.icon {
					box-sizing: border-box;
				}
			}
			`,
			done
		});
	});
});
