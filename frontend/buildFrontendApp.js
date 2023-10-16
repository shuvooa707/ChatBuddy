import fs from "fs";
import path from "path";


async function main() {
	let jsFileList = fs.readdirSync("./build/assets/");
	let jsFile = `<script type="module">` + fs.readFileSync("./build/assets/" + jsFileList[0], "utf-8") + `</script>`;
	let indexFile = fs.readFileSync("./build/index.html", "utf-8");
	const newText = indexFile
					  .replace(/\<script type="module" .*\>.*\<\/script\>/g, jsFile)
					  .replace(/"/g, "'");

	fs.writeFileSync("./build/index.html", newText);
	console.log(newText);

}main();