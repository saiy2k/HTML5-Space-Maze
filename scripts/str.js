var log=new logic();

var part1;
var part2;
var part3;
var part4;

var currentValue;
var currentIndex;
var currentArray;
var currentVal;
var completed;

function getNumber() {
	log.nextVal();
}


//--------Return Function------------
function gettingVal(returnVal)
{
	//console.log("You Pressed:"+returnVal.i);
	if(returnVal==currentValue)
	{
		$('#NextValue').val("Value Matched");
		//console.log("currentArray:"+currentArray);
		
		//-------------Used to Splice the Value from Clicked Array ---------
		if(currentArray=="part1")
		{
			part1.splice(currentIndex,1);
			console.log("After Splice:"+part1);
		}
		else if((currentArray=="part2"))
		{
			part2.splice(currentIndex,1);
			console.log("After Splice:"+part2);
		}
		else if((currentArray=="part3"))
		{
			part3.splice(currentIndex,1);
			console.log("After Splice:"+part3);
		}
		else if((currentArray=="part4"))
		{
			part4.splice(currentIndex,1);
			console.log("After Splice:"+part4);
		}
		//-------------------------------------------------------------------
		
		completed.push(currentValue);
		
		//-------Used to Check all Balls Are Selected or not-------------
		if(part1.length==0 && part2.length==0 && part3.length==0 && part4.length==0)
		{
			$('#NextValue').val("All Balls Are Selected");
		}
		else 
		{
			log.nextVal();
		}
		//---------------------------------------------------------------
	}
	else 
	{
		$('#NextValue').val("Value Not Mached");
	}
}
//-----------------------------------
