/*******************************************************************************

	main.js
	Copyright (c) 2017 NiftyK LLC
	All Rights Reserved.
	
*******************************************************************************/

(function ($) {

var mLog = document.getElementById("loginfo");

initialize();

/*******************************************************************************

*******************************************************************************/	
function initialize()
{
	mLog.value = "";
}

/*******************************************************************************

*******************************************************************************/	
$('.play').click(function()
{
	mLog.value += "Hello!\n";
	
	var lines = mLog.value.split(/\n/).length;
	if (mLog.rows < lines)
		mLog.rows = lines;
});

}(jQuery));

/*******************************************************************************

*******************************************************************************/	
/*******************************************************************************

*******************************************************************************/	
/*******************************************************************************

*******************************************************************************/	
/*******************************************************************************

*******************************************************************************/	
/*******************************************************************************

*******************************************************************************/	