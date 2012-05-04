logic=function()
{
	this.nextVal=function()
	{
			//this.randomArray=Math.floor(Math.random()*4);
			this.randomArray=currentVal;
			
			if(currentVal<=2)
			{
				currentVal=currentVal+1;
			}
			else 
			{
				currentVal=0;
			}
			
			this.arrayLen;
			this.assigned=0;
			
			//---------For 1 Part-----------
			if(this.randomArray==0 && part1.length>=1)
			{
				this.assigned=1;
				this.assignVal("part1");
				//console.log("Function Called 1:"+this.assigned);
			}
			else if(this.assigned==0 && this.randomArray==0)
			{
				this.checkVal();
				//console.log("Function Called else 1");
			}
			//------------------------------
			
			
			//-----------For 2 Part------------
			if(this.randomArray==1 && part2.length>=1)
			{
				this.assigned=1;
				this.assignVal("part2");
				//console.log("Function Called 2");
			}
			else if(this.assigned==0 && this.randomArray==1)
			{
				this.checkVal();
				//console.log("Function Called else 2:"+this.assigned);
			}
			//--------------------------------
			
			
			//----------For 3 Part-------------
			if(this.randomArray==2&& part3.length>=1)
			{
				this.assigned=1;
				this.assignVal("part3");
				//console.log("Function Called 3");
			}
			else if(this.assigned==0 && this.randomArray==2)
			{
				this.checkVal();
				//console.log("Function Called else 3:"+this.assigned);
			}
			//---------------------------------
			
			
			//---------For 4 Part--------------
			if(this.randomArray==3&& part4.length>=1)
			{
				this.assigned=1;
				this.assignVal("part4");
			}
			else if(this.assigned==0 && this.randomArray==3)
			{
				this.checkVal();
				//console.log("Function Called else 4:"+this.assigned);
			}
			//--------------------------------
			
			console.log("Next Values:"+currentValue);
			$('#NextValue').val(currentValue);
		
	}
	
	
	this.checkVal=function()
	{
		if(this.randomArray==1)
		{
			if(part2.length>=1)
			{
				this.assignVal("part2");				
			}
			else if(part3.length>=1)
			{
				this.assignVal("part3");
			}
			else if(part4.length>=1)
			{
				this.assignVal("part4");
			}
		}
		else if(this.randomArray==2)
		{
			if(part1.length>=1)
			{
				this.assignVal("part1");
			}
			else if(part3.length>=1)
			{
				this.assignVal("part3");
			}
			else if(part4.length>=1)
			{
				this.assignVal("part4");
			}
		}
		else if(this.randomArray==3)
		{
			if(part1.length>=1)
			{
				this.assignVal("part1");
			}
			else if(part2.length>=1)
			{
				this.assignVal("part2");
			}
			else if(part4.length>=1)
			{
				this.assignVal("part4");
			}
		}
		else if(this.randomArray==4)
		{
			if(part1.length>=1)
			{
				this.assignVal("part1");
			}
			else if(part2.length>=1)
			{
				this.assignVal("part2");
			}
			else if(part3.length>=1)
			{
				this.assignVal("part3");
			}
		}
	}
	
	
	//----------Function Used to Assign the Value to Variables------------
	this.assignVal=function(arrName)
	{
		this.assigned=0;
		
		if(arrName=="part1")
		{
			this.arrayLen=Math.floor(Math.random()*(part1.length-1));
			currentArray="part1";
			currentIndex=this.arrayLen;
			currentValue=part1[this.arrayLen];
		}
		else if(arrName=="part2")
		{
			this.arrayLen=Math.floor(Math.random()*(part2.length-1));
			currentArray="part2";
			currentIndex=this.arrayLen;
			currentValue=part2[this.arrayLen];
		}
		else if(arrName=="part3")
		{
			this.arrayLen=Math.floor(Math.random()*(part3.length-1));
			currentArray="part3";
			currentIndex=this.arrayLen;
			currentValue=part3[this.arrayLen];
		}
		else if(arrName=="part4")
		{
			this.arrayLen=Math.floor(Math.random()*(part4.length-1));
			currentArray="part4";
			currentIndex=this.arrayLen;
			currentValue=part4[this.arrayLen];
		}
		console.log("Array Length:"+this.arrayLen);
	}
	//--------------------------------------------------------------------
}
