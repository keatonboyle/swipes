/* CONSTANTS ******************************************************************/
var millis_in_day = 1000 * 60 * 60 * 24;

var days_of_week = 
    ["Monday",
     "Tuesday",
     "Wednesday",
     "Thursday",
     "Friday",
     "Saturday",
     "Sunday"];

var week_names =
    ["0",
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

var plans = 
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

var times_of_day =
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
var quarters =
    [
        new Quarter("11W", "December 7, 2012"),
        new Quarter("12F", "December 14, 2012"),
        new Quarter("13W", "March 22, 2013"),
        new Quarter("13S", "June 14, 2013"),
        new Quarter("13F", "December 13, 2013"),
        new Quarter("14W", "March 21, 2014"),
        new Quarter("14S", "June 13, 2014"),
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
  var tutcOffset = (new Date()).getTimezoneOffset();
  var ret = friday.getTime();
  console.log(ret);
  ret += ((tutcOffset - futcOffset)*1000*60)
  console.log(ret);
  ret += 3*millis_in_day;
  console.log(ret);

  console.log(new Date(ret));
  return ret;
}


Quarter.prototype.end = function()
{
    return this.endTime;
    var endedms = (new Date(this.fridayOfFinals)).getTime() + 3 * millis_in_day;
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
var today;

function calcSwipes()
{
    var now = today;

    var day = (now.getDay() + 6) % 7; /* to use the Monday=0 perspective */
    var quarter = findQuarter(now);

    if (quarter == null)
    {
        console.log("No quarter found");
        return;
    }

    var week = findWeek(now, quarter);
    if (week < 0)
    {
        console.log("Pre-zero week");
        return;
    }

    var timeOfDay = findTimeOfDay(day, now, plan);

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
    $("#day_of_week").html(days_of_week[day]);
    $("#week_ordinal").html(week_names[findWeek(now,quarter)]);
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
    today = new Date();

    if (location.hash != "")
    {
      // Expect date in format MM-DD-YYYY-HH:MM
      var dateEls = location.hash.substr(1).split("-");
      var timeEls = dateEls[3].split(":");
      today = new Date(dateEls[2],dateEls[0]-1,dateEls[1],timeEls[0],timeEls[1]);
    }

    if (today > new Date("March 25, 2013") &&
        today < new Date("April 1, 2013"))
    {
      $("body").append($('<div>')
                             .addClass("over_everything")
                             .html("IT'S SPRING BREAK.  TIME TO FUCKING PARTY." +
                                   "<br><br><br><br><br><br>"));
      $("#master").remove();
    }
    else if (today > new Date("December 14, 2013") &&
             today < new Date("January 5, 2014"))
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
      setTimeout(function () {window.location.href = "http://www.youtube.com/watch?v=Kr0tTbTbmVA";},750);
    }
   */
        

    var foundPlanString = $.cookies.get("plan");
    if(foundPlanString != null)
    {
      select_plan($("#choose_"+foundPlanString).get(), foundPlanString);
    }
    else
    {
      select_plan($("#choose_19P").get(), "19P");
    }



    $("#detail_button").click(detAnim);
    $("#closer").click(detAnim);
    $("#support_link").click(
        function () { window.open("mailto:keatonboyle@gmail.com"); });

    $("#choose_19P").click(function () { select_plan(this, "19P"); });
    $("#choose_14P").click(function () { select_plan(this, "14P"); });
    $("#choose_19").click(function () { select_plan(this, "19"); });
    $("#choose_14").click(function () { select_plan(this, "14"); });



}


function findQuarter(now)
{
    for (var ii = 0; ii < quarters.length; ii++)
    {
        if (now < quarters[ii].end())
        {
            return quarters[ii];
        }
    }
    return null;
}

function findWeek(now, quarter)
{
    var diff = quarter.end() - now.getTime();
            
//    console.log((11 - parseInt((diff-1) / (millis_in_day * 7))));
//    console.log(((diff-1) / (millis_in_day * 7)));

    return (11 - parseInt((diff - 1) / (millis_in_day * 7)));
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

function findTimeOfDay(day, now, plan)
{
    var hour = now.getHours();

    if (hour < 7)
    {
        return times_of_day["early_morning"];
    }
    if (hour < 11)
    {
        if ((day < 5) && (plan.perWeekday == 3))
        {
            return times_of_day["breakfast"];
        }
        if (day >= 5)
        {
            return times_of_day["weekend_brunch"];
        }
        return times_of_day["general_morning"];
    }
    if (hour < 15)
    {
        if (day >= 5)
        {
            return times_of_day["weekend_brunch"];
        }
        return times_of_day["lunch"];
    }
    if (hour < 17)
    {
        return times_of_day["late_afternoon"];
    }
    if (hour < 21)
    {
        return times_of_day["dinner"];
    }

    return times_of_day["late_night"];
}

var b_menuOpen = false;
function detAnim()
{
  if (b_menuOpen)
  {
    b_menuOpen = false;
    $("#menu").css(
        { opacity: "0" }
    );
  }
  else
  {
    b_menuOpen = true;
    $("#menu").css(
        { opacity: "0.9" }
    );
  }
}

function select_plan(el, planString)
{
  $(".plan_choice").removeClass("selected");
  plan = plans[planString];
  $(el).addClass("selected");

  $.cookies.set("plan",planString);

  calcSwipes();
}

