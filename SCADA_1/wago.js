<script src="./lib/jquery-3.4.1.min.js"></script>
	<script type="text/javaScript">

	jQuery(document).ready(function(){
		$("button").attr("disabled", "diabled");
		function update(initial = false) {
			var errNetwork = false;
			$.ajax({
				url: "wago.ssi",
				type: "get",
				cache: false,
				timeout: 1000,
				success: function(data) {
					$("#no_net").css("display", "none");
					data = JSON.parse(data);
					$("#gdh").html(data.gdh);
					$("#t0").html((data.dataIn[0]/32767*30).toFixed(1).replace(".", ","));
					$("#t1").html((data.dataIn[1]/32767*30).toFixed(1).replace(".", ","));
					if (initial) {
						$("#man").prop("checked", data.dataIn[11]);
						$("#mfc").prop({"checked": data.dataIn[12], "disabled":!data.dataIn[10]});
						$("#tcons").toggleClass("grey", data.dataIn[11] == "1");
					}
					for (var i = 3; i < 11; i++) {
						$("#b" + i).toggleClass("actif", data.dataIn[i] == "1");
					}
					$("#acq").attr("disabled", ((data.dataIn[4] == "0") && (data.dataIn[5] == "0") && (data.dataIn[6] == "0") && (data.dataIn[9] == "0") && (data.dataIn[10] == "1")) ? null : "disabled");
					if (!($("#tcons").is(":focus"))) {
						var valeur = ((data.dataIn[2])/32767*30).toFixed(1);
						$("#tcons").attr("data", valeur).val(valeur);
					}
				},
				error: function() { $("#no_net").css("display", ""); }
			});
		}
		
		function isNumber(evt, element) {
			var charCode = (evt.which) ? evt.which : event.keyCode
			if ((charCode != 44 || $(element).val().indexOf(',') != -1) &&
				(charCode < 48 || charCode > 57))
				return false;
		    return true;
		}
		
		$("#tcons").change(function() {
			var valeur = parseFloat($(this).val().replace(",",".")).toFixed(1);
			if ((valeur < 0) || (valeur > 30)) $(this).val($(this).attr("data"));
			else {
				$.post("/WRITEPI", { ADR1: "MW4", VALUE1: parseInt(valeur/30*32767), FORMAT1: "%d" })
					.done(function() {
						$("#tcons").attr("data",valeur).val(valeur);
					})
					.fail(function() {
						$("#tcons").val($("#tcons").attr("data"));
					});
			}
		}).keypress(function (event) {
			return isNumber(event, this)
		});
		
		$("#man").change(function(){
			var checked = $(this).is(":checked");
			$.post("/WRITEPI", { ADR1: "MX1.6", VALUE1: ((checked) ? "1" : "0"), FORMAT1: "%d" })
				.done(function() {
					$("#mfc").prop("disabled", !checked);
					$("#tcons").toggleClass("grey", checked);
					update();
				})
				.fail(function() {
					$("#man").prop("checked", !checked);
				});
		});
		$("#mfc").change(function(){
			$.post("/WRITEPI", { ADR1: "MX1.7", VALUE1: ($("#mfc").is(":checked") ? "1" : "0"), FORMAT1: "%d" })
				.done(function() {
					update();
				})
				.fail(function() {
					$("#mfc").prop("checked", $("#mfc").is(":checked"));
				});
		});
		$("#acq").click(function(){
			$.post("/WRITEPI", { ADR1: "MX1.8", VALUE1: "1", FORMAT1: "%d" })
				.done(function() {
					update();
				});
		});
		update(true);
		setInterval(update, 1000);
	});
	</script>