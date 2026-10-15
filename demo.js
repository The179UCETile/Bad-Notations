let doesSupportTemporal = typeof Temporal == "object";
let activeTab = 0;
function formatOne(name, num, config, forceName) {
	let t = doesSupportTemporal ? Temporal.Now.instant() : performance.now();
	let fmt = BadNotations[name].format(new Decimal(num), config);
	console.log(`${forceName ?? BadNotations[name].name}: ${fmt} (${doesSupportTemporal ? Temporal.Now.instant().since(t).total("milliseconds") : (performance.now() - t).toFixed(3)}ms)`)
	return `${forceName ?? BadNotations[name].name}: ${fmt}`;
}
function format(e) {
	console.clear();
	for (let i in BadNotations) {
		if (i == "ParenthesesMagnitude") {
			document.getElementById(`results-parentheses-magnitude`).innerHTML = formatOne(i, e);
			document.getElementById(`results-parentheses-magnitudeb2`).innerHTML = formatOne(i, e, {base: "2", tetraNests: "4"}, "Parentheses magnitude (Base 2)");
			document.getElementById(`results-parentheses-magnitudeb3`).innerHTML = formatOne(i, e, {base: "3", tetraNests: "3"}, "Parentheses magnitude (Base 3)");
			document.getElementById(`results-parentheses-magnitudeb1k`).innerHTML = formatOne(i, e, {base: "1000"}, "Parentheses magnitude (Base 1,000)")
		} else {
			document.getElementById(`results-${BadNotations[i].name.toLowerCase().replace(/ /g, "-").replace(/['().]/g, "")}`).innerHTML = formatOne(i, e)
		}
	}
}
document.getElementById("num").addEventListener("input", () => {
	format(document.getElementById("num").value)
});
function showTab(idx) {
	if (idx != 0) {
		document.getElementById("explainations").classList.add("active");
		document.getElementById(`explaination-n${idx}`).classList.add("active");
		if (activeTab != 0) document.getElementById(`explaination-n${activeTab}`).classList.remove("active");
	} else {
		document.getElementById("explainations").classList.remove("active");
		document.getElementById(`explaination-n${activeTab}`).classList.remove("active");
	}
	activeTab = idx;
}
for (let i of document.getElementById("resultscontainer").children) {
	i.addEventListener("click", () => { showTab(Number(i.id.replace(/n/, ""))) })
}
document.getElementById("close").addEventListener("click", () => { showTab(0) })
format("1");