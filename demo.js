function format(e) {
	let decim = new Decimal(e);
	document.getElementById("results").innerHTML = `Grand Button Incremental: ${BadNotations.GrandButtonIncrementalStandard.format(decim)}<br>
Old setsumi standard notation: ${BadNotations.OldSetsumiStandard.format(decim)}<br>
True 179uc notation: ${BadNotations.True179ucStandard.format(decim)}<br>
Vector's standard notation: ${BadNotations.VectorStandard.format(decim)}<br>
New vector's standard notation: ${BadNotations.NewVectorStandard.format(decim)}<br>
Ultimer's notation: ${BadNotations.Ultimer.format(decim)}<br>
Merging Legends: ${BadNotations.MergingLegendsStandard.format(decim)}<br>
Denutation: ${BadNotations.Denutation.format(decim)}<br>
Shit standard: ${BadNotations.CrapStandard.format(decim)}<br>
Points Progression: ${BadNotations.PointsProgressionStandard.format(decim)}<br>
Mid notation: ${BadNotations.Mid.format(decim)}<br>
Shit standard 2: ${BadNotations.CrapStandard2.format(decim)}<br>
Shit standard 2 (names): ${BadNotations.CrapStandard2Names.format(decim)}<br>
NullArea's bad notation: ${BadNotations.NullAreaBadNotation.format(decim)}`
}
document.getElementById("num").addEventListener("input", () => {
	format(document.getElementById("num").value)
});
format("1");
