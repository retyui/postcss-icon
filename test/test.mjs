import { expect } from "chai";
import postcss from "postcss";
import postcssIcon from "../lib/index";


function clearStr(str) {
	return str.replace(/\s/g, "");
}

function test({ input, output, done, plugins, clearCss = true }) {
	postcss(plugins)
		.process(input)
		.then(({ css }) => {
			// // console.log('\n',css,'\n')
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

			expect(css)
				.to
				.eql(output);
			done();
		});
}

const exampleData = [
	{
		type: 'css',
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
		type: 'css',
		prefix: "vendor-",
		data: {
			mail: [".extend { display: inline-block; }"]
		}
	},
	{
		type: 'css',
		prefix: "vendor2-",
		data: {
			next: [
				".extend::after, .extend::before { content: \"\"; pointer-events: none; }",
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
		// console.log('\n1\n');
		const testOpt = {
			output,
			plugins: postcssIcon({ custom: exampleData[0] })
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
			// console.log('\n2\n');
			test({
				input: ".icon.mail { @icon: dubl-mail; }",
				output: `
					.icon.mail {
						display: inline-block;
					}
				`,
				plugins: postcssIcon({
						custom1: {
							...exampleData[1],
							prefix: "dubl-"
						},
						custom2: {
							...exampleData[0],
							prefix: "dubl-"
						}
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
					custom: {
						...exampleData[2],
						prefix: ""
					}
				}),
				done
			});
		});
		it("check custom prefix", done => {
			test({
				input: ".icon.next { @icon: custom-next; }",
				output: outputDataNext,
				plugins: postcssIcon({
					custom: {
						...exampleData[2],
						prefix: "custom-"
					}
				}),
				done
			});
		});
	});
	describe("Extend", () => {
		const clearCss = css =>
			css
				.replace(/[\n\t]/g, "")
				.replace(/{\s/g, "{")
				.replace(/\s}/g, "}");
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
				plugins: postcssIcon({ custom: exampleData[1] }),
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
					custom: {
						type: 'css',
						prefix: "",
						data: {
							mail: [
								".extend{ color: gold; }",
								".extend,.extend span { position: relative; }",
								".extend::before, .extend:after { position: absolute; }",
								".extend { background: red; }"
							]
						}
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
		describe("object", () => {
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
						plugins: postcssIcon({ custom: exampleData[0] }),
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
						plugins: postcssIcon({
							c: exampleData[0],
							c1: exampleData[1],
							c2: exampleData[2]
						}),
						done
					});
				});
			});
		});
	});

	it("Madia Query", done => {
		test({
			plugins: postcssIcon({name:exampleData[2]}),
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
