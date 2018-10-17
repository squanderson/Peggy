/*******************************************************************************

	main.js
	Copyright (c) 2017 NiftyK LLC
	All Rights Reserved.
	
	The Peggy game board is made up of holes filled with pegs or marbles. In the code
	below, the terms peg, hole, slot are used interchangeably.
	
*******************************************************************************/

(function ($)
{

var mLog = document.getElementById("loginfo");

const kStartingPegHole = 15;
const kPegHoleCount = 21;
const HOLE = ".";
const PEG = "O";
const mJumpMap =
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
	14: [{from:5,over:9,to:14}, {from:12,over:13,to:14}],
	15: [{from:6,over:10,to:15}, {from:17,over:16,to:15}],
	16: [{from:7,over:11,to:16}, {from:18,over:17,to:16}],
	17: [{from:6,over:11,to:17}, {from:15,over:16,to:17}, {from:8,over:12,to:17}, {from:19,over:18,to:17}],
	18: [{from:16,over:17,to:18}, {from:7,over:12,to:18}, {from:9,over:13,to:18}, {from:20,over:19,to:18}],
	19: [{from:8,over:13,to:19}, {from:17,over:18,to:19}],
	20: [{from:9,over:14,to:20}, {from:18,over:19,to:20}]
};
// This map keeps track of known peg boards. If a peg board is known to Peggy
// it will not be searched a second time for new moves. The map is made up
// of (key, value) pairs where key is a pegboard and value is an associated
// game node.
var mKnownGameStates = new Map();

// The leaderboard maps final number of pegs remaining with the game state for that result.
// From there you can chase up the tree via each game node's parent parameter. This map's
// format is { pegsRemaining : [gameNode1, gameNode2, ...] } where gameNodes are other
// branches of the tree that have the same number of remaining pegs. Solutions, you might say.
var mLeaderboard = new Map();

var mSolveDepth = 0;

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
	const kMaxLines = 50;
	var lines = mLog.value.split(/\n/).length;
	
	mLog.value += inString;

	if (mLog.rows < lines && lines <= kMaxLines)
		mLog.rows = lines;
}

/*******************************************************************************

*******************************************************************************/	
function clearLog()
{
	mLog.value = "";
	mLog.rows = 2;
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
	logTrace("\n");
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
	logtrace("15 16 17 18 19 20\n");
}

/*******************************************************************************

*******************************************************************************/	
function PegBoard(inStartingHole)
{
	// A peg board is an array peg locations. At each location is either a HOLE or
	// PEG. Peg boards start "full" of pegs with just one hole, the starting hole.
	
	outPegBoard = ""; // start with an empty array
	for (i=0; i < kPegHoleCount; i++)
	{
		// depending on the index, insert a HOLE or PEG
		if (i==inStartingHole)
			outPegBoard += HOLE;
		else
			outPegBoard += PEG;
	}
	
	return outPegBoard;
}

/*******************************************************************************

*******************************************************************************/	
function GameNode()
{
	var outNode = {};
	outNode.pegBoard = null;
	outNode.move = null;
	outNode.parent = null;
	outNode.children = [];
	return outNode;
}

/*******************************************************************************

*******************************************************************************/	
function pegCount(inPegBoard)
{
	var numPegs = 0;
	
	for (i=0; i < kPegHoleCount; i++)
	{
		if (inPegBoard[i] == PEG)
			numPegs += 1;
	}

	return numPegs;
}

/*******************************************************************************

*******************************************************************************/	
function updateLeaderboard(inGameNode)
{
	var score = pegCount(inGameNode.pegBoard);
	
	var nodes = mLeaderboard.get(score);
	if (nodes == undefined)
	{
		// First node to have this score, add to the map
		mLeaderboard.set(score, [inGameNode]);
	}
	else
	{
		if (!nodes.includes(inGameNode))
			nodes.push(inGameNode);
	}
}

/*******************************************************************************

*******************************************************************************/	
function dumpLeaderboard()
{
	for (score=0; score < kPegHoleCount; score++)
	{
		var scoreGroup = mLeaderboard.get(score);
		if (scoreGroup != undefined)
		{
			logTrace(scoreGroup.length+" solutions have "+score+" pegs remaining\n");
			if (score == 1)
			{
				for (nodeIdx = 0; nodeIdx < scoreGroup.length; nodeIdx++)
				{
					logTrace("\n");
					logTrace("   Solution "+(nodeIdx+1)+"\n");
					
					var playback = [];
					var node = scoreGroup[nodeIdx];
					while (node != null)
					{
						playback.unshift(node);
						node = node.parent;	
					}
				
					for (i=0;i<playback.length; i++)
						logPegBoard(playback[i].pegBoard);
				}
			}
		}
	}
}
 
/*******************************************************************************

*******************************************************************************/	
function applyMove(inPegBoard, inMove)
{
	var outVal = inPegBoard;
	
	outVal = outVal.substring(0, inMove.from) + HOLE + outVal.substring(inMove.from+1);
	outVal = outVal.substring(0, inMove.over) + HOLE + outVal.substring(inMove.over+1);
	outVal = outVal.substring(0, inMove.to) + PEG + outVal.substring(inMove.to+1);

	return outVal;
}

/*******************************************************************************

*******************************************************************************/	
function solve(inGameNode)
{
	mSolveDepth += 1;

	var foundValidMove = false;	
	for (var i = 0; i < kPegHoleCount; i++)
	{
		// Look for holes. For each hole see if  there are moves available
		if (inGameNode.pegBoard[i] == HOLE)
		{
			for (var j=0; j<mJumpMap[i].length; j++)
			{
				var move = mJumpMap[i][j];
				if (inGameNode.pegBoard[move.from] == PEG && inGameNode.pegBoard[move.over] == PEG && inGameNode.pegBoard[move.to] == HOLE)
				{
					foundValidMove = true;
					
					// Found a valid move. Update the peg board and set up a new game state
					var nextBoard = applyMove(inGameNode.pegBoard.slice(0), move); 					
					var nextNode = mKnownGameStates.get(nextBoard);
					if (nextNode!=undefined)
					{
						// This board has already been traversed, just update the current
						// game node and bail. DO NOT continue to solve!
						inGameNode.children.push(nextNode);
					}
					else
					{
						// We have NOT seen this board yet. Add it to the map and continue to solve.
						nextNode 			= GameNode();
						nextNode.pegBoard	= nextBoard;
						nextNode.move		= move;
						nextNode.parent 	= inGameNode;
						mKnownGameStates.set(nextNode.pegBoard, nextNode);
						
						inGameNode.children.push(nextNode);
						solve(nextNode);	// down the rabbit hole!
					}					
				}
			}
		}
	}

	if (!foundValidMove)
	{
		// Congratulations! At this point there are no more moves for this
		// peg board. This branch of the tree is done, put it on the leaderboard!
		updateLeaderboard(inGameNode);
	}
	
	mSolveDepth -= 1;
}

/*******************************************************************************

*******************************************************************************/	
$('.play-button').click(function()
{
	clearLog();
	logTrace("Welcome to Peggy, the peg game solver.\n");
		
	var startingGameNode = GameNode();
	startingGameNode.pegBoard = PegBoard(kStartingPegHole);
	
	logTrace("\n\n");
	logTrace("Starting board with hole at position "+kStartingPegHole+"\n");
		
	solve(startingGameNode);
	
	logTrace("\n\n");
	dumpLeaderboard();
	
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
