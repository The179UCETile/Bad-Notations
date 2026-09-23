let doesSupportTemporal = typeof Temporal == "object";
function format(e) {
	console.clear();
	let output = "";
	for (let i in BadNotations) {
		let t = doesSupportTemporal ? Temporal.Now.instant() : performance.now();
		let fmt = BadNotations[i].format(new Decimal(e));
		output += `${BadNotations[i].name}: ${fmt}<br>\n`;
		console.log(`${BadNotations[i].name}: ${fmt} (${doesSupportTemporal ? Temporal.Now.instant().since(t).total("milliseconds") : (performance.now() - t).toFixed(3)}ms)`)
	}
	document.getElementById("results").innerHTML = output;
}
document.getElementById("num").addEventListener("input", () => {
	format(document.getElementById("num").value)
});
format("1");