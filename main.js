c.width = c.height = 600;

m = Math
//offset between moves
d = [[-1,0],//left
	 [0, -1],//up
	 [1,0],//right
	 [0,1]];//down

i = j = 2; // i is current offset index, j isopponent snake offset index
var s,o; // s is varaible that holds our snake o is reference to opponent snake



// colors that was used in game
k = [
    '#000',
    '#00f',
    '#f00'];

// used for heart animation
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
function getrandom(max){return m.floor(m.random()*max);}

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

function movesnake(snake,offset,opponent){
    // if we are starting the game do just set starting values
    // pass main logic
    if(snake){
	//add a new node to snake
	snake = cons((snake.x + d[offset][0])%30, // mod 30 makes sure that if we get out of the screen get it snake back from index 0
		     ((snake.y-1 + d[offset][1])%30)+1,
		     snake);
	//if snake is going below 0
	//just make it re-enter from other side of the screen
	if(snake.x<0) snake.x = 29;
	if(snake.y<1) snake.y = 30;

	//if we eat point create another point and not remove last node
	if((snake.x == p.x) && (snake.y == p.y))
	    createPoint();
	else
	    removeLast(snake,snake.n);
	//draw newly created node
	fillRect(snake.x,snake.y,1,1,1);
	drawHeart()
	//if head is overloping any other node restart game
	if(hasItem(snake.n,snake) || hasItem(opponent,snake))
	    snake = null;
    }
    return snake;
}

//main loop
function loop(){
    s = movesnake(s,i,o,0);
    if(s){
	if((j%2) && p.y == o.y)
	    j = (o.x - p.x)>0?0:2
	if(!(j%2) && p.x == o.x)
	    j = (o.y - p.y)>0?1:3
    }
    o = movesnake(o,j,s,1);
    //set default values for game
    if(!s || !o){
	i = j= 2;
        s= cons(5,5);
	o = cons(5,25);
	fillRect(0,1,30,30,0);
	createPoint();
    }
    changed=0;//this variable makes sure that we are doing only one move on every turn
    setTimeout(loop,100);    
}

(function(){
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
	    changed=1;
	    i = val;
	}
    }, false);
    loop();
}());