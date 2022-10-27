
Terminal.bindKeys = function () { };
var t = new Terminal(80, 25);
t.open();

// ======================= play control ==========
var timer;
var speed = 1.0;

function Timer(callback, delay) {
  var timerId, start, remaining = delay;

    this.pause = function () {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function () {
        start = new Date();
        timerId = window.setTimeout(callback, remaining);
    };

    this.resume();
}

function play(evt) {
  if (evt.target.textContent == "play") {
    readBlob('typescript', reader_onloadend);
  } else if (evt.target.textContent == "resume") {
    evt.target.textContent = "pause";
    timer.resume();
  } else if (evt.target.textContent == "pause") {
    evt.target.textContent = "resume";
    timer.pause();
  }
}

function stop(event){
  document.getElementById("play").textContent = "play";
  timer.pause();
  // vt.clear();
  // vt.refresh();
  t.reset();
}

function run_typescript(typescript_data, timing_data){
  if(timer) timer.pause();
  // if "play" is pushed, then the button convret to "pause"
  document.getElementById("play").textContent = "pause";
  t.reset();


  var where = 0;
  var line_num = 0;
  var timings = timing_data.split("\n");
  // var first_line_len = typescript_data.indexOf("\n") + 1;
  // var text = typescript_data.substr(0, first_line_len);
  var line1 = timings[line_num].split(" ");
  line_num += 1;
  var time1 = parseFloat(line1[0]);
  var bytes1 = parseInt(line1[1]);
  var text = typescript_data.substr(0, bytes1);
  where += bytes1;
  var new_text = "";

  timer = new Timer(
    function(){
      t.write(text);
      text = new_text;
      var me = arguments.callee;
      var line = timings[line_num].split(" ");
      var time = parseFloat(line[0]);
      var bytes = parseInt(line[1]);
      if(isFinite(time) && isFinite(bytes)){
        new_text = typescript_data.substr(where, bytes);
        where +=bytes;
        line_num +=1;
        timer = new Timer(me, time * 1000 * 1 / speed);
      }else{
        t.write(typescript_data.substr(where, typescript_data.length - where));
        document.getElementById("play").textContent = "play";
      }
    }, 0);
}

function set_speed(event){
  var value = event.target.options[event.target.selectedIndex].value;
  speed = parseFloat(value);
}

// ======================= file read and preprocess==============
// remove "Script started..." and "Script done..."
function strim(data){
  var first_lf = data.indexOf("\n"); 
  // data is end with \n, should ignore it
  var second_last_lf = data.lastIndexOf("\n", data.length - 2);
  // there are two \n after first line
  data = data.slice(first_lf+1, second_last_lf);
  return data;  
}

function reader_onloadend(event){
  if(event.target.readyState == FileReader.DONE){
    var typescript_data = event.target.result;
    readBlob('timingfile',
      function(evt2) {
        if(evt2.target.readyState == FileReader.DONE){
          var timing_data = evt2.target.result;
          typescript_data = strim(typescript_data);
          run_typescript(typescript_data, timing_data);
        }
      }
    );
  }
}

function readBlob(id, onload_handler){
  var files = document.getElementById(id).files;
  if(!files.length){
    alert('please select a file!');
    return;
  }

  var file = files[0];
  var blob = file.slice(0, file.size);
  var reader = new FileReader();
  reader.onloadend = onload_handler;
  reader.onerror = function(evt){alert(evt);};
  reader.readAsBinaryString(blob);
}