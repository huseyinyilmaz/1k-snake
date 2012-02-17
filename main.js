c.width = 600;
c.height = 600;

//offset between moves
d = [[-1,0],//left
	 [0, -1],//up
	 [1,0],//right
	 [0,1]];//down

i = 2; // current offset index

s = null; // this will ve stored as a linked list

//colors that was used in game
k = [
    '#000',
    '#00f',
    '#f00'];

x = 0;
//draws a black rectangle to given location
function fillRect(x,y,height,width,color){
    a.fillStyle = k[color];
    a.fillRect(x*20,(y-1)*20,width*20,height*20);
}

//construct a new node for linked list
function cons(x,y,next){
    return {
	x:x,
	y:y,
	n:next};
}

//create a random number with given max value
function getrandom(max){return Math.floor(Math.random()*max);}

//remove last node from snake and erease it from screen
function removeLast(current, last){
    if(!last.n){
	current.n = undefined;
	fillRect(last.x,last.y,1,1,0);
    }else
	removeLast(last,last.n);}

// check if given node memver of given list
// comparison is done by location only
function hasItem(list,node){
    if(! list)
	return false;
    if(node.x == list.x && node.y == list.y)
	return true;
    else
	return hasItem(list.n,node);
}

function drawHeart(){
    fillRect(p.x,p.y,1,1,0);
    x = ++x%5;
    a.font = 13 + x +"pt Calibri";
    a.fillStyle = k[2];
    a.fillText('♥', p.x*20, p.y*20);
}

//create a random point on screen for snake to collect 
function createPoint(){
    p ={x : getrandom(30),
	y : getrandom(30)+1};
    //if point is on snake create another one else draw it on screen
    if(hasItem(s,p))
	createPoint();
    else{
	drawHeart();
    }
}

//main loop
function loop(){
    // if we are startin the game do just set starting values
    // pass main logic
    if(s){
	//add a new node to snake
	s = cons((s.x + d[i][0])%30, // mod 30 makes sure that if we get out of the screen get it snake back from index 0
		     ((s.y-1 + d[i][1])%30)+1,
		     s);
	//if snake is going below 0
	//just make it re-enter from other side of the screen
	if(s.x<0) s.x = 29;
	if(s.y<1) s.y = 30;

	//if we eat point create another point and not remove last node
	if((s.x == p.x) && (s.y == p.y))
	    createPoint();
	else
	    removeLast(s,s.n);
	//draw newly created node
	fillRect(s.x,s.y,1,1,1);
	drawHeart()
	//if head is overloping any other node restart game
	if(hasItem(s.n,s))
	    s = null;
    }
    //set default values for game
    if(!s){
	i = 2;
        s= cons(5,1);
	fillRect(0,1,30,30,0);
	createPoint();
    }
    changed=false;//this variable makes sure that we are doing only one move on every turn
    setTimeout(loop,100);    
}

window.onload = function(){
    document.addEventListener('keydown', function(e){
	//37 = left arrow
	//38 = up arrow
	//39 = right arrow
	//40 = down arrow
	var val = e.keyCode - 37;
	
	if(((val - i) % 2 != 0)&&
	   (val<4)&&
	   (val>=0)&&
	  (! changed)){
	    changed=true;
	    i = val;
	}
    }, false);
    loop();
};