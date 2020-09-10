// Licensed Materials - Property of IBM
//
// AIMCHSR00
// (C)Copyright IBM Corp. 2003 - 2005  All Rights Reserved

//.============================================================================
//.Function:  Defines and processes BIDI key constants and events
//.============================================================================

//////////////**************** HODbidiAttribute Constants Start********************/////////////
var INIT                      = 0x80000000 ;
var LEVEL                     = 0x70000000 ;
var TEXTTYPE                  = 0x01000000 ;
var TEXT_ORIENTATION          = 0x00030000 ;
var NUMERALS                  = 0x00003000 ;
var SYM_SWAP                  = 0x00000100 ;
var WORD_BREAK                = 0x00000200 ;
var TEXT_SHAPE                = 0x000000FF ;
var ROUND_TRIP                = 0X00100000 ;

var TEXT_VISUAL               = 0x00000000 ;
var TEXT_IMPLICIT             = 0x01000000 ;

var ORIENTATION_LTR           = 0x00000000 ;
var ORIENTATION_RTL           = 0x00010000 ;
var ORIENTATION_CONTEXT_LTR   = 0x00020000 ;
var ORIENTATION_CONTEXT_RTL   = 0x00030000 ;

var NUMERALS_NOMINAL          = 0x00000000 ;
var NUMERALS_NATIONAL         = 0x00002000 ;
var NUMERALS_CONTEXTUAL       = 0x00003000 ;

var BREAK                     = 0x00000200 ;
var NO_BREAK                  = 0x00000000 ;

var SWAPPING                  = 0x00000100 ;
var NO_SWAPPING               = 0x00000000 ;

var TEXT_SHAPED               = 0x00000000 ;
var TEXT_NOMINAL              = 0x00000010 ;
var TEXT_INITIAL              = 0x00000011 ;
var TEXT_MIDDLE               = 0x00000012 ;
var TEXT_FINAL                = 0x00000013 ;
var TEXT_ISOLATED             = 0x00000014 ;

var TAIL                      = 0x200B ;

var ROUND_TRIP_ON             = 0x00000000 ;
var ROUND_TRIP_OFF            = 0x00100000 ;

var formatedAttributes        = 0;
//////////////**************** HODbidiAttribute Constants End********************/////////////

//////////////**************** HODbidiAttribute Functions Start********************/////////////
function setAttribute (name ,value){
	formatedAttributes = ((formatedAttributes & (~(name)) ) | (value & (name)) )  ;
}

function getAttribute (attr ,name){
	return ( (attr) & (name) );
}
//////////////**************** HODbidiAttribute Functions End********************/////////////

//////////////**************** HODbidiShape Constants ****************************/////////////
var LINKR = 1;
var LINKL = 2;
var IRRELEVANT = 4;
var LAMTYPE = 16;
var ALEFTYPE = 32;
var LINKFIELD = 3;
var lamAlphCount = 0;

//////////////**************** HODbidiShape Array definitions********************/////////////
var shapeTable    =     [
                         [ [0,0,0,0],   [0,0,0,0],     [0,1,0,3],     [0,1,0,1] ],
                         [ [0,0,2,2],   [0,0,1,2],     [0,1,1,2],     [0,1,1,3] ],
                         [ [0,0,0,0],   [0,0,0,0],     [0,1,0,3],     [0,1,0,3] ],
                         [ [0,0,1,2],   [0,0,1,2],     [0,1,1,2],     [0,1,1,3] ]
                         ];

var convertFEto06 =     [
                         0x64B, 0x64B,
                         0x64C, 0x64C,
                         0x64D, 0x64D,
                         0x64E, 0x64E,
                         0x64F, 0x64F,
                         0x650, 0x650,
                         0x651, 0x651,
                         0x652, 0x652,
                         0x621,
                         0x622, 0x622,
                         0x623,0x623,
                         0x624,0x624,
                         0x625,0x625,
                         0x626,0x626,0x626,0x626,
                         0x627,0x627,
                         0x628,0x628,0x628,0x628,
                         0x629,0x629,
                         0x62A,0x62A,0x62A,0x62A,
                         0x62B,0x62B,0x62B,0x62B,
                         0x62C,0x62C,0x62C,0x62C,
                         0x62D,0x62D,0x62D,0x62D,
                         0x62E,0x62E,0x62E,0x62E,
                         0x62F,0x62F,
                         0x630,0x630,
                         0x631,0x631,
                         0x632,0x632,
                         0x633,0x633, 0x633,0x633,
                         0x634, 0x634,0x634,0x634,
                         0x635,0x635,0x635,0x635,
                         0x636,0x636,0x636,0x636,
                         0x637,0x637,0x637,0x637,
                         0x638,0x638,0x638,0x638,
                         0x639,0x639,0x639,0x639,
                         0x63A,0x63A,0x63A,0x63A,
                         0x641,0x641,0x641,0x641,
                         0x642,0x642,0x642,0x642,
                         0x643,0x643,0x643,0x643,
                         0x644,0x644,0x644,0x644,
                         0x645,0x645,0x645,0x645,
                         0x646,0x646,0x646,0x646,
                         0x647,0x647,0x647,0x647,
                         0x648, 0x648,
                         0x649,0x649,
                         0x64A,0x64A,0x64A,0x64A,
                         0x65C, 0x65C,
                         0x65D,0x65D,
                         0x65E,0x65E,
                         0x65F,0x65F


                         ];

var Link06 = [
              1           + 32 + 256 * 0x11,
              1           + 32 + 256 * 0x13,
              1                + 256 * 0x15,
              1           + 32 + 256 * 0x17,
              1 + 2            + 256 * 0x19,
              1           + 32 + 256 * 0x1D,
              1 + 2            + 256 * 0x1F,
              1                + 256 * 0x23,
              1 + 2            + 256 * 0x25,
              1 + 2            + 256 * 0x29,
              1 + 2            + 256 * 0x2D,
              1 + 2            + 256 * 0x31,
              1 + 2            + 256 * 0x35,
              1                + 256 * 0x39,
              1                + 256 * 0x3B,
              1                + 256 * 0x3D,
              1                + 256 * 0x3F,
              1 + 2            + 256 * 0x41,
              1 + 2            + 256 * 0x45,
              1 + 2            + 256 * 0x49,
              1 + 2            + 256 * 0x4D,
              1 + 2            + 256 * 0x51,
              1 + 2            + 256 * 0x55,
              1 + 2            + 256 * 0x59,
              1 + 2            + 256 * 0x5D,
              0, 0, 0, 0, 0, /* 0x63B - 0x63F */
              1 + 2,
              1 + 2            + 256 * 0x61,
              1 + 2            + 256 * 0x65,
              1 + 2            + 256 * 0x69,
              1 + 2       + 16 + 256 * 0x6D,
              1 + 2            + 256 * 0x71,
              1 + 2            + 256 * 0x75,
              1 + 2            + 256 * 0x79,
              1                + 256 * 0x7D,
              1                + 256 * 0x7F,
              1 + 2            + 256 * 0x81,
              4, 4, 4, 4,
              4, 4, 4, 4,      /* 0x64B - 0x652 */
              0, 0, 0, 0, 0,
              0, 0, 0, 0,      /* 0x653 - 0x65B */
              1                + 256 * 0x85,
              1                + 256 * 0x87,
              1                + 256 * 0x89,
              1                + 256 * 0x8B,
              0, 0, 0, 0, 0,
              0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, /* 0x660 - 0x66F */
              4,
              0,
              1           + 32,
              1           + 32,
              0,
              1           + 32,
              1, 1,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1+2, 1+2, 1+2, 1+2,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1, 1, 1, 1, 1, 1, 1, 1,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2, 1+2,
              1,
              1+2,
              1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
              1+2,
              1,
              1+2, 1+2, 1+2, 1+2,
              1, 1
              ];

var LinkFE =[

             1 + 2,
             1 + 2,
             1 + 2, 0, 1+ 2, 0, 1+ 2,
             1 + 2,
             1+ 2, 1 + 2, 1+2, 1 + 2,
             1+ 2, 1 + 2, 1+2, 1 + 2,

             0, 0 + 32, 1 + 32, 0 + 32,
             1 + 32, 0, 1,  0 + 32,
             1 + 32, 0, 2,  1 + 2,
             1, 0 + 32, 1 + 32, 0,
             2, 1 + 2, 1, 0,
             1, 0, 2, 1 + 2,
             1, 0, 2, 1 + 2,
             1, 0, 2, 1 + 2,
             1, 0, 2, 1 + 2,
             1, 0, 2, 1 + 2,
             1, 0, 1, 0,
             1, 0, 1, 0,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0 + 16, 2 + 16, 1 + 2 +16,
             1 + 16, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 2, 1+2,
             1, 0, 1, 0,
             1, 0, 2, 1+2,
             1, 0, 1, 0,
             1, 0, 1, 0,
             1

             ];

var IrreleventPos =          [
                              0x0,
                              0x2,
                              0x4,
                              0x6,
                              0x8,
                              0xA,
                              0xC,
                              0xE,
                              ]  ;


var AlefTable =             [
                             0x0622,
                             0x0623,
                             0x0625,
                             0x0627
                             ];
var LamAlefTable =          [
                             0xfef5,
                             0xfef7,
                             0xfef9,
                             0xfefb
                             ];


var AlefTableFE  =          [
                             0xFE81,
                             0xFE82,
                             0xFE83,
                             0xFE84,
                             0xFE87,
                             0xFE88,
                             0xFE8D,
                             0xFE8E
                             ];


var LamTableFE =            [
                             0xFEDD,
                             0xFEDE,
                             0xFEDF,
                             0xFEE0
                             ];

var  LamAlefTableFE =       [
                             0xfef5,
                             0xfef7,
                             0xfef9,
                             0xfefb,
                             0xfef6,
                             0xfef8,
                             0xfefa,
                             0xfefc
                             ];

//////////////**************** HODbidiShape Function Defnitions ****************************/////////////
function uba_getLink(x){
	if(x >= 0x0622 && x <= 0x06D3)
		return(Link06[x-0x0622]);
	else if(x == 0x200D)
		return(3);
	else if(x >= 0x206D && x <= 0x206F)
		return(4);
	else if(x >= 0xFE70 && x <= 0xFEFC)
		return(LinkFE[x-0xFE70]);
	else
		return(0);
}

function LamAlef(alef){
	for(var i=0;i<AlefTable.length;i++){
		if(AlefTable[i]==alef)
			return LamAlefTable[i];
	}
	return 0;
}

function isAlef(c){
	for(var i=0;i<AlefTable.length;i++){
		if(AlefTable[i]==c) return true;
	}
	return false;
}

function isAlefFE(c){
	for(var i=0;i<AlefTableFE.length;i++){
		if(AlefTableFE[i]==c) return true;
	}
	return false;
}

function isLamFE(c){
	for(var i=0;i<LamTableFE.length;i++){
		if(LamTableFE[i]==c) return true;
	}
	return false;
}

function isLamAlefFE(c){
	for(var i=0;i<LamAlefTableFE.length;i++){
		if(LamAlefTableFE[i]==c) return true;
	}
	return false;
}

function LamAlefFE(alef){
	for(var i=0;i<AlefTableFE.length;i++){
		if(AlefTableFE[i]==alef)
			return LamAlefTableFE[i/2];
	}
	return 0;
}

function specialChar(ch){
	if((ch >= 0x0621 && ch < 0x0626)|| (ch == 0x0627 )||
			(ch > 0x062e && ch < 0x0633) ||
			(ch > 0x0647 && ch < 0x064a) || (ch == 0x0629)
			||  (ch >= 0x065C && ch <= 0x065F))
		return(1);
	else
		return(0);
}

function YeehHamzaChar(ch){
	if ( (ch==0xFE89) ||  (ch==0xFE8A))
		return(true);
	else
		return(false);
}

function Lamalef(x){
	if(x == 0x0622)
		return(0x065C);
	else if(x == 0x0623)
		return(0x065D);
	else if(x == 0x0625)
		return(0x065E);
	else if(x == 0x0627)
		return(0x065F);
	else
		return(0);
}

function SeenChar(ch){
	if ( (ch==0xFEB1) || (ch==0xFEB2) ||
			(ch==0xFEB5) || (ch==0xFEB6) ||
			(ch==0xFEB9) || (ch==0xFEBA) ||
			(ch==0xFEBD) || (ch==0xFEBE) )
		return(true);
	else
		return(false);
}

function CompressLamAlef(UniBuff,length,bRev){
	var  CompressedArray= new Array(length);
	var i=0;
	var j=0;
	var Lam= 0x0644 ;

	for(i=0;i < length - 1;i++){
		if(( bRev && isAlef(UniBuff[i]) && UniBuff[i+1]==Lam)||( !bRev && isAlef(UniBuff[i+1]) && UniBuff[i]==Lam)){
			CompressedArray[j++]=LamAlef((bRev)?UniBuff[i]:UniBuff[i+1]);
			i++;
		}else
			CompressedArray[j++]=UniBuff[i];
	}
	if(i<length)
		CompressedArray[j++]=UniBuff[i];

	return CompressedArray;
}

//////////////**************** HODbidiShape Shape Method ****************************/////////////

function shape (TXT_ORIENTATION_RTL,INPUT_BUFF) {
	shape (TXT_ORIENTATION_RTL,INPUT_BUFF,true);
}

function shape (TXT_ORIENTATION_RTL,INPUT_BUFF,expand_seen_yeh) {
	var currLink;
	var lastLink=0;
	var nextLink=0;
	var prevLink=0;
	var lastPos;
	var Nx;
	var prevPos;
	var iEnd, Nw, step,  Shape, i, Ix;
	var wLamalef;
	var wBuf ;
	var j,x;
	var flag;
	var trgIdx = 0;
	var RTL = true;
	var inOutDiff = false ;
	var size;
	if (INPUT_BUFF.length == 0)
		return;
	var str06 = new Array(INPUT_BUFF.length);
	str06 = INPUT_BUFF;

	if(TXT_ORIENTATION_RTL)
		RTL = true;
	else
		RTL = false;

	inOutDiff = true;

	//str06 = CompressLamAlef(str06,str06.length,!TXT_ORIENTATION_RTL);

	for (var idx = 0; idx < str06.length ; idx++){
		var inputChar = str06[idx];
		if ( ( inputChar >= 0xFE70) && (inputChar <= 0xFEFC )){
			str06[trgIdx] = convertFEto06 [(inputChar - 0xFE70) ]  ;
		}else{
			str06[trgIdx] = inputChar ;
		}
		trgIdx++;
	}
	if (RTL && inOutDiff){
		Ix = 0;
		iEnd = str06.length ;
		step = +1;
	}
	else {
		Ix = str06.length - 1;
		iEnd = -1;
		step = -1;
	}
	size = str06.length;
	prevLink = 0;
	lastLink = 0;

	currLink = uba_getLink ( str06[Ix] );

	prevPos = Ix;
	lastPos = Ix;
	Nx = -2;
	while ( Ix != iEnd ) {
		if ((currLink & 0xFF00) > 0){
			Nw = Ix + step;
			while (Nx < 0){
				if (Nw == iEnd){
					nextLink = 0;
					Nx = 30000;
				} else {
					nextLink = uba_getLink(str06[Nw]);
					if ((nextLink & IRRELEVANT) == 0)
						Nx = Nw;
					else Nw += step;
				}
			}
			if (((currLink & ALEFTYPE) > 0) && ((lastLink & LAMTYPE) > 0)){
				wLamalef = Lamalef( str06[Ix] );
				if ( wLamalef != 0){
					if (RTL && inOutDiff){
						str06[lastPos] = wLamalef ;
						str06[Ix]=  0x0020 ;
						Ix=lastPos;
					} else {
						str06[Ix] = 0x0020;
						str06[lastPos] = wLamalef ;
						Ix=lastPos;
					}
				}
				lastLink = prevLink;
				currLink = uba_getLink(wLamalef);
			}

			flag=specialChar (str06[Ix]);

			if (getAttribute(formatedAttributes, TEXT_SHAPE)  == TEXT_INITIAL){
				if(flag==0)
					Shape = 2;
				else
					Shape = 0;
			} else if (getAttribute(formatedAttributes,TEXT_SHAPE) == TEXT_MIDDLE){
				if(flag == 0)
					Shape = 3;
				else
					Shape = 1;
			} else if (getAttribute(formatedAttributes,TEXT_SHAPE) == TEXT_FINAL){
				if(flag == 0)
					Shape = 1;
				else
					Shape = 1;
			} else if (getAttribute(formatedAttributes, TEXT_SHAPE) == TEXT_ISOLATED){
				Shape = 0;
			}
			else{
				Shape = shapeTable[nextLink & (LINKR + LINKL)]
				[lastLink & (LINKR + LINKL)]
				[currLink & (LINKR + LINKL)];
			}
			str06[Ix] =  (0xFE70 + ( currLink >> 8 ) + Shape) ;
		}
		if ((currLink & IRRELEVANT) == 0) {
			prevLink = lastLink;
			lastLink = currLink;
			prevPos = lastPos;
			lastPos = Ix;
		}
		if ((currLink & IRRELEVANT) > 0) {
			var charidx = str06[Ix] - 0x064B;
			var  MyShape =0;
			var next =  (nextLink & (LINKR + LINKL));
			var last =lastLink & (LINKR + LINKL);

			if (((last==3)&& (next==1))	|| ((last==3) && (next==3)))
				MyShape= 1;
			if (((nextLink & ALEFTYPE) > 0) && ((lastLink & LAMTYPE) > 0))
				MyShape=0;
			if ((str06[Ix]==0x064C) || (str06[Ix]==0x064D))
				MyShape=0;
			str06[Ix] =  (0xFE70 + IrreleventPos[charidx]+ MyShape) ;
		}
		Ix += step;
		if (Ix == Nx){
			currLink = nextLink;
			Nx = -2;
		} else {
			if (Ix != iEnd)
				currLink = uba_getLink ( str06[Ix]) ;
		}
	}
	if(expand_seen_yeh)
		for (var idx = 0; idx < str06.length ; idx++){
			if (RTL && inOutDiff){
				if ((SeenChar(str06[idx])) && ((idx+1 < str06.length)
						&& (str06[idx+1] == 0x0020)))
					str06[idx+1] = TAIL;

				if ((!SeenChar(str06[idx])) && ((idx+1 < str06.length) && ( str06[idx+1] == TAIL)))
					str06[idx+1] = 0x0020;
				if  (YeehHamzaChar(str06[idx]))
					if ((idx+1 < str06.length) && ( str06[idx+1] == 0x0020)){
						if(str06[idx] == 0xFE89)
							str06[idx]   =  0xFEEF;
						else
							str06[idx]   =  0xFEF0;
						str06[idx+1]  =  0xFE80;
					} else{
						if(str06[idx] == 0xFE89)
							str06[idx]   =  0xFE8B;
						else
							str06[idx]   =  0xFE8C;
					}
			} else {
				if ((SeenChar(str06[idx])) && ( (idx-1 >= 0) && ( str06[idx-1] == 0x0020)))
					str06[idx-1] =TAIL;
				if ((!SeenChar(str06[idx])) && ((idx-1 >= 0) && (str06[idx-1] == TAIL)))
					str06[idx-1]=0x0020;

				if (YeehHamzaChar(str06[idx]))
					if ((idx-1 >= 0) && (str06[idx-1] == 0x0020)){
						if(str06[idx] == 0xFE89)
							str06[idx]   =  0xFEEF;
						else
							str06[idx]   =  0xFEF0;
						str06[idx-1]  =  0xFE80;
					} else{
						if(str06[idx] == 0xFE89)
							str06[idx]   =  0xFE8B;
						else
							str06[idx]   =  0xFE8C;
					}
			}
		}
	return str06;
}
/***********************************************************************************/
function ara_type (index,INPUT_STR,TXT_ORIENTATION_RTL){
	var shapeStart = 0;
	var shapeEnd   = 0;
	var displayStart = 0 ;
	var displayEnd   = 0 ;
	var len = INPUT_STR.length;
	var shapeBuff = new Array(len);

	for (var idx0 = 0; idx0 < len ; idx0++)
		shapeBuff[idx0] = INPUT_STR.charCodeAt(idx0);

	if ( len > index + 4){
		shapeEnd = index + 4;
		displayEnd = index + 2;
	}else
		if ( len > index + 3){
			shapeEnd = index + 3;
			displayEnd = index + 2;
		}else
			if ( len > index + 2 )
			{
				shapeEnd = index + 2;
				displayEnd = index + 2;
			}else
				if ( len > index + 1 )
				{
					shapeEnd = index + 1;
					displayEnd = index + 1;
				}else
					if ( len > index  )
					{
						shapeEnd = index ;
						displayEnd = index ;
					}

	if ( index - 4 >= 0){
		shapeStart = index - 4;
		displayStart = index - 2;
	}else
		if ( index - 3 >= 0){
			shapeStart = index - 3;
			displayStart = index - 2;
		}else
			if ( index - 2 >= 0){
				shapeStart = index - 2;
				displayStart = index - 2;
			}else
				if ( index - 1 >= 0){
					shapeStart = index - 1;
					displayStart = index - 1;
				}else
					if ( index  >= 0.0){
						shapeStart = index ;
						displayStart = index ;
					}

	shapeBuff =  shape (TXT_ORIENTATION_RTL,shapeBuff);

	var OUTPUT_BUFF = new Array(len);
	for (var idx0 = 0; idx0 < len ; idx0++)
		OUTPUT_BUFF[idx0] = INPUT_STR.charCodeAt(idx0);

	var dstLen =shapeEnd - shapeStart + 1 ;
	if(shapeEnd - shapeStart > 0){
		for (var indx = shapeStart; indx <= shapeEnd;indx++)
			OUTPUT_BUFF[indx] = shapeBuff[indx];
	}

	var retVal = "";
	for(var idxt =0 ; idxt < OUTPUT_BUFF.length ; idxt++){
		retVal += String.fromCharCode(OUTPUT_BUFF[idxt]);
	}
	return retVal;
}