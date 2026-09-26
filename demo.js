let doesSupportTemporal = typeof Temporal == "object";
function formatOne(name, num, config, forceName) {
	let t = doesSupportTemporal ? Temporal.Now.instant() : performance.now();
	let fmt = BadNotations[name].format(new Decimal(num), config);
	console.log(`${forceName ?? BadNotations[name].name}: ${fmt} (${doesSupportTemporal ? Temporal.Now.instant().since(t).total("milliseconds") : (performance.now() - t).toFixed(3)}ms)`)
	return `${forceName ?? BadNotations[name].name}: ${fmt}<br>\n`;
}
function format(e) {
	console.clear();
	let output = "";
	for (let i in BadNotations) {
		if (i == "ParenthesesMagnitude") {
			output += formatOne(i, e);
			output += formatOne(i, e, {base: "2"}, "Parentheses magnitude notation (Base 2)");
			output += formatOne(i, e, {base: "3"}, "Parentheses magnitude notation (Base 3)");
			output += formatOne(i, e, {base: "1000"}, "Parentheses magnitude notation (Base 1,000)")
		} else {
			output += formatOne(i, e)
		}
	}
	document.getElementById("results").innerHTML = output;
}
document.getElementById("num").addEventListener("input", () => {
	format(document.getElementById("num").value)
});
format("1");