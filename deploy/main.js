/*******************************************************************************

	main.js
	Copyright (c) 2017 NiftyK LLC
	All Rights Reserved.
	
	The Peggy game board is made up of holes filled with pegs or marbles. In the code
	below, the terms peg, hole, slot are used interchangeably.
	
*******************************************************************************/

(function ($) {

const kStartingPegHole = 11;
const kPegHoleCount = 15;

var mLog = document.getElementById("loginfo");
var mJumpMap =
{
	// This table is sorted by the "to", or destination, peg. Each table entry is a list
	// of possible moves to the peg. For example, peg hole 6 has two possible moves:
	// jumping from peg 1 (over peg 3) and jumping from peg 8 (over peg 7)
	0 : [{from:3,over:1,to:0 }, {from:5,over:2,to:0 }],
	1 : [{from:6,over:3,to:1 }, {from:8,over:4,to:1 }],
	2 : [{from:7,over:4,to:2 }, {from:9,over:5,to:2 }],
	3 : [{from:0,over:1,to:3 }, {from:5,over:4,to:3 }, {from:10,over:6,to:3 }, {from:12,over:7,to:3 }],
	4 : [{from:11,over:7,to:4 }, {from:13,over:8,to:4 }],
	5 : [{from:0,over:2,to:5 }, {from:3,over:4,to:5 }, {from:12,over:8,to:5 }, {from:14,over:9,to:5 }],
	6 : [{from:1,over:3,to:6 }, {from:8,over:7,to:6 }],
	7 : [{from:2,over:4,to:7 }, {from:9,over:8,to:7 }],
	8 : [{from:1,over:4,to:8 }, {from:6,over:7,to:8 }],
	9 : [{from:2,over:5,to:9 }, {from:7,over:8,to:9 }],
	10: [{from:3,over:6,to:10}, {from:12,over:11,to:10}],
	11: [{from:4,over:7,to:11}, {from:13,over:12,to:11}],
	12: [{from:3,over:7,to:12}, {from:5,over:8,to:12}, {from:10,over:11,to:12}, {from:14,over:13,to:12}],
	13: [{from:4,over:8,to:13}, {from:11,over:12,to:13}],
	14: [{from:5,over:9,to:14}, {from:12,over:13,to:14}]
};


initialize();

/*******************************************************************************

*******************************************************************************/	
function initialize()
{
	clearLog();
}

/*******************************************************************************

*******************************************************************************/	
function logTrace(inString)
{
	var lines = mLog.value.split(/\n/).length;
	
	mLog.value += inString;

	if (mLog.rows < lines)
		mLog.rows = lines;
}

/*******************************************************************************

*******************************************************************************/	
function clearLog()
{
	mLog.value = "";
	mLog.rows = 1;
}

/*******************************************************************************

*******************************************************************************/	
function newPegBoard(inStartingHole)
{
	// A peg board is an array peg locations. At each location a " " means
	// hole, "O" means peg. Peg boards start "full" with just one zero, the
	// starting hole.
	outPegBoard = [];
	for (i=0; i < kPegHoleCount; i++)
	{
		if (i==inStartingHole)
			outPegBoard[i] = " ";
		else
			outPegBoard[i] = "O";
	}
	
	return outPegBoard;
}

/*******************************************************************************

*******************************************************************************/	
function logPegBoard(inPB)
{
	logTrace("                   "+inPB[0]+"\n");
	logTrace("                 "+inPB[1]+"   "+inPB[2]+"\n");
	logTrace("               "+inPB[3]+"   "+inPB[4]+"   "+inPB[5]+"\n");
	logTrace("             "+inPB[6]+"   "+inPB[7]+"   "+inPB[8]+"   "+inPB[9]+"\n");
	logTrace("           "+inPB[10]+"   "+inPB[11]+"   "+inPB[12]+"   "+inPB[13]+"   "+inPB[14]+"\n");
}

/*******************************************************************************
 
*******************************************************************************/	
function logPegBoardIndex()
{
	// This is mostly for debug purposes.
	logTrace("              \n");
	logTrace("       0      \n");
	logTrace("      1 2     \n");
	logTrace("    3  4  5   \n");
	logTrace("  6  7  8  9  \n");
	logTrace("10 11 12 13 14\n");
}

/*******************************************************************************

*******************************************************************************/	
function solve(inPegBoard)
{
}

/*******************************************************************************

*******************************************************************************/	
$('.play-button').click(function()
{
	clearLog();
	logTrace("Welcome to Peggy, the peg game solver.\n");
	
	var pb = newPegBoard(kStartingPegHole);
	
	logTrace("\n\n");
	logPegBoard(pb);
	logTrace("\n");
	logTrace("Starting board with hole at position "+kStartingPegHole+"\n");
	solve(pb);	
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
