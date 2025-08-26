
// Sleep Survey Generation and Computation 

// Globals and Statics.   Rather not have these, but right now too painful to work around!
const STATIC = 0;       // whether the background images in the survey are static or dynamic
const DYNAMIC = 1;
// Types of survey question answers
const NUMBER = 0;
const TIME = 1;
const YEARS = 2;
const HOURS = 3;
const MINUTES = 4;
// Booleans
const FALSE = 0;
const TRUE = 1;
var gSurveyNum = 0;
var gSurveyQuestion = 0;  

const allSurveys = [
                    {name: "Classic", computeFcn: defaultComputeFcn, survey: [
                        {question: "What is your AGE?", focus:"AGE", imageMode: STATIC, backImage: "survey1.png", type: YEARS, typeLabel: 'years', min: 18, max:80, step:1, default:50, answer:50, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "When did you go TO BED?", focus:"TO BED", imageMode: STATIC, backImage: "survey2.png", type: TIME, typeLabel: '', min: 2000, max:2400, step:100,default:2300, answer:2100, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "When did you ARISE?", focus:"ARISE", imageMode: STATIC, backImage: "survey3.png", type: TIME, typeLabel: '',min: 100, max:2400, step:100,default:600, answer:600, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many DREAMS did you have?", focus:"DREAMS", imageMode: STATIC, backImage: "survey6.png", type: NUMBER, typeLabel: '', min: 0, max:5, step:1,default:1, answer:1, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many times did you WAKE?", focus:"WAKE", imageMode: STATIC, backImage: "survey4.png",  type: NUMBER, typeLabel: '', min: 0, max:10, step:1,default:3, answer:3, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How long did you STAY AWAKE?", focus:"STAY AWAKE", imageMode: STATIC, backImage: "survey5.png",  type: MINUTES, typeLabel: 'minutes',min: 0, max:60, step:1,default:7, answer:7, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How do your MUSCLES FEEL now?", focus:"MUSCLES FEEL", imageMode: STATIC, backImage: "survey7.png", type: NUMBER, typeLabel: 'relative scale', min: 0, max:10, step:1,default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Assign and OVERALL SLEEP RATING", focus:"OVERALL SLEEP RATING", imageMode: STATIC, backImage: "survey9.png", type: NUMBER, typeLabel: 'relative scale', min: 0, max:10, step:1,default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                    ]},         
                    {name: "Tik-Tok", computeFcn: defaultComputeFcn, survey: [         
                        {question: "Walking", focus:"AGE", imageMode: DYNAMIC, backImage: "walking.gif", min: 10, max:100, default:50, answer:50, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Running", focus:"IN-BED/ ASLEEP", imageMode: DYNAMIC, backImage: "running.gif", min: 0, max:12, default:10, answer:10, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "When did you WAKE/GETUP?", focus:"WAKE/GETUP", imageMode: DYNAMIC, backImage: "wakeup-anim.gif", min: 0, max:12, default:6, answer:6, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How often were you AWOKEN?", focus:"AWOKEN", imageMode: DYNAMIC, backImage: "awoken-anim.gif", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How long did you STAY AWAKE?", focus:"STAY AWAKE", imageMode: DYNAMIC, backImage: "waso-anim.gif", min: 0, max:10, default:7, answer:7, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How much did you DREAM?", focus:"DREAM", imageMode: DYNAMIC, backImage: "dreams-anim.gif", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How do your MUSCLES FEEL?", focus:"MUSCLES FEEL", imageMode: DYNAMIC, backImage: "muscles-anim.gif", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How positive is your MOOD?", focus:"MOOD", imageMode: DYNAMIC, backImage: "mood-anim.gif", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Assign and OVERALL SLEEP RATING", focus:"OVERALL SLEEP RATING", imageMode: DYNAMIC, backImage: "rating-anim.gif", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                    ]},
                    {name: "Terse", computeFcn: defaultComputeFcn, survey: [         
                        {question: "How OLD are you?", focus:"OLD", imageMode: STATIC, backImage: "survey-generic.png", min: 10, max:100, default:50, answer:50, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Time of IN-BED & ASLEEP?", focus:"IN-BED & ASLEEP", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:12, default:10, answer:10, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Time of WAKE & GETUP?", focus:"WAKE & GETUP", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:12, default:6, answer:6, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Frequency of WAKES?", focus:"WAKES", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Duration of WAKES?", focus:"WAKES", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:7, answer:7, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Amount of DREAMING?", focus:"DREAMING", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Level of MUSCLE RELAXATION?", focus:"MUSCLE RELAXATION", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Relative MOOD?", focus:"MOOD", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "Overall SLEEP RATING", focus:"SLEEP RATING", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                    ]},
                    {name: "Basic", computeFcn: defaultComputeFcn, survey: [         
                        {question: "How good do you FEEL?", focus:"FEEL", imageMode: STATIC,backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "What's your overall SLEEP RATING?", focus:"SLEEP RATING", imageMode: STATIC, backImage: "survey-generic.png", min: 0, max:10, default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                    ]},
                    {name: "New", computeFcn: defaultComputeFcn, survey: [
                        {question: "What is your AGE?", focus:"AGE", imageMode: STATIC, backImage: "survey1.png", type: YEARS, typeLabel: 'years', min: 18, max:80, step:1, default:50, answer:50, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many hours before sleeping was your LAST MEAL?", focus:"LAST MEAL", imageMode: STATIC, backImage: "food.png", type: HOURS, typeLabel: 'hours', min: 0, max:8, step:1,default:2, answer:2, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many CAFFIENATED DRINKS did you have after noon", focus:"CAFFIENATED DRINKS", imageMode: STATIC, backImage: "caffiene.png", type: NUMBER, typeLabel: 'drinks', min: 0, max:4, step:1, default:1, answer:1, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many ALCOHOLIC DRINKS did you have last night?", focus:"ALCOHOLIC DRINKS", imageMode: STATIC, backImage: "drinks.png", type: NUMBER, typeLabel: 'drinks', min: 0, max:4, step:1, default:1, answer:1, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "When did you go TO BED?", focus:"TO BED", imageMode: STATIC, backImage: "survey2.png", type: TIME, typeLabel: '', min: 2000, max:2400, step:100,default:2300, answer:2100, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How long did it take for you to FALL ASLEEP?", focus:"FALL ASLEEP", imageMode: STATIC, backImage: "survey2.png", type: MINUTES, typeLabel: 'mins',min: 0, max:60, step:1,default:10, answer:10, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How many times did you WAKE UP at night?", focus:"WAKE UP", imageMode: STATIC, backImage: "survey4.png",  type: NUMBER, typeLabel: 'Times', min: 0, max:10, step:1,default:3, answer:3, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How long did you STAY AWAKE?", focus:"STAY AWAKE", imageMode: STATIC, backImage: "survey5.png",  type: MINUTES, typeLabel: 'minutes',min: 0, max:60, step:1,default:30, answer:7, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "When did you ARISE?", focus:"ARISE", imageMode: STATIC, backImage: "survey3.png", type: TIME, typeLabel: '',min: 200, max:1200, step:100,default:600, answer:600, validator: dummyValidator, warpFcn: dummyWarpFcn},
                        {question: "How TIRED were you when you awoke?", focus:"TIRED", imageMode: STATIC, backImage: "survey9.png", type: NUMBER, typeLabel: 'relative scale', min: 0, max:10, step:1,default:5, answer:5, validator: dummyValidator, warpFcn: dummyWarpFcn},
                    ]},
                ];

function initializePage() {
    console.log("Initializing Page");
    gSurveyQuestion = 0;

    var introEl = document.getElementById("introduction");
    var buf = "";

    buf += '    <section class="section" id="section-1">';
    buf += '    <div class="question"><span id="focus-word">Vital Functions Activity Survey</span></div>';
    buf += '    <div class="question">Swipe Right to add the activity to your list, swipe down to move to the next activity</div>';
   buf += '    <div class="answer" id="answer-0"></div>';
/*
    for (i=0; i<allSurveys.length; i++) 
        buf += '        <button type="button" onclick="RunSurvey(' + i + ')">' + allSurveys[i].name + '</button><br>';
*/
buf += '        <button type="button" onclick="RunSurvey(' + 1 + ')">' + 'Start Survey' + '</button><br>';
    buf += '    </section>'

    introEl.innerHTML = buf;
}

function SnapScrollAction(amount) {

    var quizWindowHeight = window.innerHeight;
    var quizFrameNum = Math.floor(amount/quizWindowHeight);
    if (quizFrameNum > gSurveyQuestion) 
        allSurveys[gSurveyNum].survey[gSurveyQuestion].validator(gSurveyQuestion);
    else if (quizFrameNum < gSurveyQuestion)
        console.log("Retreated to prev Q:" + quizFrameNum);
    gSurveyQuestion = quizFrameNum;
}

function dummyValidator(index) {
    console.log("Calling Q" + index +  " ValidatorFcn with Answer: " + this.answer);
}

// Translates from 0-2300 to AM/PM time
// SuppressMin is useful for drawing less on the scale
function MilitaryTimeTranslate(value, suppressMin) {
    var hours = Math.floor(value/100);
    var hoursString = "";
    var minString = "";
    var mins = value - (hours * 100);
    var suffix = "";
    var finalString;

    if (hours > 0 && hours <= 12) {
        hoursString = hours.toString();
        suffix = "am";
      } else if (hours > 12) {
        hours = hours - 12;
        hoursString = hours.toString();
        suffix = "pm";
      } else if (hours == 0) {
        hoursString= "12";
        suffix = "am";
      }

    if (mins < 10) 
        minString = "0" + mins.toString(); 
    else
        minString = mins.toString();
    if (suppressMin) 
        finalString = hoursString + suffix;
    else
        finalString = hoursString + ":" + minString + suffix;
    
    console.log("Military String = " + finalString)
    return(finalString);
}

// Returns a string which is the appropriate display label for the value with this type
function TranslateType(type, value, shortFlag) {
    switch (type) {
        case YEARS : return(shortFlag ? value : value + " Years");
        case MINUTES : return(shortFlag ? value : value + " Minutes");
        case HOURS : return(shortFlag ? value : value + " Hours");
        case TIME : return MilitaryTimeTranslate(value, shortFlag);
    }
    return value;
}

// Generates a text string for a "tickList" for a range control
function GenScale(min, max, step, type, defaultVal) {
    var buf = "";
    buf +=   '<datalist id="tickList">'
    for (i=min; i<=max; i+=step) {
//        if (i==min || i==max || i==defaultVal) {
        if (i==min || i==max) {

            buf += '<option value="' + i + '" label="' + TranslateType(type, i, TRUE) + '"></option>';
        } else {
            buf += '<option value="' + i + '"></option>';
        }
    }
    buf +=   '</datalist>'

    return buf;
}

function RunSurvey(surveyNum) {
    gSurveyNum = surveyNum;         // Tuck this into a global for now.
    console.log("Running Survey");

    var introEl = document.getElementById("introduction");
    var quizEl = document.getElementById("sleep-survey");

    // Validate survey choice
    if (surveyNum >= allSurveys.length || surveyNum < 0)
        return;

    // Nuke the intro choice section so we move to the survey
    introEl.innerHTML = "";

    var i = 0;
    const offset = 0;  // Used only for debugging
    var addedStyling = "";
    var backgroundStyle = "";
    var completeSection = "";
    var newQ = "";
    var buf = "";
    for (i=0; i<allSurveys[surveyNum].survey.length; i++) {
        completeSection = "";
        newQ = InsertFocus(allSurveys[surveyNum].survey[i].question, allSurveys[surveyNum].survey[i].focus);
        if (allSurveys[surveyNum].survey[i].imageMode == DYNAMIC) {
            addedStyling = ' no-repeat center center fixed; -webkit-background-size: cover; -moz-background-size: cover; -o-background-size: cover; background-size: cover;'
            backgroundStyle = "background:";
        } else {  // Assume STATIC
            addedStyling = "";
            backgroundStyle = "background-image:";
        }
        completeSection = "<section class='section' id='section-" + i + offset + "' style='" + backgroundStyle + " url(\"img/" + allSurveys[surveyNum].survey[i].backImage + "\")" + addedStyling + "'><div class='question'>";
        completeSection += newQ + "</div>";
    /*
        completeSection += '<div class="answer" id="answer-' + i + offset + '">' + TranslateType(allSurveys[surveyNum].survey[i].type, allSurveys[surveyNum].survey[i].default, FALSE) + '</div>';
        completeSection += '<input class="slider" type="range" name "" list="tickList" value="' + allSurveys[surveyNum].survey[i].default + '" min="' + allSurveys[surveyNum].survey[i].min + '" max="' + allSurveys[surveyNum].survey[i].max + '" onChange="rangeSlide(\'answer-' + i + offset + '\', this.value, ' + i + ')" oninput="rangeSlide(\'answer-' + i + offset + '\', this.value,' +  i + ')"></Input>';
        completeSection += GenScale(allSurveys[surveyNum].survey[i].min, allSurveys[surveyNum].survey[i].max, allSurveys[surveyNum].survey[i].step, allSurveys[surveyNum].survey[i].type, allSurveys[surveyNum].survey[i].default);
    
    */
        completeSection += "</section>";  // complete survey question
        buf += completeSection;

    }
    quizEl.innerHTML = buf;

    // Now add the last question to make the analysis "go"
    var analysisGoEl = document.getElementById("analysis-go");
    analysisGoEl.innerHTML = "";
    buf = "";
    buf += '<section class="section">';
    buf += '<div class="question"><span id="focus-word">THANK YOU!</span> Are you ready see your <span id="focus-word">Sleep Analysis?</span></div>';
    buf += '<div class="answer" id="sleep-analysis-go"></div>';
    buf += '  <button type="button" onclick="RunAnalysis()">Let\'s Go!</button>';
    buf += '  <br></section>';
    analysisGoEl.innerHTML = buf;
}


function RunAnalysis() {
    console.log("At Analysis trigger for Survey#", gSurveyNum);

    // First disappear the survey
    var quizEl = document.getElementById("sleep-survey");
    quizEl.innerHTML = "";

    // Now draw the Analysis wait cursor....
    var analysisGoEl = document.getElementById("analysis-go");
    analysisGoEl.innerHTML = "";
    var analysisEl = document.getElementById("sleep-analysis");
    var buf = "";
    buf += ' <section class="section"> \
             <div class="question">Analyzing your sleep...</span></div>  \
             <br><br></br> \
             <img src="img/brainwaves.gif"> \
             </section>';
    analysisEl.innerHTML = buf;



    // Wait for 2 secs, then display the results
    setTimeout(DisplayAnalysis, 4000);
}

// Page that displays the "anticipation question" for the solutions and then displays the recommended solutions
function RunSolutions() {
    console.log("At Solutions trigger for Survey#", gSurveyNum);

    // Now draw the Analysis wait cursor....
    var recoGoEl = document.getElementById("recommendations-go");
    recoGoEl.innerHTML = "";
    var solutionsEl = document.getElementById("sleep-solutions");
    var buf = "";
    buf += ' <section class="section"> \
             <div class="question">Calculating Sleep Solutions for you...</span></div>  \
             <br><br></br> \
             <img src="img/brainwaves.gif"> \
             </section>';
    solutionsEl.innerHTML = buf;

    // Now compute the analysis
    ComputeSolutions();

    // Wait for 4 secs, then display the results
    setTimeout(DisplaySolutions, 4000);
}


// Use the reco engine to calc solutions given the sleep architecture
function ComputeSolutions() {
    // 
    console.log("Computing Sleep Solutions");
}

// Display the solutions based on the recommendations
function DisplaySolutions() {
    var solutionsEl = document.getElementById("sleep-solutions");
    var buf = "";

    // Hypnogram
    buf += ' <section class="answer-section"> \
             <div class="answer-heading">SLEEP SOLUTIONS</div>  \
             <hr> \
             <div class="answer-subheading">These <b>Sleep Solution Recommendations</b> are customized for you based on the answers you posed to the survey questions.\
               For best accuracy and automatic sleep monitoring, try out our free \
               <b>Deep Sleep</b> mobile app </div> \
             <hr> \
             <div class="solutions-heading"><a href="https://deepsleep.buzz/2022/07/why-tech-accelerators-may-soon-be-irrelevant-as-an-mba/"> Oura Ring </a></div> \
             <div class="solutions-rationale"> (for Sleep Monitoring Accuracy) </div> \
             <div class="solutions-body">The Oura Ring second generation is one of the most accurate sleep solutions on the market. </div> \
             <br><div class="solutions-image"><a href="https://deepsleep.buzz/2022/07/why-tech-accelerators-may-soon-be-irrelevant-as-an-mba/"><img src="img/oura-ring.png" width="320"></a></div>\
             </section> \
             <section class="answer-section"> \
             <div class="answer-heading">SLEEP SOLUTIONS</div>  \
             <hr> \
             <div class="solutions-heading"><a href="https://deepsleep.buzz/2016/11/chilisleep-ooler/"> Ooler Bed Cooler </a></div> \
             <div class="solutions-rationale"> (for improving Deep Sleep ) </div> \
             <div class="solutions-body">The Ooler Bed Cooler is the great grand-daddy of bed thermal management.  </div>\
             <br><div class="solutions-image"><a href="https://deepsleep.buzz/2016/11/chilisleep-ooler/"><img src="img/ooler-cooler.png" width="320"></a></div> \
             </div> \
             <hr> \
            </section> ';
    solutionsEl.innerHTML = buf;
}

function DisplayAnalysis() {
    var analysisEl = document.getElementById("sleep-analysis");
    var analysisBuf = "";


    // Hypnochron
    analysisBuf += ' <section class="answer-section"> \
             <div class="answer-heading">HYPNOCHRON</div>  \
             <hr> \
             <div class="answer-subheading">A <b>Hypnochron</b> is our own unique way to show you your different estimated sleep states throughout the night </div> \
             <hr> \
             <img src="img/sample-hypnochron.png" width="320">  \
             <hr> \
             <div class="sleep-key"><span style="color:red;">RED</span> = Awake<br> \
                                     <span style="color:#b5f4fb;">LT BLUE</span> = REM Sleep<br> \
                                     <span style="color:#0087c1;">MED BLUE</span> = LIGHT Sleep<br> \
                                     <span style="color:#062a87;">DARK BLUE</span> = DEEP Sleep \
             </div>  \
            </section> ';

    // Hypnogram
    analysisBuf += ' <section class="answer-section"> \
    <div class="answer-heading">HYPNOGRAM</div>  \
    <hr> \
    <div class="answer-subheading">A <b>Hypnogram</b> is the graph of time and sleep states most used by sleep researchers. </div> \
    <div id="hypno-container">  </div> \
    <hr> \
    <div class="answer-subheading"><b>Sleep Stats</b> are the totals for each type of sleep you achieved. </div> \
    <div id="stats-container"> </div> \
    </section> ';

    // Stats
    analysisBuf += ' <section class="answer-section"> \
            <div class="answer-heading">SLEEP STATS</div>  \
            <hr> \
            <div class="answer-subheading">Think of <b>Sleep Stats</b> as the vital statistics of your night sleep.  These measurements break down the components of your sleep so you can compare to population averages and to your own historical measurements. </div> \
            <hr> \
            <img src="img/sample-sleepstats.png" width="320">  \
            <hr> \
            </div>  \
           </section> ';

    // Diagnosis
    analysisBuf += ' <section class="answer-section"> \
    <div class="answer-heading">SLEEP BRIEF</div> \
    <hr> \
    <div class="answer-subheading">In this <b>Sleep Brief</b> we explain how your Hypnos and Stats look versus the healthy population your age.  You can learn more about each of these areas by visiting our SLEEP CENTER.</div> \
    <hr> \
    <div class="diagnosis"> \
        <div class="diagnosis-heading"> DEEP SLEEP <span class="diagnosis-emphasis">(-10%)</span> </div> \
        Your Deep Sleep is below average for your age. Insufficient Deep Sleep has been linked to  \
        heart disease, type 2 diabetes, immune response problems and neurological diseases.<img src="img/learn-more.png" width="90"><br><br> \
        <div class="diagnosis-heading">SLEEP EFFICIENCY <span class="diagnosis-emphasis">(-22%)</span> </div> \
        Your Sleep Efficiency is way below average for your age. Sleep efficiency is a measure of your sleep health, so lower efficiency is bad.<img src="img/learn-more.png" width="80"><br><br> \
        <div class="diagnosis-heading">SLEEP SCORE <span class="diagnosis-emphasis">(-15%)</span> </div> \
        Your Sleep Score is slightly below average for your age.<img src="img/learn-more.png" width="90"> \
    </div>  \
   </section> ';
   analysisEl.innerHTML = analysisBuf;

    // Now add the last question to make the Recommendations "go"
    var recoGoEl = document.getElementById("recommendations-go");
    var solutionGoBuf;
    recoGoEl.innerHTML = "";
    solutionGoBuf += '<section class="section"> \
               <div class="question">Ready to view <span id="focus-word">Sleep Solutions?</span></div>  \
               <div class="answer" id="sleep-solutions-go"></div> \
               <button type="button" onclick="RunSolutions()">Let&#39;s Go!</button> \
               <br></section>';
    recoGoEl.innerHTML = solutionGoBuf;

        // Now compute the analysis
 //   ComputeAnalysis(allSurveys[gSurveyNum].survey.map(el => (el.value != null) ? el.value : el.default));
 ComputeAnalysis(allSurveys[gSurveyNum]);

};

function ComputeAnalysis(surveyObject) {
    console.log("Computing Results for Survey#" + surveyObject.name);

    
    // Compute the Sleep Object (Hypno and Stats) for the Survey Object
    var sleepObject = ClassicSurveySynth(surveyObject.survey); 

    //  This is where the magic happens!   We successively apply all of the Warp functions associated
    //  with each question in the survey and get a net result which is the final sleep arch!
//    netResult = allSurveys[gSurveyNum].survey.reduce((accum, currentQ) => currentQ.warpFcn(accum, currentQ.answer), 0);
//    console.log("Net Result = " + netResult);
}

function defaultComputeFcn () {

}

function dummyWarpFcn(accum, answer) {
    console.log("Dummy warp function called with: " + answer);
    return (accum + answer);
}

// pulls off the AM/PM suffix
function suffix(timeStr) {
    const suff = timeStr[timeStr.length-2] + timeStr[timeStr.length-1];
    return(suff);
}

// New Sleep Synth routine ....takes as input a Survey object and returns a Hypno object
function ClassicSurveySynth(surveyObject) {
    // Survey objects look like this:
    //  [{question: "What AGE?", focus:"AGE", imageMode: STATIC, backImage: "survey1.png", type: YEARS, typeLabel: 'years', min: 10, max:90, step:10, default:50, answer:50, validator: dummyValidator, warpFcn: dummyWarpFcn},
    const AGEQ = 0;
    const ONSETQ = 1;
    const ARISEQ = 2;
 
    // Get regular time strings from military time for the 
 //   const onsetTimeStr = MilitaryTimeTranslate( surveyObject[ONSETQ].answer, FALSE);
 //   const wakeTimeStr = MilitaryTimeTranslate( surveyObject[ARISEQ].answer, FALSE);

    const onsetTime = MilitaryToDate(surveyObject[ONSETQ].answer, -1);
    const wakeTime = MilitaryToDate(surveyObject[ARISEQ].answer, 0);
    const age = surveyObject[AGEQ].answer;
console.log("Synthesizing Hypno from Survey (AGE, START, END)=(" + age + "," + onsetTime.toLocaleTimeString() + "," + wakeTime.toLocaleTimeString());
    const sleepArch = SynthHypno(onsetTime.getTime(), wakeTime.getTime(), age);
console.log("Synthesized " + JSON.parse(sleepArch.hypno).length + " new Hypno States");
console.log("Synthesized Hypno =" + JSON.stringify(sleepArch.hypno));
    CreateHypnoChart('hypno-container', "Age " + age + "-Based Sleep Architecture", onsetTime, wakeTime, sleepArch);
    CreateStatsChart('stats-container', "Age " + age + "-Based Sleep Architecture", onsetTime, wakeTime, sleepArch);

}

// Takes a military time and a dayOffset (0==today) and returns a Date Object 
function MilitaryToDate(mt, dayOffset) {
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    var h = Math.floor(mt/100);
    var m = mt - (h * 100);
    targetDate.setHours(h, m);
    return(targetDate);
}


function rangeSlide(section, value, i) {

    document.getElementById(section).innerHTML = TranslateType(allSurveys[gSurveyNum].survey[i].type, value, FALSE);
    allSurveys[gSurveyNum].survey[i].value = value;

}

// insert "<span id='focus-word'>" and a closing "<span>" around KEY in the SENTENCE
function InsertFocus(sentence, key) {
     //   "What is your <span id='focus-word'>SEX</span>?</div></section>";
    const newSentence = sentence.replace(key, "<span id='focus-word'>" + key + "</span>");
    return newSentence;

}



