//
//  main.cpp
//  Peggy
//
//  Created by moosh on 8/18/18.
//  Copyright © 2018 NiftyK. All rights reserved.
//

#include <iostream>
#include <list>
#include <map>
#include <stack>
#include <set>
#include <math.h>


typedef struct PegJump
{
	int fJumper = 0;
	int fJumpee = 0;
	PegJump(void) { fJumper = -1; fJumpee = -1; }
	PegJump(int x, int y) { fJumper = x; fJumpee = y; }
} PegJump;
std::multimap<int, PegJump> sJumpMap;

const int kStartingHolePos = 2;
const int kPegHoleCount  = 15;
const PegJump kEmptyPJ;
typedef bool Pegboard[kPegHoleCount];

/******************************************************************************

******************************************************************************/
typedef struct GameState
{
	//bool fPegboard[kPegHoleCount];
	Pegboard fPegboard;
	PegJump fPJ;
	std::list<GameState*> fChildren;
	GameState *fParent = nullptr;

	GameState(void)
	{
		memset(fPegboard, 0, kPegHoleCount * sizeof(bool));
		fPJ = kEmptyPJ;
		fParent = nullptr;
		fChildren.clear();
	}

	GameState(GameState* inG)
	{
		memcpy(fPegboard, inG->fPegboard, kPegHoleCount * sizeof(bool));
		fPJ = kEmptyPJ;
		fParent = nullptr;
		fChildren.clear();
	}

} GameState;
std::map<int, GameState*> sDuplicates;

/******************************************************************************
var JumpTable =
[
	[0 , [{from:3,over:1,to:0 }, {from:5,over:2,to:0 }]],
	[1 , [{from:6,over:3,to:1 }, {from:8,over:4,to:1 }]],
	[2 , [{from:7,over:4,to:2 }, {from:9,over:5,to:2 }]],
	[3 , [{from:0,over:1,to:3 }, {from:5,over:4,to:3 }, {from:10,over:6,to:3 }, {from:12,over:7,to:3 }]],
	[4 , [{from:11,over:7,to:4 }, {from:13,over:8,to:4 }]],
	[5 , [{from:0,over:2,to:5 }, {from:3,over:4,to:5 }, {from:12,over:8,to:5 }, {from:14,over:9,to:5 }]],
	[6 , [{from:1,over:3,to:6 }, {from:8,over:7,to:6 }]],
	[7 , [{from:2,over:4,to:7 }, {from:9,over:8,to:7 }]],
	[8 , [{from:1,over:4,to:8 }, {from:6,over:7,to:8 }]],
	[9 , [{from:2,over:5,to:9 }, {from:7,over:8,to:9 }]],
	[10, [{from:3,over:6,to:10}, {from:12,over:11,to:10}]],
	[11, [{from:4,over:7,to:11}, {from:13,over:12,to:11}]],
	[12, [{from:3,over:7,to:12}, {from:5,over:8,to:12}, {from:10,over:11,to:12}, {from:14,over:13,to:12}]],
	[13, [{from:4,over:8,to:13}, {from:11,over:12,to:13}]],
	[14, [{from:5,over:9,to:14}, {from:12,over:13,to:14}]],
];


******************************************************************************/
void initMap(void)
{
	sJumpMap.insert(std::make_pair(0,PegJump(3,1)));
	sJumpMap.insert(std::make_pair(0,PegJump(5,2)));
	sJumpMap.insert(std::make_pair(1,PegJump(6,3)));
	sJumpMap.insert(std::make_pair(1,PegJump(8,4)));
	sJumpMap.insert(std::make_pair(2,PegJump(7,4)));
	sJumpMap.insert(std::make_pair(2,PegJump(9,5)));
	sJumpMap.insert(std::make_pair(3,PegJump(0,1)));
	sJumpMap.insert(std::make_pair(3,PegJump(10,6)));
	sJumpMap.insert(std::make_pair(3,PegJump(12,7)));
	sJumpMap.insert(std::make_pair(3,PegJump(5,4)));
	sJumpMap.insert(std::make_pair(4,PegJump(11,7)));
	sJumpMap.insert(std::make_pair(4,PegJump(13,8)));
	sJumpMap.insert(std::make_pair(5,PegJump(0,2)));
	sJumpMap.insert(std::make_pair(5,PegJump(14,9)));
	sJumpMap.insert(std::make_pair(5,PegJump(12,8)));
	sJumpMap.insert(std::make_pair(5,PegJump(3,4)));
	sJumpMap.insert(std::make_pair(6,PegJump(1,3)));
	sJumpMap.insert(std::make_pair(6,PegJump(8,7)));
	sJumpMap.insert(std::make_pair(7,PegJump(2,4)));
	sJumpMap.insert(std::make_pair(7,PegJump(9,8)));
	sJumpMap.insert(std::make_pair(8,PegJump(6,7)));
	sJumpMap.insert(std::make_pair(8,PegJump(1,4)));
	sJumpMap.insert(std::make_pair(9,PegJump(2,5)));
	sJumpMap.insert(std::make_pair(9,PegJump(7,8)));
	sJumpMap.insert(std::make_pair(10,PegJump(3,6)));
	sJumpMap.insert(std::make_pair(10,PegJump(12,11)));
	sJumpMap.insert(std::make_pair(11,PegJump(4,7)));
	sJumpMap.insert(std::make_pair(11,PegJump(13,12)));
	sJumpMap.insert(std::make_pair(12,PegJump(10,11)));
	sJumpMap.insert(std::make_pair(12,PegJump(3,7)));
	sJumpMap.insert(std::make_pair(12,PegJump(5,8)));
	sJumpMap.insert(std::make_pair(12,PegJump(14,13)));
	sJumpMap.insert(std::make_pair(13,PegJump(4,8)));
	sJumpMap.insert(std::make_pair(13,PegJump(11,12)));
	sJumpMap.insert(std::make_pair(14,PegJump(12,13)));
	sJumpMap.insert(std::make_pair(14,PegJump(5,9)));
}

/******************************************************************************

******************************************************************************/
int pegboardHash(Pegboard inPB)
{
	int outHash = 0;
	for (int i = 0; i < kPegHoleCount; ++i)
	{
		if (inPB[i])
			outHash += pow(2, i);
	}

	return outHash;
}

/******************************************************************************

******************************************************************************/
bool isDuplicate(GameState* inG)
{
	int x = pegboardHash(inG->fPegboard);
	bool isDupe = sDuplicates.find(x) != sDuplicates.end();
	if (!isDupe)
		sDuplicates[x] = inG;

	return isDupe;
}

/******************************************************************************

******************************************************************************/
GameState* gameFromPegboard(Pegboard inPB)
{
	GameState *outG = nullptr;
	int x = pegboardHash(inPB);
	if (sDuplicates.find(x) != sDuplicates.end())
		outG = sDuplicates[x];
	else
		outG = nullptr;

	return outG;
}

/******************************************************************************

******************************************************************************/
std::list<PegJump> getMoves(GameState* inG)
{
	std::list<PegJump> outMoves;

	GameState *g = inG;
	while (g)
	{
		if (g->fPJ.fJumper != -1)
			outMoves.push_front(g->fPJ);
		g = g->fParent;
	}

	return outMoves;
}

/******************************************************************************

******************************************************************************/
int main(int argc, const char * argv[])
{
	initMap();

	GameState *curGame = nullptr;
	GameState gameTree;
	memset(gameTree.fPegboard, 1, kPegHoleCount * sizeof(bool));
	gameTree.fPegboard[kStartingHolePos] = 0;

	std::stack<GameState*> stack;
	stack.push(&gameTree);
	while (stack.size())
	{
		curGame = stack.top(); stack.pop();

		for (int i = 0; i < kPegHoleCount; ++i)
		{
			// Look for holes. For each hole found see if
			// there are moves available to populate the hole
			if (curGame->fPegboard[i] == 0)
			{
				auto result = sJumpMap.equal_range(i);
				for (auto it = result.first; it != result.second; ++it)
				{
					PegJump& j = it->second;
					if (curGame->fPegboard[j.fJumper] && curGame->fPegboard[j.fJumpee])
					{
						GameState *g = new GameState(curGame);
						g->fPegboard[j.fJumper] = false;
						g->fPegboard[j.fJumpee] = false;
						g->fPegboard[i] = true;
						g->fParent = curGame;
						g->fPJ = j;
						if (isDuplicate(g))
						{
							curGame->fChildren.push_back(gameFromPegboard(g->fPegboard));
							delete g;
							// don't push onto the stack, this one has already been traversed
						}
						else
						{
							curGame->fChildren.push_back(g);
							stack.push(g);
						}
					}
				}
			}
		}
	}

	int numGames = 0;
	int numSolutions = 0;
	int num2Sol = 0;
	int num3Sol = 0;
	int num4Sol = 0;
	int num5Sol = 0;
	int num6Sol = 0;
	int num7Sol = 0;
	int num8Sol = 0;
	int num9Sol = 0;
	int num10Sol = 0;
	int num11Sol = 0;
	int num12Sol = 0;
	int num13Sol = 0;
	int hash = 0;
	std::list<PegJump> moves;
	std::list<std::list<PegJump>> moves1;
	std::list<std::list<PegJump>> moves7;
	std::list<std::list<PegJump>> moves8;
	std::list<std::list<PegJump>> moves10;
	std::list<std::list<PegJump>> moves11;
	std::set<int> visited;
	std::stack<GameState*> stack2;
	stack2.push(&gameTree);

	while (stack2.size())
	{
		curGame = stack2.top(); stack2.pop();

		hash = pegboardHash(curGame->fPegboard);
		if (visited.find(hash) != visited.end())
			continue;

		visited.insert(hash);
		if (curGame->fChildren.size()==0)
		{
			int numPegsLeft = 0;
			for (int i = 0; i < kPegHoleCount; ++i)
			{
				if (curGame->fPegboard[i] == 1)
					numPegsLeft++;
			}
			numGames++;
			if (numPegsLeft ==1)
			{
				numSolutions++;
				moves = getMoves(curGame);
				moves1.push_back(moves);
			}
			if (numPegsLeft ==2)
			{
				num2Sol++;
			}
			if (numPegsLeft ==3)
			{
				num3Sol++;
			}
			if (numPegsLeft ==4)
			{
				num4Sol++;
			}
			if (numPegsLeft ==5)
			{
				num5Sol++;
			}
			if (numPegsLeft ==6)
			{
				num6Sol++;
			}
			if (numPegsLeft ==7)
			{
				num7Sol++;
				moves = getMoves(curGame);
				moves7.push_back(moves);
			}
			if (numPegsLeft ==8)
			{
				num8Sol++;
				moves = getMoves(curGame);
				moves8.push_back(moves);
			}

			if (numPegsLeft ==9)
			{
				num9Sol++;
			}

			if (numPegsLeft ==10)
			{
				num10Sol++;
				moves = getMoves(curGame);
				moves10.push_back(moves);
			}

			if (numPegsLeft ==11)
			{
				num11Sol++;
				moves = getMoves(curGame);
				moves11.push_back(moves);
			}

			if (numPegsLeft ==12)
			{
				num12Sol++;
			}

			if (numPegsLeft ==13)
			{
				num13Sol++;
			}

		}
		else
		{
			for (auto it : curGame->fChildren)
			{
				stack2.push(it);
			}
		}
	}

	printf("Total number of games:%d\n", numGames);
	printf("Game has %d solutions with 1 peg left (%f%%)\n", numSolutions, numSolutions * 100.0 / numGames);

	for (auto m : moves1)
	{
		printf("   ");
		for (auto pj : m)
		{
			printf("(%d,%d),", pj.fJumper, pj.fJumpee);
		}
		printf("\n");
	}

	printf("Game has %d solutions with 2 pegs left  (%f%%)\n", num2Sol, num2Sol * 100.0 / numGames);
	printf("Game has %d solutions with 3 pegs left (%f%%)\n", num3Sol, num3Sol * 100.0 / numGames);
	printf("Game has %d solutions with 4 pegs left (%f%%)\n", num4Sol, num4Sol * 100.0 / numGames);
	printf("Game has %d solutions with 5 pegs left (%f%%)\n", num5Sol, num5Sol * 100.0 / numGames);
	printf("Game has %d solutions with 6 pegs left (%f%%)\n", num6Sol, num6Sol * 100.0 / numGames);
	printf("Game has %d solutions with 7 pegs left (%f%%)\n", num7Sol, num7Sol * 100.0 / numGames);

	for (auto m : moves7)
	{
		printf("   ");
		for (auto pj : m)
		{
			printf("(%d,%d),", pj.fJumper, pj.fJumpee);
		}
		printf("\n");
	}

	printf("Game has %d solutions with 8 pegs left (%f%%)\n", num8Sol, num8Sol * 100.0 / numGames);

	for (auto m : moves8)
	{
		printf("   ");
		for (auto pj : m)
		{
			printf("(%d,%d),", pj.fJumper, pj.fJumpee);
		}
		printf("\n");
	}

	printf("Game has %d solutions with 9 pegs left (%f%%)\n", num9Sol, num9Sol * 100.0 / numGames);
	printf("Game has %d solutions with 10 pegs left (%f%%)\n", num10Sol, num10Sol * 100.0 / numGames);

	for (auto m : moves10)
	{
		printf("   ");
		for (auto pj : m)
		{
			printf("(%d,%d),", pj.fJumper, pj.fJumpee);
		}
		printf("\n");
	}

	printf("Game has %d solutions with 11 pegs left (%f%%)\n", num11Sol, num11Sol * 100.0 / numGames);

//	for (auto m : moves11)
//	{
//		printf("   ");
//		for (auto pj : m)
//		{
//			printf("(%d,%d),", pj.fJumper, pj.fJumpee);
//		}
//		printf("\n");
//	}


	printf("Game has %d solutions with 12 pegs left (%f%%)\n", num12Sol, num12Sol * 100.0 / numGames);
	printf("Game has %d solutions with 13 pegs left (%f%%)\n", num13Sol, num13Sol * 100.0 / numGames);

	return 0;
}
