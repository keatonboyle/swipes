const $ = require('jquery');
const Cookies = require('js-cookie');

/* CONSTANTS ******************************************************************/
const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

const DAY_NAMES = 
    ["Monday",
     "Tuesday",
     "Wednesday",
     "Thursday",
     "Friday",
     "Saturday",
     "Sunday"];

const _WEEK_NAMES = 
    ["super sub-zero",
     "0",
     "1st",
     "2nd",
     "3rd",
     "4th",
     "5th",
     "6th",
     "7th",
     "8th",
     "9th",
     "10th",
     "Finals"];

function get_week_name(/*int*/ week_num)
{
  return _WEEK_NAMES[week_num+1]; /* since we're indexed on -1 */
}

const PLANS = 
{
    "19P": 
    {
        name: "19P",
        extendedName: "19 Pre-fucking-miere",
        perWeek: 19,
        perWeekday: 3,
        perWeekend: 2,
        roll: true
    },
    "14P":
    {
        name: "14P",
        extendedName: "14 Pre-fucking-miere",
        perWeek: 14,
        perWeekday: 2,
        perWeekend: 2,
        roll: true
    },
    "19": 
    {
        name: "19",
        extendedName: "19 Regu-fucking-lar",
        perWeek: 19,
        perWeekday: 3,
        perWeekend: 2,
        roll: false 
    },
    "14":
    {
        name: "14",
        extendedName: "14 Regu-fucking-lar",
        perWeek: 14,
        perWeekday: 2,
        perWeekend: 2,
        roll: false 
    }
};

const TIMES_OF_DAY =
{
    "early_morning":
    {
        premsg: "early in the morning on",
        offset14: 0,
        offset19: 0,
        postmsg: ""
    },

    "breakfast":
    {
        premsg: "around breakfasttime on",
        offset14: 1,
        offset19: 1,
        postmsg: " after swiping for breakfast"
    },

    "weekend_brunch":
    {
        premsg: "time to wake up and have some delicious brunch to cure your hangover on this beautiful",
        offset14: 1,
        offset19: 1,
        postmsg: " after swiping for all that maple-syrupy deliciousness"
    },

    "general_morning":
    {
        premsg: "morningtime on",
        offset14: 1,
        offset19: 1,
        postmsg: " after your first swipe of the day"
    },

    "lunch":
    {
        premsg: "around lunchtime on",
        offset14: 1,
        offset19: 2,
        postmsg: " after you swipe for lunch"
    },

    "late_afternoon":
    {
        premsg: "that awkward time between lunch and dinner on",
        offset14: 1,
        offset19: 2,
        postmsg: " if you haven't swiped for dinner yet"
    },

    "dinner":
    {
        premsg: "around dinnertime on",
        offset14: 2,
        offset19: 3,
        postmsg: " after you swipe for dinner"
    },

    "late_night":
    {
        premsg: "late at night on",
        offset14: 2,
        offset19: 3,
        postmsg: ""
    }
};




// Quarters must be arranged in *ascending* order (earliest to latest)
// These dates are the Fridays of finals week for their respective quarters.
const QUARTERS =
    [
        new Quarter("21F", "December 10, 2021"),
        new Quarter("22W", "March 18, 2022"),
        new Quarter("22S", "June 10, 2021"),
    ];

function Quarter(code, fridayOfFinals)
{
    this.code = code;
    this.fridayOfFinals = fridayOfFinals;
    this.endTime = calcEnd(fridayOfFinals);
}

function calcEnd(fridayOfFinals)
{
  var friday = new Date(fridayOfFinals);
  console.log(friday);
  var futcOffset = friday.getTimezoneOffset();
  
  // TODO: this new Date() does not respect a time set in the URL hash.
  // Refactor.
  var tutcOffset = (new Date()).getTimezoneOffset();
  var ret = friday.getTime();
  console.log(ret);
  ret += ((tutcOffset - futcOffset)*1000*60)
  console.log(ret);
  ret += 3*MILLIS_IN_DAY;
  console.log(ret);

  console.log(new Date(ret));
  return ret;
}


// TODO: refactor.
Quarter.prototype.end = function()
{
    return this.endTime;
    var endedms = (new Date(this.fridayOfFinals)).getTime() + 3 * MILLIS_IN_DAY;
    console.log(endedms);
//    console.log(new Date(endedms));
    var offset = (today.getTimezoneOffset() 
        - (new Date(this.fridayOfFinals)).getTimezoneOffset());
    console.log("Offset: " + offset);
    endedms += offset * 60 * 1000;
    console.log(endedms);
//    console.log(ended);
//    console.log(new Date(endedms));
    return endedms;
     
    // end actually returns the very beginning of the Monday *after*
    //  the quarter ends.  This makes things easier for subtraction.
}

Quarter.prototype.year = function ()
{
    return code.substr(0,2);
};
Quarter.prototype.term = function ()
{
    return code.charAt(2);
};

var plan;

function calcSwipes(date)
{
    var day = (date.getDay() + 6) % 7; /* to use the Monday=0 perspective */
    var quarter = findQuarter(date);

    if (quarter == null)
    {
        console.log("No quarter found");
        return;
    }

    var week = findWeek(date, quarter);

    var timeOfDay = findTimeOfDay(day, date, plan);

    var swipes = findSwipes(day, week, plan, timeOfDay);
    $("#num_swipes").html(swipes);
    $("#inner_num_swipes").html(swipes);
    if (swipes == 1)
    {
      $("#inner_num_swipes_label").html("swipe");
    }
    else
    {
      $("#inner_num_swipes_label").html("swipes");
    }
    $("#time_of_day").html(timeOfDay.premsg);
    $("#day_of_week").html(DAY_NAMES[day]);
    $("#week_ordinal").html(get_week_name(findWeek(date,quarter)));
    $("#after_what").html(timeOfDay.postmsg);
    $("#per_weekday").html(plan.perWeekday);
    $("#per_weekend").html(plan.perWeekend);
    $("#per_weekday_final").html(plan.perWeekday);
    $("#per_week").html(plan.perWeek);
    $("#plan_name").html(plan.extendedName);
    if (plan.roll)
      $("#rollover_text").html("DO");
    else
      $("#rollover_text").html("DON'T");

    return swipes;
}

function init()
{
    let now = new Date();

    if (location.hash != "")
    {
      // Expect date in format MM-DD-YYYY-HH:MM
      var dateEls = location.hash.substr(1).split("-");
      var timeEls = dateEls[3].split(":");
      now = new Date(dateEls[2],dateEls[0]-1,dateEls[1],timeEls[0],timeEls[1]);
    }

    if (now > new Date("March 25, 2013") &&
        now < new Date("April 1, 2013"))
    {
      $("body").append($('<div>')
                             .addClass("over_everything")
                             .html("IT'S SPRING BREAK.  TIME TO FUCKING PARTY." +
                                   "<br><br><br><br><br><br>"));
      $("#master").remove();
    }
    else if (now > new Date("December 14, 2013") &&
             now < new Date("January 5, 2014"))
    {
      $("body").append($('<div>')
                             .addClass("over_everything")
                             .html("HAPPY<br>" +
                                   "<span class='red'>FUCKING</span> <span class='green'>BIRTHDAY</span><br>" +
                                   "TO JESUS<br>" +
                                   "<span class='subtext'>Have a delightful winter break.</span>"));
      $("#wrapper").remove();
    }

        
    /*
    else if (today > new Date("June 15, 2013"))
    {
      $("body").append($('<div>')
                             .addClass("over_everything")
                             .html("IT'S SUMMERTIME MOTHERFUCKERS." +
                                   "<br><br><br><br><br><br>"));
      $("#master").remove();
      setTimeout(function () {window.location.href = "https://www.youtube.com/watch?v=Kr0tTbTbmVA";},750);
    }
   */
        

    var foundPlanString = Cookies.get("plan");
    if(foundPlanString != null)
    {
      select_plan($("#choose_"+foundPlanString).get(), foundPlanString, now);
    }
    else
    {
      select_plan($("#choose_19P").get(), "19P", now);
    }



    $("#detail_button").click(function () {
      detAnim();
    });
    $("#closer").click(function() {
      detAnim();
    });
    $("#support_link").click(
        function () { window.open("mailto:keatonboyle@gmail.com"); });

    $("#choose_19P").click(function () { 
      select_plan(this, "19P", now);
      detAnim(true);
    });
    $("#choose_14P").click(function () { 
      select_plan(this, "14P", now);
      detAnim(true);
    });
    $("#choose_19").click(function () { 
      select_plan(this, "19", now);
      detAnim(true);
    });
    $("#choose_14").click(function () { 
      select_plan(this, "14", now);
      detAnim(true);
    });
}


function findQuarter(date)
{
    for (var ii = 0; ii < QUARTERS.length; ii++)
    {
        if (date < QUARTERS[ii].end())
        {
            return QUARTERS[ii];
        }
    }
    return null;
}

function findWeek(date, quarter)
{
    var diff = quarter.end() - date.getTime();
            
//    console.log((11 - parseInt((diff-1) / (millis_in_day * 7))));
//    console.log(((diff-1) / (millis_in_day * 7)));

    return (11 - parseInt((diff - 1) / (MILLIS_IN_DAY * 7)));
}

function findSwipes(day, week, plan, timeOfDay)
{
    var startOfWeek;
    if (plan.roll)
    {
      startOfWeek = (12 - week)   /* (incomplete) weeks left in the quarter */
                    * plan.perWeek /* times swipes per week */
                    - (2 * plan.perWeekend); /* minus the weekend at the end
                                                of finals */
    }
    else
    {
      startOfWeek = plan.perWeek;
      if ((12 - week) == 1)
      {
        startOfWeek -= (plan.perWeekend * 2);
      }
    }

    var usedThisWeek = day * plan.perWeekday;

    // Saturdays count for less, factor in the difference between a weekend
    //  swipe and a weekday swipe
    if (day == 6) usedThisWeek += (plan.perWeekend - plan.perWeekday);

    var todaySwipes;
    if (day >= 5) 
    {
        todaySwipes=timeOfDay.offset14;
    }
    else if (plan.perWeekday == 3) 
    {
        todaySwipes=timeOfDay.offset19;
    }
    else 
    {
        todaySwipes=timeOfDay.offset14;
    }

    return startOfWeek - usedThisWeek - todaySwipes;
}

function findTimeOfDay(day, date, plan)
{
    var hour = date.getHours();

    if (hour < 7)
    {
        return TIMES_OF_DAY["early_morning"];
    }
    if (hour < 11)
    {
        if ((day < 5) && (plan.perWeekday == 3))
        {
            return TIMES_OF_DAY["breakfast"];
        }
        if (day >= 5)
        {
            return TIMES_OF_DAY["weekend_brunch"];
        }
        return TIMES_OF_DAY["general_morning"];
    }
    if (hour < 15)
    {
        if (day >= 5)
        {
            return TIMES_OF_DAY["weekend_brunch"];
        }
        return TIMES_OF_DAY["lunch"];
    }
    if (hour < 17)
    {
        return TIMES_OF_DAY["late_afternoon"];
    }
    if (hour < 21)
    {
        return TIMES_OF_DAY["dinner"];
    }

    return TIMES_OF_DAY["late_night"];
}

var b_menuOpen = false;
function detAnim(opt_b_closeOnly)
{
  var closeOnly = opt_b_closeOnly || false;

  if (b_menuOpen || closeOnly)
  {
    b_menuOpen = false;
    $("#menu").css(
        { opacity: "0" }
    );
  }
  else if (!closeOnly)
  {
    b_menuOpen = true;
    $("#menu").css(
        { opacity: "0.9" }
    );
  }
}

function select_plan(el, planString, date)
{
  $(".plan_choice").removeClass("selected");
  plan = PLANS[planString];
  $(el).addClass("selected");

  Cookies.set("plan",planString);

  calcSwipes(date);
}

function foo() {
  return "bar";
}

$(document).ready(init);

module.exports = foo;
