"use strict";

/* defaultMixin
 * description: For when no mixin is specified, return English as default.
 * parameters: value, interval
 * returns: string
 */
let defaultMixin = function (value, interval) {
    let phrases = {
        seconds: "just now",
        minute:  "about a minute ago",
        minutes: "%d minutes ago",
        hour:    "an hour ago",
        hours:   "%d hours ago",
        day:     "one day ago",
        days:    "%d days ago",
        month:   "one month ago",
        months:  "%d months ago",
        year:    "one year ago",
        years:   "%d years ago"
    };

    /* Select the string and replace the interval values */
    let str = phrases[interval];
    str = str.replace(/%d/i, value);

    return (str);
};

/* itsago
 * description: calculate the time since an element or time value
 * parameters: el, datetime, mixin, sticky
 * returns: string
 */
let itsago = function(el, datetime, mixin, sticky) {
    if (!mixin) {
        /* Mixin wasn't given */
        mixin = defaultMixin; 
    } else if (typeof mixin !== "function") {
        /* Mixin wasn't a function */
        let warnObject = {
            target: el
        };

        console.warn ("[itsago] mixin passed is not a function. Type:", typeof mixin);
        console.warn (warnObject);

        mixin = defaultMixin; 
    }

    let intervals = {
        seconds: "seconds",
        minute:  "minute",
        minutes: "minutes",
        hour:    "hour",
        hours:   "hours",
        day:     "day",
        days:    "days",
        month:   "month",
        months:  "months",
        year:    "year",
        years:   "years"
    };
  

    let time = new Date();
    if (!datetime) {
        /* Datetime parameter was not set */ 
        if (el) {
            /* Look for datetime value in element */    
            let elementTime = el.getAttribute("datetime"); 
            if (elementTime) {
                /* No datetime value found */
                time = new Date(elementTime);
            }
        }
    } else {
        /* Use datetime parameter */
        time = new Date(datetime);
    }

    /* Get declared time in seconds since Jan 1, 1970 */
    let declaredTime = time.getTime();

    /* Get current datetime in seconds since Jan 1, 1970*/
    let now = new Date();

    /* Difference in seconds */
    let timeDifference = now - parseInt(declaredTime);
    let seconds = Math.floor(timeDifference / 1000);

    /* Calculate amounts of time */
    let amounts = {
        year:   seconds / 31536000,
        month:  seconds / 2592000,
        day:    seconds / 86400,
        hour:   seconds / 3600,
        minute: seconds / 60
    };
    
    let timeSince = intervals.seconds;
    
    let value = 1;
    /* Loop through amounts of time */
    for (let i in amounts) {
        value = Math.floor(amounts[i]);
      
        if (value > 1) {
            let interval = i;
            timeSince = intervals[i + "s"];
            break;
        } else if (value === 1) {
            let interval = i;
            timeSince = intervals[i];
            break;
        }
    }

    /* Process the result through the mixin */
    timeSince = mixin(value, timeSince); 

    /* Remove trailing spaces */
    let result = timeSince.trim();
  
    if (el) {
        /* Update the element */
        el.innerText = result;
        if (sticky) {
            el.setAttribute("datetime", time.toISOString());
        }
        return result;
    } else {
        /* Just return the time string */
        return result;
    }
};
