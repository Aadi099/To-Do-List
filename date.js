//we are creating our own little module for generating date 

module.exports.getDate=getDate;

function getDate(){


var today=new Date();
var currentDay = today.getDay();


var option={
weekday:"long",
day:"numeric",
month:"long"
};

var day=today.toLocaleDateString("en-US",option);
return day; 
}

module.exports.getDay=getDay;

function getDay(){


var today=new Date();
var currentDay = today.getDay();


var option={
weekday:"long",
};

var day=today.toLocaleDateString("en-US",option);
return day; 
}


// there are diff way we can pass function 

//example1
// module.exports.getDate=getDate;

// var getDate=function(){


// var today=new Date();
// var currentDay = today.getDay();


// var option={
// weekday:"long",
// day:"numeric",
// month:"long"
// };

// var day=today.toLocaleDateString("en-US",option);
// return day; 
// }


//example 2;
// module.exports.getDate=function getDate(){


// var today=new Date();
// var currentDay = today.getDay();


// var option={
// weekday:"long",
// day:"numeric",
// month:"long"
// };

// var day=today.toLocaleDateString("en-US",option);
// return day; 
// }

