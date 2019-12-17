$(document).ready(function(){
	window.domainVar = "; domain=.ugatu.su";
	
	ShowHideInput();
	CookieHideStr();
	window.location.hash="timetable";
});

function CookieHideStr(){
	if (getCookie("hideVisible")=="1"){
		var MyTable = $('#ExamTable tr');
		$.each(MyTable, function(i, item){
			if (item.innerHTML.indexOf(':')== -1 && item.innerHTML.indexOf('Досрочно')== -1 )
			{
					item.style.display="none";
					$("#hidebutton").attr("value","Показать пустые строки");
					
			}
		});
	}
	
	
}

function HideNullStr(){
	var MyTable = $('#ExamTable tr');
	$.each(MyTable, function(i, item){
		if (item.innerHTML.indexOf(':')== -1 && item.innerHTML.indexOf('Досрочно')== -1 )
		{
			if (item.style.display=="none")
			{
				item.style.display="";
				$("#hidebutton").attr("value","Скрыть пустые строки");
				setCookie("hideVisible", "0", 1);
			}
			else{
				item.style.display="none";
				$("#hidebutton").attr("value","Показать пустые строки");
				setCookie("hideVisible", "1", 1);
			}
		}	
	});
}

function ShowHideInput(){
	var radiobox = "url('/static/images/radiobox.svg')";
	var radioboxChecked = "url('/static/images/radiobox-checked.svg')";
	if($(document.body).hasClass("bleached")){
		radiobox = "url('/static/images/radiobox-black.svg')";
		radioboxChecked = "url('/static/images/radiobox-checked-black.svg')";
	}
	$('.schedule-semestr').show();
	if($('#id_ScheduleType_0').prop("checked")){
		$('#id_ScheduleType_0').parent("label").css("background-image",radioboxChecked);
		$('#id_ScheduleType_1').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_2').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_3').parent("label").css("background-image",radiobox);
		$('.schedule-date').hide();
		//$('.schedule-semestr').hide();
		$('.schedule-week').show();
		$('#SemestrSchedule').prop('required',true);
	}
	else if($('#id_ScheduleType_1').prop("checked")){
		$('#id_ScheduleType_1').parent("label").css("background-image",radioboxChecked);
		$('#id_ScheduleType_0').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_2').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_3').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_4').parent("label").css("background-image",radiobox);
		$('.schedule-date').hide();
		$('.schedule-week').hide();
		$('#SemestrSchedule').prop('required',true);
	}
	else if($('#id_ScheduleType_2').prop("checked")){
		$('#id_ScheduleType_2').parent("label").css("background-image",radioboxChecked);
		$('#id_ScheduleType_0').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_1').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_3').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_4').parent("label").css("background-image",radiobox);
		$('.schedule-date').show();
		$('.schedule-semestr').hide();
		$('.schedule-week').hide();
		$('#SemestrSchedule').prop('required',false);
		
	}
	else if($('#id_ScheduleType_3').prop("checked")){
		$('#id_ScheduleType_2').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_0').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_1').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_3').parent("label").css("background-image",radioboxChecked);
		$('#id_ScheduleType_4').parent("label").css("background-image",radiobox);
		$('.schedule-date').hide();
		//$('.schedule-semestr').hide();
		$('.schedule-week').hide();
		$('#SemestrSchedule').prop('required',true);
	}
	else if($('#id_ScheduleType_4').prop("checked")){
		$('#id_ScheduleType_2').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_0').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_1').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_3').parent("label").css("background-image",radiobox);
		$('#id_ScheduleType_4').parent("label").css("background-image",radioboxChecked);
		$('.schedule-date').hide();
		//$('.schedule-semestr').hide();
		$('.schedule-week').hide();
		$('#SemestrSchedule').prop('required',true);
	}
}

function incWeek(){
	if(parseInt($('#WeekSchedule').val()) < 31){
		$('#WeekSchedule').val(parseInt($('#WeekSchedule').val())+1);
	}
};

function decWeek(){
	if($('#WeekSchedule').val() != "1"){
		$('#WeekSchedule').val($('#WeekSchedule').val()-1);
	}
};