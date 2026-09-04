function format(e) {
	let decim = new Decimal(e);
	let output = "";
	for (let i in BadNotations) {
		output += `${BadNotations[i].name}: ${BadNotations[i].format(decim)}<br>\n`
	}
	document.getElementById("results").innerHTML = output;
}
document.getElementById("num").addEventListener("input", () => {
	format(document.getElementById("num").value)
});
format("1");