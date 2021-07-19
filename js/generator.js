var DungeonGenerator=function(mapwidth,mapheight,seed,debug) {

	const
		ROOMPLACEHOLDERS=[
			{
				regex:/{roomId:([^}]*)}/g,
				replace:"{room:1}"
			},
			{
				regex:/{markRoom:([^}]*)}/g,
				replace:"x{room:1}"
			},
			{
				regex:/{ifRoomIsMarked:([^}]*)}/g,
				replace:"x{room:1}"
			},
			{
				regex:/{ifRoomIsNotMarked:([^}]*)}/g,
				replace:"not x{room:1}"
			},
			{
				regex:/{teleportToRoom:([^}]*)}/g,
				replace:"move anywhere in room {room:1}"
			},
			{
				regex:/{ifMoveOn:([^}]*)}/g,
				replace:"Move [{item:1}]"
			},
			{
				regex:/{markItem:([^}]*)}/g,
				replace:"x[{item:1}]"
			}
		];

	var
		originalSeed=seed=seed||Math.random(),
		hero,
		heroModel,
		originalRandomizers,
		randomizers,
		enemies=[],		
		noise=[],
		questsStructure=[],
		gold=0,
		globalPlaceholders={},
		footer="",
		adventureTitle="",
		services=[],
		xpRamp=[],
		hpRamp=[],
		damageRatio=0,
		roomIds=0,
		mapGuidesEvery=0,
		fakeRooms=[],
		fakeDoors=[],
		rooms=[],
		allRooms=[],
		flavorTexts,
		hero,
		quests,
		placeholderModels,
		enemyModels,
		svg;

	this.prepared=false;

	this.setXpRamp=(xprampdata)=>xpRamp=xprampdata;
	this.setHpRamp=(hprampdata)=>hpRamp=hprampdata;
	this.setDamageRatio=(damageratiodata)=>damageRatio=damageratiodata;
	this.setRoomIds=(roomidsdata)=>roomIds=roomidsdata;
	this.setMapGuidesEvery=(mapguideseverydata)=>mapGuidesEvery=mapguideseverydata;
	this.setHeroModels=(herodata)=>heroModels=herodata;
	this.setEnemyModels=(enemydata)=>enemyModels=enemydata;
	this.setQuests=(questsdata)=>quests=questsdata;
	this.setFlavorTexts=(flavortextdata)=>flavorTexts=flavortextdata;
	this.setPlaceholderModels=(placeholdersdata)=>placeholderModels=placeholdersdata;
	this.setGold=(amount)=>gold=amount;
	this.setServices=(servicesdata)=>services=servicesdata;
	this.setQuestsStructure=(questsstructuredata)=>questsStructure=questsstructuredata;
	this.setFooter=(footerdata)=>footer=footerdata;
	this.setRandomizers=(randomizersdata)=>{
		originalRandomizers=clone(randomizersdata);
		randomizers=randomizersdata;
	}

	function random(max) {
		seed = (seed * 9301 + 49297) % 233280;
		return seed / 233280 * max;
	}

	function clone(v) {
		return JSON.parse(JSON.stringify(v));
	}

	function sortById(a,b) {
		if (a.id>b.id) return 1;
		else if (a.id<b.id) return -1;
		else return 0;
	}

	function sortByLength(a,b){
		if (a.length>b.length) return 1;
		else if (a.length<b.length) return -1;
		else return 0;
	}

	function sortByLengthInverse(a,b){
		if (a.length>b.length) return -1;
		else if (a.length<b.length) return 1;
		else return 0;
	}

	function inRoom(x,y,room) {
		return !((x<room.x)||(x>=room.x+room.width)||(y<room.y)||(y>=room.y+room.height));
	}

	function roomsCollide(room1,room2) {
		return !(
			(room1.x+room1.width<=room2.x)||(room1.x>=room2.x+room2.width)||
			(room1.y+room1.height<=room2.y)||(room1.y>=room2.y+room2.height)
		)
	}

	function getDoorId(exit) {
		switch (exit.side) {
			case "up":{ return exit.x+"-"+(exit.y+1); break }
			case "left":{ return (exit.x+1)+"-"+exit.y; break } 
			default: { return exit.x+"-"+exit.y; }
		}
	}

	function getCellValue(x,y,room) {
		return room.id-x-y-2;
	}

	function shuffleArray(arr) {
		for (var i=0;i<10;i++)
			for (var fid=0;fid<arr.length;fid++) {
				var
					tid=getRandomId(arr),
					from=arr[fid];
				arr[fid]=arr[tid];
				arr[tid]=from;
			}
	}

	function getRandomId(arr) {
		return Math.floor(random(arr.length));
	}

	function getRandom(arr) {
		return arr[getRandomId(arr)];
	}

	function setCheckBox(svg,checkbox,number) {
		var
			x=svg.getNum(checkbox,"x"),
			y=svg.getNum(checkbox,"y"),
			width=svg.getNum(checkbox,"width"),
			height=svg.getNum(checkbox,"height"),
			hwidth=width/2,
			hheight=height/2;

		switch (number) {
			case 0:{
				svg.delete(checkbox);
				break;
			}
			case 1:{
				break;
			}
			case 2:{
				svg.cloneNodeBy(checkbox,0,hwidth,0);
				svg.moveNodeAt(checkbox,x-hwidth,y);
				break;
			}
			case 3:{
				svg.cloneNodeBy(checkbox,0,-hwidth,-hheight);
				svg.cloneNodeBy(checkbox,0,hwidth,-hheight);
				svg.moveNodeAt(checkbox,x,y+hheight);
				break;
			}
			case 4:{
				svg.cloneNodeBy(checkbox,0,-hwidth,-hheight);
				svg.cloneNodeBy(checkbox,0,hwidth,-hheight);
				svg.cloneNodeBy(checkbox,0,-hwidth,hheight);
				svg.moveNodeAt(checkbox,x+hwidth,y+hheight);
				break;
			}
			case 5:{
				svg.cloneNodeBy(checkbox,0,-width,-hheight);
				svg.cloneNodeBy(checkbox,0,0,-hheight);
				svg.cloneNodeBy(checkbox,0,width,-hheight);
				svg.cloneNodeBy(checkbox,0,-hwidth,hheight);
				svg.moveNodeAt(checkbox,x+hwidth,y+hheight);
				break;
			}
			case 6:{
				svg.cloneNodeBy(checkbox,0,-width,-hheight);
				svg.cloneNodeBy(checkbox,0,0,-hheight);
				svg.cloneNodeBy(checkbox,0,width,-hheight);
				svg.cloneNodeBy(checkbox,0,-width,hheight);
				svg.cloneNodeBy(checkbox,0,0,hheight);
				svg.moveNodeAt(checkbox,x+width,y+hheight);
				break;
			}
			case 7:{
				svg.cloneNodeBy(checkbox,0,-width,-height);
				svg.cloneNodeBy(checkbox,0,0,-height);
				svg.cloneNodeBy(checkbox,0,width,-height);
				svg.cloneNodeBy(checkbox,0,-width,0);
				svg.cloneNodeBy(checkbox,0,0,0);
				svg.cloneNodeBy(checkbox,0,width,0);
				svg.moveNodeAt(checkbox,x,y+height);
				break;
			}
			case 8:{
				svg.cloneNodeBy(checkbox,0,-width,-height);
				svg.cloneNodeBy(checkbox,0,0,-height);
				svg.cloneNodeBy(checkbox,0,width,-height);
				svg.cloneNodeBy(checkbox,0,-width,0);
				svg.cloneNodeBy(checkbox,0,0,0);
				svg.cloneNodeBy(checkbox,0,width,0);
				svg.cloneNodeBy(checkbox,0,-hwidth,height);
				svg.moveNodeAt(checkbox,x+hwidth,y+height);
				break;
			}
			case 9:{
				svg.cloneNodeBy(checkbox,0,-width,-height);
				svg.cloneNodeBy(checkbox,0,0,-height);
				svg.cloneNodeBy(checkbox,0,width,-height);
				svg.cloneNodeBy(checkbox,0,-width,0);
				svg.cloneNodeBy(checkbox,0,0,0);
				svg.cloneNodeBy(checkbox,0,width,0);
				svg.cloneNodeBy(checkbox,0,-width,height);
				svg.cloneNodeBy(checkbox,0,0,height);
				svg.moveNodeAt(checkbox,x+width,y+height);
				break;
			}
			case 10:{
				svg.cloneNodeBy(checkbox,0,-width-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth+width,-height);
				svg.cloneNodeBy(checkbox,0,-width,0);
				svg.cloneNodeBy(checkbox,0,0,0);
				svg.cloneNodeBy(checkbox,0,width,0);
				svg.cloneNodeBy(checkbox,0,-width,height);
				svg.cloneNodeBy(checkbox,0,0,height);
				svg.moveNodeAt(checkbox,x+width,y+height);
				break;
			}
			case 11:{
				svg.cloneNodeBy(checkbox,0,-width-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth+width,-height);
				svg.cloneNodeBy(checkbox,0,-width-hwidth,0);
				svg.cloneNodeBy(checkbox,0,-hwidth,0);
				svg.cloneNodeBy(checkbox,0,hwidth,0);
				svg.cloneNodeBy(checkbox,0,width+hwidth,0);
				svg.cloneNodeBy(checkbox,0,-width,height);
				svg.cloneNodeBy(checkbox,0,0,height);
				svg.moveNodeAt(checkbox,x+width,y+height);
				break;
			}
			default:{
				svg.cloneNodeBy(checkbox,0,-width-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,-hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth,-height);
				svg.cloneNodeBy(checkbox,0,hwidth+width,-height);
				svg.cloneNodeBy(checkbox,0,-width-hwidth,0);
				svg.cloneNodeBy(checkbox,0,-hwidth,0);
				svg.cloneNodeBy(checkbox,0,hwidth,0);
				svg.cloneNodeBy(checkbox,0,width+hwidth,0);
				svg.cloneNodeBy(checkbox,0,-width-hwidth,height);
				svg.cloneNodeBy(checkbox,0,-hwidth,height);
				svg.cloneNodeBy(checkbox,0,hwidth,height);
				svg.moveNodeAt(checkbox,x+width+hwidth,y+height);
				break;
			}
		}
	}

	function shortestPath(room,path) {
		if (!path) path=[];
		path.push(room.id);
		if (room.isStartingRoom) return path; else {
			var subpaths=[];
			room.exits.forEach(exit=>{
				if (path.indexOf(exit.toRoom.id)==-1) {
					var shortest=shortestPath(exit.toRoom,clone(path));
					if (shortest) subpaths.push(shortest);
				}
			});
			subpaths.sort(sortByLength);
			return subpaths[0];
		}
	}

	function formatRandomizers(line) {
		return line.replace(/\{([^\}]*)\}/g,(m,match)=>{
			var
				randomizerIds=match.split("+"),
				randomizerPool=[];

			randomizerIds.forEach(id=>{
				if (randomizers[id]) randomizerPool.push(id)
			});

			if (randomizerPool.length) {
				var randomizerId=getRandom(randomizerPool);
				if (randomizers[randomizerId].length==0) randomizers[randomizerId]=clone(originalRandomizers[randomizerId]);
				var randomizerIndex=getRandomId(randomizers[randomizerId]),
					randomizer=randomizers[randomizerId][randomizerIndex];
				randomizers[randomizerId].splice(randomizerIndex,1);
				return randomizer;
			} else return m;
		});
	}

	function formatGlobalPlaceholders(line) {		
		line=line.replaceAll("{teleportToStartingRoom}","move anywhere in starting room");
		line=line.replaceAll("{ifLastEnemyKilled}","Last enemy killed");
		line=line.replaceAll("{ifEnterRoom}","Enter room");
		line=line.replaceAll("{ifMoveOnStairs}","Move on stairs");
		line=line.replaceAll("{then}"," &raquo; ");
		line=line.replaceAll("{newRule}"," &brvbar; ");
		line=line.replaceAll("{and}"," &amp; ");
		line=line.replaceAll("{or}"," or ");
		line=line.replaceAll("{stopReading}","stop reading");
		line=line.replaceAll("{cantLeave}","can't leave");
		line=line.replaceAll("{rollDice}","roll a dice: ");
		line=line.replaceAll("{nothing}","nothing happens");
		line=line.replaceAll("{roomIsEmpty}","the room is empty");
		line=line.replaceAll("{nameLine}","_____________________________");
		line=line.replaceAll("{heroClass}",heroModel.heroClass);

		line=line.replace(/\{range:([0-9]+)-([0-9]+)\}/g,(m,num1,num2)=>(num1==num2?"="+num1:num1+"~"+num2));
		line=line.replace(/\{gainXp:([0-9]+)\}/g,(m,num)=>"+"+num+"XP");
		line=line.replace(/\{loseHp:([0-9]+)\}/g,(m,num)=>"-"+num+"HP");
		line=line.replace(/\{gainHp:([0-9]+)\}/g,(m,num)=>"+"+num+"HP");
		line=line.replace(/\{gainGold:([0-9]+)\}/g,(m,num)=>"+"+num+"G");
		line=line.replace(/\{payGold:([0-9]+)\}/g,(m,num)=>"pay "+num+"G");

		for (var k in globalPlaceholders)
			line=line.replaceAll("{"+k+"}",globalPlaceholders[k]);

		return line;
	}

	function formatFakeDescriptionLine(line) {

		var placeholders={roomIds:{},itemIds:{}};

		line=formatRandomizers(line);
		
		ROOMPLACEHOLDERS.forEach(placeholder=>{
			line=line.replace(placeholder.regex,function (line,match){
				var matches=arguments;
				return placeholder.replace.replace(/{([^:]*):([^}]*)}/g,(line,marker,value)=>{
					switch (marker) {
						case "room":{
							if (!placeholders.roomIds[matches[value]]) placeholders.roomIds[matches[value]]=getRandom(rooms);
							return placeholders.roomIds[matches[value]].id;
						}
						case "item":{
							return 1;
						}
						default:{
							return "???";
						}
					}
				})
				return replacement;
			})
		})

		line=formatGlobalPlaceholders(line);

		return line;

	}

	function formatDescriptionLine(line,placeholders) {

		line=formatRandomizers(line);

		ROOMPLACEHOLDERS.forEach(placeholder=>{
			line=line.replace(placeholder.regex,function (line,match){
				var matches=arguments;
				return placeholder.replace.replace(/{([^:]*):([^}]*)}/g,(line,marker,value)=>{
					switch (marker) {
						case "room":{
							return placeholders.roomIds[matches[value]].id;
						}
						case "item":{
							return placeholders.itemIds[matches[value]];
						}
						default:{
							return "???";
						}
					}
				})
				return replacement;
			})
		})

		line=formatGlobalPlaceholders(line);

		return line;
	}

	
	function solveRoomTemplateArgument(argument) {
		if (Array.isArray(argument))
			return argument[getRandomId(argument)];
		else
			return argument;
	}

	// Rooms

	var Room=function(x,y,width,height,isCorridor,isStartingRoom) {
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height;
		this.isCorridor=!!isCorridor;
		this.isStartingRoom=!!isStartingRoom;
		this.occupiedSpaces={};
		this.exits=[];
		this.items=[];
		this.description=[];

		this.addItem=function(x,y,item) {
			var id=x+","+y;
			if (this.occupiedSpaces[id]) {
				if ((item.id!="entrance")||(this.occupiedSpaces[id].id!="entrance"))
					console.warn("Conflicting space in room",this," @",x,",",y,"want place",item,"but there is",this.occupiedSpaces[id]);
				return false;
			} else {
				this.occupiedSpaces[id]=item;
				this.items.push({
					x:x,
					y:y,
					item:item
				});
				return true;
			}
		}

		this.getFreeSpaces=function() {
			var list=[];
			for (var y=0;y<this.height;y++)
				for (var x=0;x<this.width;x++) {
					var id=x+","+y;
					if (!this.occupiedSpaces[id]) list.push({x:x,y:y});
				}
			return list;
		}

		this.addEntrance=function(x,y,fromroom) {
			return this.addItem(x-this.x,y-this.y,{
				id:"entrance",
				fromRoom:fromroom
			});
		}

		this.addExit=function(x,y,side,toroom) {
			this.exits.push({
				toRoom:toroom,
				x:x,
				y:y,
				side:side
			});
		}

		this.setId=function(id) {
			this.id=id;
		}

		this.removeRooms=function(rooms) {
			var newExits=[];
			this.exits.forEach(exit=>{
				if (rooms.indexOf(exit.toRoom)==-1) newExits.push(exit);
			})
			this.exits=newExits;
		}

		this.createEntrances=function() {
			this.exits.forEach(exit=>{
				exit.toRoom.addEntrance(exit.x,exit.y,this);
			})
		}

		this.makeFake=function() {
			this.exits=[];
			this.occupiedSpaces={};
			this.items=[];
			this.description=[];
		}

		this.applyDelta=function(delta) {
			this.id+=delta;
		}

		return this;
	}

	this.addRoom=function(x,y,width,height,isCorridor,isStartingRoom) {
		var room=new Room(
			solveRoomTemplateArgument(x),
			solveRoomTemplateArgument(y),
			solveRoomTemplateArgument(width),
			solveRoomTemplateArgument(height),
			isCorridor,isStartingRoom);
		rooms.push(room);
		return room;
	}

	this.scatterRooms=function() {
		// TODO continua per un pò a distribuire le stanze
		var valid=false;
		shuffleArray(rooms);
		for (var i=0;i<100;i++) {
			var
				minx=9999,
				miny=9999,
				maxx=0,
				maxy=0,
				angle=random(Math.PI*2),
				dx,dy;
			for (var i=0;i<rooms.length;i++) {
				angle+=0.1+random(1);
				var
					ok=false,
					room=rooms[i],
					dx=Math.sin(angle),
					dy=Math.cos(angle),
					ox=0,
					oy=0;
				room.x=0;
				room.y=0;

				while (!ok) {
					ok=true;
					for (var j=0;j<i;j++)
						if (roomsCollide(room,rooms[j])) {
							ok=false;
							break;
						}
					if (!ok) {
						ox+=dx;
						oy+=dy;
						if (Math.abs(room.x-ox)>Math.abs(room.y-oy))
							if (room.x>ox) room.x--;
							else room.x++;
						else
							if (room.y>oy) room.y--;
							else room.y++;
					}
				}
				room.x=Math.floor(room.x);
				room.y=Math.floor(room.y);
				if (room.x<minx) minx=room.x;
				if (room.y<miny) miny=room.y;
				if (room.x+room.width>maxx) maxx=room.x+room.width;
				if (room.y+room.height>maxy) maxy=room.y+room.height;
			}
			var
				w=maxx-minx,
				h=maxy-miny;
			valid=((w<=mapwidth)&&(h<=mapheight));
			if (valid) break;				
		}
		
		if (valid) {
			minx-=Math.floor((mapwidth-w)/2);
			miny-=Math.floor((mapheight-h)/2);
			rooms.forEach(room=>{
				room.x-=minx;
				room.y-=miny;
			})
			return true;
		} else return false;
	}

	this.assignIdRooms=function() {
		var ids=[];

		for (var i=0;i<roomIds;i++) ids.push(i);
		shuffleArray(ids);

		rooms.forEach((room,index)=>room.setId(ids[index]));
	}

	this.prepareExits=function() {
		var
			exits={},
			newRooms=[];
		rooms.forEach(room=>{
			// Detect doors
			for (var x=room.x;x<room.x+room.width;x++)
				for (var y=room.y;y<room.y+room.height;y++) {
					rooms.forEach(roomto=>{
						if (room!==roomto) {
							var exitid=Math.min(room.id,roomto.id)+"-"+Math.max(room.id,roomto.id);
							if (!exits[exitid]) exits[exitid]=[];
							if (inRoom(x-1,y,roomto)) exits[exitid].push({from:{room:room,x:x,y:y},to:{room:roomto,x:x-1,y:y},sides:["left","right"]});
							if (inRoom(x+1,y,roomto)) exits[exitid].push({from:{room:room,x:x,y:y},to:{room:roomto,x:x+1,y:y},sides:["right","left"]});
							if (inRoom(x,y-1,roomto)) exits[exitid].push({from:{room:room,x:x,y:y},to:{room:roomto,x:x,y:y-1},sides:["up","down"]});
							if (inRoom(x,y+1,roomto)) exits[exitid].push({from:{room:room,x:x,y:y},to:{room:roomto,x:x,y:y+1},sides:["down","up"]});
						}
					})
				}
		});
		for (var k in exits) {
			if (exits[k].length) {
				var exit=getRandom(exits[k]);
				exit.from.room.addExit(exit.to.x,exit.to.y,exit.sides[0],exit.to.room);
				exit.to.room.addExit(exit.from.x,exit.from.y,exit.sides[1],exit.from.room);
			}
		}
		rooms.forEach(room=>{
			allRooms.push(room);
			if (room.isCorridor&&(room.exits.length<2)) fakeRooms.push(room);
			else newRooms.push(room);
		});
		newRooms.forEach(room=>room.removeRooms(fakeRooms));
		newRooms.forEach(room=>room.createEntrances());
		rooms=newRooms;
	}

	this.optimizeIds=function() {
		var min=10000;
		allRooms.forEach(room=>{
			room.exits.forEach(exit=>{
				var number=getCellValue(exit.x,exit.y,exit.toRoom);
				if (number<min) min=number;
			});
		});
		allRooms.forEach(room=>room.applyDelta(-min));
		return min;
	}

	this.sortRooms=function() {
		rooms.sort(sortById)
	}

	// Quests

	this.getRoutes=function() {
		var
			paths=[],
			roomsIndex={},
			routes=[];

		rooms.forEach(room=>{
			roomsIndex[room.id]={
				room:room,
				freeSpaces:room.getFreeSpaces()
			}
		})
		rooms.forEach(room=>{
			if (!room.isStartingRoom) {
				var
					path=shortestPath(room),
					route=[];
				path.forEach(roomid=>{
					var indexnode=roomsIndex[roomid];
					if (
						!indexnode.room.isStartingRoom&&
						indexnode.freeSpaces.length
					) route.push(indexnode);
				})
				if (route.length) routes.push(route);
			}
		});
		routes.sort(sortByLengthInverse);
		return routes;
	}

	this.getQuestSubroute=function(route,quest) {
		// Decide rooms
		var
			ok=true,
			routeCopy=[],
			questSubroute=[],
			minRooms=quest.minRooms||quest.steps.length;

		if (route.length<minRooms) return false;
		else {

			route.forEach(room=>routeCopy.push(room));

			quest.steps.forEach(step=>{
				var subroute=[];
				// Filter suitable rooms
				routeCopy.forEach(room=>{
					if (
						!room.room.isBusy&&
						(!step.items||(room.freeSpaces.length>=step.items.length))&&
						(!step.roomDescriptions||(room.room.description.length+step.roomDescriptions[0].length<3))
					) subroute.push(room);
				});
				if (subroute.length) {
					var pos=Math.floor((1-(step.atPercentage/100))*subroute.length);
					questSubroute.push(subroute[pos]);
					routeCopy.splice(routeCopy.indexOf(subroute[pos]),1);				
				} else ok=false;
			});

			return ok?questSubroute:false;
		}
	}

	this.addQuest=function(set,excludeQuests) {

		var
			quests=[],
			routes=this.getRoutes();

		set.forEach(quest=>{
			if (excludeQuests.indexOf(quest)==-1) {
				var subroutes=[];
				routes.forEach(route=>{
					var subroute=this.getQuestSubroute(route,quest);
					if (subroute) subroutes.push(subroute);
				})
				if (subroutes.length) quests.push({subroutes:subroutes,quest:quest});
			}
		})

		if (quests.length) {
			var
				quest=getRandom(quests),
				subroute=getRandom(quest.subroutes);
			this.applyQuest(subroute,quest.quest);
			return quest.quest;
		} else return false;
	}

	this.addQuests=function() {

		var
			quest,
			addedQuests=[];

		questsStructure.forEach(entry=>{
			for (var i=0;i<entry.count;i++)
				if (quest=this.addQuest(quests[entry.questType],addedQuests)) addedQuests.push(quest);
		});
	}

	this.applyQuest=function(subroute,quest) {
		var
			placeholders={
				roomIds:{},
				itemIds:{}
			};

		// Prepare room labels
		quest.steps.forEach((step,index)=>placeholders.roomIds[step.id]=subroute[index].room);

		rooms.forEach(room=>{
			placeholders.roomIds["id-"+room.id]=room;
			if (room.isStartingRoom) placeholders.roomIds["startingRoom"]=room;
		});

		// Add items and prepare item labels
		quest.steps.forEach((step,index)=>{
			var
				room=subroute[index],
				genericItemId=0;
			room.room.isBusy=true;
			if (step.items)
				step.items.forEach(item=>{
					var freeSpace=getRandomId(room.freeSpaces),
						pos=room.freeSpaces.splice(freeSpace,1)[0];
					if (item.genericItem) {
						genericItemId++;
						room.room.addItem(pos.x,pos.y,{id:"genericItem",itemId:genericItemId});
						placeholders.itemIds[item.genericItem]=genericItemId;
					} else room.room.addItem(pos.x,pos.y,item);
				});
		});

		// Add room labels
		quest.steps.forEach((step,index)=>{
			if (step.roomDescriptions) {
				var
					roomDescription=getRandom(step.roomDescriptions),
					room=subroute[index].room;
				roomDescription.forEach(line=>{
					room.description.push(formatDescriptionLine(line,placeholders));
				});
			}
		});

		// Add extra room labels
		if (quest.otherDescriptions)
			quest.otherDescriptions.forEach(line=>{
				var
					roomDescription=getRandom(line.roomDescriptions),
					room=placeholders.roomIds[line.at];
				roomDescription.forEach(line=>{
					room.description.push(formatDescriptionLine(line,placeholders));
				})
			})

		// Set adventure metadata
		if (quest.adventureTitle) adventureTitle=getRandom(quest.adventureTitle);
	}

	// Flavor text

	this.addFlavorTexts=function() {
		var flavors=clone(flavorTexts);
		allRooms.forEach(room=>{
			if (room.description.length<2)
				if (room.isCorridor) {
					if (flavors.corridors.length) {
						var lineId=getRandomId(flavors.corridors),
							line=flavors.corridors[lineId];
						if (debug&&debug.flavorText) line=debug.flavorText;
						flavors.corridors.splice(lineId,1);
						room.description.unshift(line);
					}
				} else if (flavors.rooms.length) {
					var lineId=getRandomId(flavors.rooms),
						line=flavors.rooms[lineId];
					if (debug&&debug.flavorText) line=debug.flavorText;
					flavors.rooms.splice(lineId,1);
					room.description.unshift(line);
				}
		})
	}

	// Obfuscation

	this.addNoise=function() {
		var
			itemsPlaces=[],
			itemPlacesIndex={},
			fakeEntrancesIndex={};
			fakeDoorsPool=[];

		function addFakeEntrance(x,y) {
			var id=x+","+y;
			if (!fakeEntrancesIndex[id]) {
				noise.push({id:"fakeEntrance",x:x,y:y});
				if (itemPlacesIndex[id]) {
					itemsPlaces.splice(itemsPlaces.indexOf(itemPlacesIndex[id]),1);
					delete itemPlacesIndex[id];
				}
				fakeEntrancesIndex[id]=1;
			}
		}

		for (var y=0;y<mapheight;y++)
			for (var x=0;x<mapheight;x++) {
				var
					cell={x:x,y:y},
					insideRoom=false,
					onRoomBorderLeft=false,
					onRoomBorderTop=false;
				rooms.forEach(room=>{
					if (inRoom(x,y,room)) insideRoom=room;
					else if (inRoom(x+1,y,room)) onRoomBorderLeft=room;
					else if (inRoom(x,y+1,room)) onRoomBorderTop=room;
				});
				if (!insideRoom) {
					itemPlacesIndex[x+","+y]=cell;
					itemsPlaces.push(cell);
					if ((x+1!=mapwidth)&&!onRoomBorderLeft) fakeDoorsPool.push({id:"fakeDoorRight",x:cell.x,y:cell.y,dx:cell.x+1,dy:cell.y});
					if ((y+1!=mapheight)&&!onRoomBorderTop) fakeDoorsPool.push({id:"fakeDoorDown",x:cell.x,y:cell.y,dx:cell.x,dy:cell.y+1});
				}
			}

		// Randomly add doors
		for (var i=0;i<20;i++)
			if (fakeDoorsPool.length) {
				var doorIndex=getRandomId(fakeDoorsPool),
					door=fakeDoorsPool[doorIndex];
				fakeDoorsPool.splice(doorIndex,1);
				noise.push(door);
				addFakeEntrance(door.x,door.y);
				addFakeEntrance(door.dx,door.dy);
			}

		// Randomly add items
		for (var i=0;i<20;i++)
			if (itemsPlaces.length) {
				var positionIndex=getRandomId(itemsPlaces),
					position=itemsPlaces[positionIndex];
				itemsPlaces.splice(positionIndex,1);
				switch (getRandom(["fakeEnemy","fakeGenericItem"])) {
					case "fakeEnemy":{
						noise.push({id:"fakeEnemy",x:position.x,y:position.y,level:Math.floor(random(4))});
						break;
					}
					case "fakeGenericItem":{
						noise.push({id:"fakeGenericItem",x:position.x,y:position.y,itemId:1+Math.floor(random(2))});
						break;
					}
				}
			}


	}

	this.addFakeRooms=function() {
		var
			fakeDescriptions=[];

		for (var k in quests) {
			quests[k].forEach(quest=>{
				quest.steps.forEach(step=>{
					step.roomDescriptions.forEach(description=>{
						fakeDescriptions.push(description);	
					})
				})
			})
		}

		if (debug&&debug.dumpSentences)
			fakeDescriptions.forEach(lines=>{
				lines.forEach(line=>{
					console.warn(formatFakeDescriptionLine(line))
				})
			});

		fakeRooms.forEach(room=>{
			room.makeFake();
			var description=getRandom(fakeDescriptions);
			description.forEach(line=>{
				room.description.push((debug&&debug.showFake?"[FAKE] ":"")+formatFakeDescriptionLine(line))
			})
			rooms.push(room);
		})

	}

	// Enemies

	this.generateEnemies=function() {
		enemyModels.forEach((model,id)=>{
			enemies.push({
				level:id,
				gainXp:id||1,
				defense:id||1,
				skills:getRandom(model.skills)
			})
		});
	}

	// Hero

	this.generateHero=function() {
		var			
			dungeonXp=0,
			dungeonEnemies=0;
			
		hero={
			model:heroModel,
			skills:[],
			defense:[]
		};

		rooms.forEach(room=>{
			room.items.forEach(item=>{
				if (item.item.id=="enemy") {
					dungeonEnemies++;
					// Calculate dungeon XPs (except final boss, if any)
					if (!item.item.isFinalBoss) {
						dungeonXp+=enemies[0].gainXp;
						if (item.item.level>0)
							dungeonXp+=enemies[item.item.level].gainXp;
					}
				}
			})
		});

		var maxHp=dungeonEnemies*damageRatio;

		// Generate skills
		heroModel.skills.forEach((skill,index)=>{
			hero.defense.push(heroModel.defense[index]),
			hero.skills.push({
				xp:Math.ceil(xpRamp[index]*dungeonXp),
				hp:Math.ceil(hpRamp[index]*maxHp),
				skills:skill
			})
		});
	}

	this.selectHeroModel=function() {
		heroModel=getRandom(heroModels);
	}

	// Global placeholders

	this.prepareGlobalPlaceholders=function() {
		for (var k in placeholderModels)
			globalPlaceholders[k]=getRandom(placeholderModels[k]);
	}

	// Metadata

	this.setupMetadata=function() {
		this.metadata={
			seed:originalSeed,
			title:formatDescriptionLine(adventureTitle),
			header:formatDescriptionLine(globalPlaceholders.adventureHeader)
		}
	}

	// Initializer

	this.prepare=function() {
		if (!this.prepared) {
			this.prepared=true;

			// Initialize
			this.prepareGlobalPlaceholders();
			this.selectHeroModel();

			// Prepare rooms
			this.scatterRooms();
			this.assignIdRooms();
			this.prepareExits();
			this.optimizeIds();

			// Prepare quests
			this.addQuests();

			// Generate actors
			this.generateEnemies();
			this.generateHero();

			// Add noise and tidy up
			this.addNoise();
			this.addFakeRooms();
			this.addFlavorTexts();
			this.sortRooms();

			// Setup metadata
			this.setupMetadata();
		}
	}

	// Renderers

	this.debug=function() {
		var
			CELLSIZE=30,
			HCELLSIZE=CELLSIZE/2,
			canvas=document.createElement("canvas"),
			div=document.createElement("div"),
			table="<table border=1>";

		canvas.style.border="2px solid #ccc";
		canvas.width=mapwidth*CELLSIZE;
		canvas.height=mapheight*CELLSIZE;

		var ctx=canvas.getContext("2d");

		this.prepare();

		noise.forEach(item=>{
			var
				x=item.x,
				y=item.y,
				px=x*CELLSIZE,
				py=y*CELLSIZE;
			switch (item.id) {
				case "fakeEntrance":{
					ctx.beginPath();		
					ctx.fillStyle="#fcc";	
					ctx.fillRect(px,py,CELLSIZE,CELLSIZE);
					ctx.stroke();	
					break;
				}
				case "fakeDoorRight":
				case "fakeDoorDown":{					
					break;
				}
				default:{
					ctx.beginPath();		
					ctx.fillStyle="#eee";	
					ctx.fillRect(px,py,CELLSIZE,CELLSIZE);
					ctx.stroke();
					break;
				}				
			}
		});

		noise.forEach(item=>{
			var
				x=item.x,
				y=item.y,
				px=x*CELLSIZE,
				py=y*CELLSIZE;
			switch (item.id) {
				case "fakeDoorRight":
				case "fakeDoorDown":{
					ctx.beginPath();
					ctx.strokeStyle="#f0f";	
					ctx.moveTo(px+HCELLSIZE,py+HCELLSIZE);
					if (item.id=="fakeDoorRight") ctx.lineTo(px+HCELLSIZE+CELLSIZE,py+HCELLSIZE);
					else ctx.lineTo(px+HCELLSIZE,py+HCELLSIZE+CELLSIZE);
					ctx.stroke();
					break;
				}
			}
		});

		rooms.forEach(room=>{
			table+="<tr>";
			table+="<td>"+room.id+"</td>";
			table+="<td>@"+room.x+","+room.y+" "+room.width+"x"+room.height+"</td>";

			ctx.beginPath();		
			ctx.strokeStyle="#000";	
			ctx.rect(
				room.x*CELLSIZE,
				room.y*CELLSIZE,
				room.width*CELLSIZE,
				room.height*CELLSIZE
			);
			ctx.stroke();	
			ctx.font = HCELLSIZE+"px Arial";
			ctx.fillStyle="#f00";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(room.id, room.x*CELLSIZE+(room.width*CELLSIZE/2),room.y*CELLSIZE+(room.height*CELLSIZE/2));
			
			table+="<td>";
			room.exits.forEach(exit=>{
				var
					px=exit.x*CELLSIZE,
					py=exit.y*CELLSIZE;
				table+="@"+exit.x+","+exit.y+" door "+getCellValue(exit.x,exit.y,exit.toRoom)+" &raquo; room "+exit.toRoom.id+"<br>";
				ctx.beginPath();
				ctx.strokeStyle="#0ff";	
				ctx.moveTo(px+HCELLSIZE,py+HCELLSIZE);
				switch (exit.side) {
					case "right":{
						ctx.lineTo(px,py+HCELLSIZE);
						break;
					}
					case "left":{
						ctx.lineTo(px+CELLSIZE,py+HCELLSIZE);
						break;
					}
					case "down":{
						ctx.lineTo(px+HCELLSIZE,py);
						break;
					}
					case "up":{
						ctx.lineTo(px+HCELLSIZE,py+CELLSIZE);
						break;
					}
				}
				ctx.stroke();
			});
			table+="</td>";
			table+="</tr>";

			room.items.forEach(item=>{
				var
					x=room.x+item.x,
					y=room.y+item.y,
					px=x*CELLSIZE,
					py=y*CELLSIZE,
					item=item.item;

				ctx.font = HCELLSIZE+"px Arial";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				switch (item.id) {
					case "entrance":{						
						ctx.fillStyle="#000";
						ctx.fillText(getCellValue(x,y,room), px+HCELLSIZE, py+HCELLSIZE);						
						break;
					}
					case "enemy":{						
						ctx.fillStyle="#f00";
						ctx.fillText("E"+item.level, px+HCELLSIZE, py+HCELLSIZE);						
						break;
					}
					case "genericItem":{						
						ctx.fillStyle="#0ff";
						ctx.fillText("g"+item.itemId, px+HCELLSIZE, py+HCELLSIZE);						
						break;
					}
					default:{
						ctx.fillStyle="#f0f";
						ctx.fillText({
							stairs:"S"
						}[item.id]||"?", px+HCELLSIZE, py+HCELLSIZE);	
						break;
					}
				}
			});
		});


		div.innerHTML=table+"</table>";

		document.body.style.backgroundColor="#fff";
		document.body.style.color="#000";
		document.body.style.overflow="scroll";
		document.body.appendChild(canvas);
		document.body.appendChild(div);
	}

	this.downloadPDF=function(filename) {
		this.createSVG(svg=>{
			svg.getPDF(filename);
		})
	}

	this.downloadSVG=function(filename) {
		this.createSVG(svg=>{
			svg.download(filename);
		})
	}

	this.showSVG=function() {
		this.createSVG(svg=>{

			document.write("<body>");

			// Print
			var div=document.createElement("div");
			div.style.display="inline-block";
			div.innerHTML=svg.getSVG();
			document.body.appendChild(div);

			// Buttons
			var btn=document.createElement("input");
			btn.type="button";
			btn.value="Download PDF";
			btn.onclick=()=>{
				this.downloadPDF("dungeon.pdf")
			}
			document.body.appendChild(btn);

			var btn=document.createElement("input");
			btn.type="button";
			btn.value="Download SVG";
			btn.onclick=()=>{
				this.downloadSVG("dungeon.svg");
			}
			document.body.appendChild(btn);
			
		});
	}

	this.createSVG=function(cb) {

		if (svg) cb(svg);
		else {

			this.prepare();

			var template=new SVGTemplate("svg/model.svg?"+Math.random());
			template.load(xml=>{
				svg=new SVG(template);

				// Draw & prepare empty grid
				var
					grid=[],
					cell=svg.getById("gridCell"),
					cellWidth=svg.getNum(cell,"width"),
					cellHeight=svg.getNum(cell,"height");
				for (var y=0;y<mapheight;y++) {
					var gridrow=[];
					grid.push(gridrow);
					for (var x=0;x<mapwidth;x++) {
						gridrow.push(0);
						svg.cloneNodeBy("gridCell","c_"+x+"_"+y,x*cellWidth,y*cellHeight);
					}
				}

				// Draw Axis
				for (var y=0;y<mapheight;y++) svg.setText(svg.cloneNodeBy("gridRow",0,0,y*cellHeight),y+1);
				for (var x=0;x<mapwidth;x++) svg.setText(svg.cloneNodeBy("gridCol",0,x*cellWidth,0),x+1);

				// Draw guides
				for (var y=0;y<mapheight;y+=mapGuidesEvery)
					for (var x=0;x<mapwidth;x+=mapGuidesEvery) 
						svg.cloneNodeBy("gridGuide",0,x*cellWidth,y*cellHeight,cellWidth*mapGuidesEvery,cellHeight*mapGuidesEvery);

				// Render rooms
				var
					roomDataHeight=svg.getNum(svg.getById("roomHeight"),"height"),
					renderedDoors={};
				rooms.forEach((room,index)=>{

					// Render starting room
					if (room.isStartingRoom)
						svg.cloneNodeBy("startingRoom",0,room.x*cellWidth,room.y*cellHeight,cellWidth*room.width,cellHeight*room.height);
					room.exits.forEach(exit=>{
						var id=getDoorId(exit);
						if (!renderedDoors[id]) {
							renderedDoors[id]=1;
							switch (exit.side) {
								case "up":{
									svg.cloneNodeBy("doorDown",0,exit.x*cellWidth,exit.y*cellHeight);
									break;
								}
								case "down":{
									svg.cloneNodeBy("doorUp",0,exit.x*cellWidth,exit.y*cellHeight);
									break;
								}
								case "right":{
									svg.cloneNodeBy("doorLeft",0,exit.x*cellWidth,exit.y*cellHeight);
									break;
								}
								case "left":{
									svg.cloneNodeBy("doorRight",0,exit.x*cellWidth,exit.y*cellHeight);
									break;
								}
							}						
						}
					});

					// Render room items
					room.items.forEach(item=>{
						var
							x=item.x+room.x,
							y=item.y+room.y,
							px=x*cellWidth,
							py=y*cellHeight,
							item=item.item;
						switch (item.id) {
							case "entrance":{
								svg.setText(svg.cloneNodeBy("gridNumber",0,px,py),getCellValue(x,y,room));
								break;
							}
							case "enemy":{
								var enemy=svg.cloneNodeBy("gridEnemy",0,px,py);
								setCheckBox(svg,svg.getById("gridEnemyLevel",enemy),item.level);
								break;
							}
							case "genericItem":{
								var genericItem=svg.cloneNodeBy("gridItem",0,px,py);							
								svg.setText(svg.getById("gridItemId",genericItem),item.itemId);
								break;
							}
							case "stairs":{
								svg.cloneNodeBy("gridStairs","map-stairs",px,py);
								break;
							}
						}
					});

					// Render rooms list
					var roomData=svg.cloneNodeBy("roomData",0,0,roomDataHeight*index);
					if (room.isStartingRoom) {
						svg.delete(svg.getById("roomCoords",roomData),roomData);
						svg.setId(svg.getById("roomHeight",roomData),"list-stairs");
					} else {
						svg.delete(svg.getById("roomStarting",roomData),roomData);
						svg.setText(svg.getById("roomPosition",roomData),(room.x+1)+","+(room.y+1));
						svg.setText(svg.getById("roomSize",roomData),room.width+"x"+room.height);
					}
					svg.setText(svg.getById("roomId",roomData),room.id);				
					svg.setText(svg.getById("roomLine1",roomData),room.description[0]||"");
					svg.setText(svg.getById("roomLine2",roomData),room.description[1]||"");
				});

				// Render hero
				var tierWidth=svg.getNum(svg.getById("heroBox"),"width");
				hero.skills.forEach((tier,index)=>{
					var skillTier=svg.cloneNodeBy("heroTier",0,tierWidth*index,0);
					svg.setText(svg.getById("heroSkillUp",skillTier),tier.skills[0]||"");
					svg.setText(svg.getById("heroSkillDown",skillTier),tier.skills[1]||"");
					svg.setText(svg.getById("heroDefense",skillTier),hero.defense[index]?"+"+hero.defense[index]+" DEF":"-");
					setCheckBox(svg,svg.getById("heroXp",skillTier),tier.xp);
					setCheckBox(svg,svg.getById("heroHp",skillTier),tier.hp);
				});

				// Render enemies
				var tierWidth=svg.getNum(svg.getById("enemyBox"),"width");
				enemies.forEach((enemy,index)=>{
					var skillTier=svg.cloneNodeBy("enemyTier",0,tierWidth*index,0);
					if (index==0) svg.delete(svg.getById("enemySymbol",skillTier));
					else svg.delete(svg.getById("enemyOutline",skillTier));
					svg.setText(svg.getById("enemySkillUp",skillTier),enemy.skills[0]||"");
					svg.setText(svg.getById("enemySkillDown",skillTier),enemy.skills[1]||"");
					svg.setText(svg.getById("enemyXp",skillTier),"+"+enemy.gainXp+" XP");
					svg.setText(svg.getById("enemyDefense",skillTier),enemy.defense?"+"+enemy.defense+" DEF":"-");
					setCheckBox(svg,svg.getById("enemyLevel",skillTier),enemy.level);
				});

				// Render noise
				noise.forEach(item=>{
					var
						x=item.x,
						y=item.y,
						px=x*cellWidth,
						py=y*cellHeight;
					switch (item.id) {
						case "fakeEntrance":{
							svg.setText(svg.cloneNodeBy("gridNumber",0,px,py),Math.abs(getCellValue(x,y,getRandom(rooms))));
							break;
						}
						case "fakeEnemy":{
							var enemy=svg.cloneNodeBy("gridEnemy",0,px,py);
							setCheckBox(svg,svg.getById("gridEnemyLevel",enemy),item.level);
							break;
						}
						case "fakeGenericItem":{
							var genericItem=svg.cloneNodeBy("gridItem",0,px,py);							
							svg.setText(svg.getById("gridItemId",genericItem),item.itemId);
							break;
						}
						case "fakeDoorDown":{
							svg.cloneNodeBy("doorDown",0,item.x*cellWidth,item.y*cellHeight);
							break;
						}
						case "fakeDoorRight":{
							svg.cloneNodeBy("doorRight",0,item.x*cellWidth,item.y*cellHeight);
							break;
						}
					}
				});

				// Render gold
				var goldSize=svg.getNum(svg.getById("goldLeft"),"width")+0.55;
				for (var i=0;i<gold;i++)
					svg.cloneNodeBy("goldLeft",0,goldSize*i,0);

				// Render services
				var serviceHeight=svg.getNum(svg.getById("serviceCheckbox"),"width")+1.2;
				services.forEach((service,index)=>{
					var line=svg.cloneNodeBy("serviceBox",0,0,index*serviceHeight);
					svg.setText(svg.getById("serviceName",line),service);
				});

				// Render adventure metadata
				svg.setText(svg.getById("adventureTitle"),this.metadata.title);
				svg.setText(svg.getById("adventureHeader"),this.metadata.header);

				// Render footer
				svg.setText(svg.getById("footer"),footer);

				// Delete stencils
				svg.deleteById("serviceBox");
				svg.deleteById("goldLeft");
				svg.deleteById("heroTier");
				svg.deleteById("enemyTier");
				svg.deleteById("gridCol");
				svg.deleteById("gridRow");
				svg.deleteById("gridCell");
				svg.deleteById("gridNumber");
				svg.deleteById("startingRoom");
				svg.deleteById("doorUp");
				svg.deleteById("doorDown");
				svg.deleteById("doorLeft");
				svg.deleteById("doorRight");
				svg.deleteById("roomData");
				svg.deleteById("gridStairs");
				svg.deleteById("gridEnemy");
				svg.deleteById("gridItem");
				svg.deleteById("gridGuide");
				svg.deleteById("guides");

				cb(svg);

			});

		}

	}

	return this;
}