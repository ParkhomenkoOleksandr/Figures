//variables for points
var checker = 0;
var index = 0;
var coordinatesArray = [8]; // array with points coordinates A, B, C ,D

//variables for parallelogram
var lengthAB;
var lengthBC;
var d; // diagonal
var a; // angle
var S; // square

//variables for circle
var circleCenterX;
var circleCenterY;
var R;

var canvas = document.querySelector('#my-canvas');
canvas.width = 800;
canvas.height = 500;
var context = canvas.getContext('2d');

// get cursor coordinates
$('.element').mousemove(function(e){
    var target = this.getBoundingClientRect();
    var x = e.clientX - target.left;
    var y = e.clientY - target.top;
    $('#coord-live').html(x + ', ' + y);
});

// set cursor coordinates to coordinatesArray and create points and figures
$('.element').click(function(e){
    var target = this.getBoundingClientRect();
    var x = e.clientX - target.left;
    var y = e.clientY - target.top;
    
    x = e.clientX - target.left;
    y = e.clientY - target.top;

    checker ++;

    if (checker <= 3)
    {
        coordinatesArray[index] = x
        coordinatesArray[index+1] = y
        index = index +2;
    }

    if (checker == 3) 
    {
        // build figures
        buildFigures();
    }
    
    else if (checker > 3)
    {
        
        var lengthABCN = [3];
        // find length of the segments AN, BN, CN, where N -> New point
        lengthABCN[0] = Math.sqrt(Math.pow(x - coordinatesArray[0], 2) 
            + Math.pow(y - coordinatesArray[1], 2));

        lengthABCN[1] = Math.sqrt(Math.pow(x - coordinatesArray[2], 2) 
            + Math.pow(y - coordinatesArray[3], 2));    

        lengthABCN[2] = Math.sqrt(Math.pow(x - coordinatesArray[4], 2) 
            + Math.pow(y - coordinatesArray[5], 2));
        
        // find the shortest distance from the new point
        if (lengthABCN[2] < lengthABCN[1])
        {
            if(lengthABCN[2] < lengthABCN[0])
            {
                coordinatesArray[4] = x;
                coordinatesArray[5] = y; 
            }
            
            else
            {
                coordinatesArray[0] = x;
                coordinatesArray[1] = y; 
            }
        }

        else if(lengthABCN[1] < lengthABCN[2])
        {
            if(lengthABCN[0] < lengthABCN[1])
            {
                coordinatesArray[0] = x;
                coordinatesArray[1] = y; 
            }
            
            else
            {
                coordinatesArray[2] = x;
                coordinatesArray[3] = y; 
            }
        }

        // clear canvas and creat new figures with new pont
        context.clearRect(0, 0, canvas.width, canvas.height);
        buildFigures();
    }
});

function buildFigures()
{   
    findParallelogramDxyPoint(); // find fourth point coordinates
    findParallelogramLengthAB(); // find length AB
    findParallelogramLengthBC(); // find length BC
    findParallelogramDiagonal(); // find diagomnal AC
    findParallelogramAngle(); // find angle
    findParallelogramSquare(); // find parallelogram square
        
    findCircle(); // find circle radius

    // checking for signs of a parallelogram
    if (lengthAB != lengthBC && 
        d!= Math.sqrt(Math.pow(coordinatesArray[6] - coordinatesArray[2], 2)
        + Math.pow(coordinatesArray[7] - coordinatesArray[3], 2)))
    {      
        // build three points
        drawPoint(context, coordinatesArray[0], coordinatesArray[1], 'A', 'red', 11);
        drawPoint(context, coordinatesArray[2], coordinatesArray[3], 'B', 'red', 11);
        drawPoint(context, coordinatesArray[4], coordinatesArray[5], 'C', 'red', 11);

        // build parallelogram
        context.beginPath();
        context.moveTo(coordinatesArray[0], coordinatesArray[1]); // A [x ; y]
        context.lineTo(coordinatesArray[2], coordinatesArray[3]); // B [x ; y]
        context.lineTo(coordinatesArray[4], coordinatesArray[5]); // C [x ; y]
        context.lineTo(coordinatesArray[6], coordinatesArray[7]); // D [x ; y]
        context.closePath();
        context.strokeStyle = "blue";
        context.stroke();

        // build circle 
        context.beginPath();
        context.arc(circleCenterX, circleCenterY, R, 00, 2*Math.PI, false);
	    context.lineWidth = 1;
	    context.strokeStyle = 'yellow';
        context.closePath();
	    context.stroke();
        
        // show fourth point and center of the circle
        drawPoint(context, coordinatesArray[6], coordinatesArray[7], 'D', 'blue', 11);
        drawPoint(context, circleCenterX, circleCenterY, 'O', 'blue', 11);
        showCoordinatesInPixels();
    }
}

// reset paige
function reset()
{
    alert("сторінка була очищена");
    $('#coord-click').html("");
    context.clearRect(0, 0, canvas.width, canvas.height);
    index = 0;
    checker = 0;
}

// show info about
function about()
{
    $('#aboutText').html("<center><strong>Програма взаємодіє з користувачем та будує на єкрані фігури, котрі були створені за рахунок точок вказаних користувачем.</strong></center>" +
    "<br><br> <center><strong>Автор: Пархоменко Олександр</strong></center>" +
    "<br><br> <center><strong>інструкцію щодо використання:</strong></center>" +
    "<center>У відвіденій області потрібно створити 3 точки натисканям кнопкою миші на довільне місце області.</center>"+
    "<center>Піся цього буде створена 4 точка, центр кола та побудовані паралелограм та коло у центрі маси паралелограм з площою, як у паралелограма.</center>"+
    "<center>У користувача також є можливість перемістити точки A, B и C натисканням кнопкою миші на довільну область.</center>"+
    "<center>Переміщатиметься та точка, яка буде най ближчою до обраної точки у довільному місці.</center>"+
    "<center>Також користувачу будуть виводится наступні інформації:.</center>"+
    "<center>Координати курсора, кординати точок A, B, C, D, O та площа фігур.</center>"+
    "<center>Кнопка 'Reset' очищую область</center>"+
    "<center>Якщо умови ознак паралелограма не підтвердилися, фігура будуватися не буде!</center>");
} 

function drawPoint(context, x, y, label, color, size) 
{

    // to increase smoothing for numbers with decimal part
    var pointX = Math.round(x);
    var pointY = Math.round(y);

    context.beginPath();
    context.fillStyle = color;
    context.arc(pointX, pointY, size, 0 * Math.PI, 2 * Math.PI);
    context.fill();

    if (label) 
    {
        var textX = pointX;
        var textY = Math.round(pointY - size - 3);
    
        context.font = 'Italic 14px Arial';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.fillText(label, textX, textY);
    }
}

function findParallelogramLengthAB()
{
    // find the length of segments AB
    lengthAB = Math.sqrt(Math.pow(coordinatesArray[2] - coordinatesArray[0], 2)
    + Math.pow(coordinatesArray[3] - coordinatesArray[1], 2))
}

function findParallelogramLengthBC()
{
    // find the length of segments BC
    lengthBC = Math.sqrt(Math.pow(coordinatesArray[4] - coordinatesArray[2], 2)
    + Math.pow(coordinatesArray[5] - coordinatesArray[3], 2))
}

function findParallelogramDiagonal()
{
    // find diagonal
    d = Math.sqrt(Math.pow(coordinatesArray[4] - coordinatesArray[0], 2)
    + Math.pow(coordinatesArray[5] - coordinatesArray[1], 2))
}

function findParallelogramAngle()
{
    // find angle
    a = Math.cos((Math.pow(lengthAB, 2) + Math.pow(lengthBC, 2) - Math.pow(d, 2)) / (2 * lengthAB * lengthBC));
}

function findParallelogramSquare()
{
    // find parallelogram Square
    S = lengthAB * lengthBC * a;
}

function findParallelogramDxyPoint()
{
    // find fourth point D
    var t = coordinatesArray[4] - coordinatesArray[2];
    coordinatesArray[6] = coordinatesArray[0] + t; // Dx Point
    t = coordinatesArray[3] - coordinatesArray[1];
    coordinatesArray[7] = coordinatesArray[5] - t; // Dy Point
}

function findCircle()
{
    // find the coordinates of the center of the circle
    circleCenterX = (coordinatesArray[0] + coordinatesArray[4]) / 2;
    circleCenterY = (coordinatesArray[1] + coordinatesArray[5]) / 2;

    // find the radius of the circle
    R = Math.sqrt(S/Math.PI);
}

// show coordinates and figures square
function showCoordinatesInPixels()
{
    $('#coord-click').html(" A = [" + coordinatesArray[0] + ";" + coordinatesArray[1] + 
    "] B = [" + coordinatesArray[2] + ";" + coordinatesArray[3] +
    "] C = [" + coordinatesArray[4] + ";" + coordinatesArray[5] + 
    "] D = [" + coordinatesArray[6] + ";" + coordinatesArray[7] + 
    "] O = [" + circleCenterX + ";" + circleCenterY + 
    "] S = " + S.toFixed(2));
}