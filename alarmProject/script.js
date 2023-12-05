let hour = document.getElementById('hour-hand');
let minutes = document.getElementById('min-hand');
let second = document.getElementById('sec-hand');
let digital_clock = document.querySelector('#currentTime');
let selectdata = document.querySelectorAll("select");
let set_alarm = document.querySelector('#set_alarm');
let alarmSound = new Audio("sound.mp3");
const activeAlarms = document.querySelector(".activeAlarms");
let alarmsArray = [];

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

let alarmTime;

for (let index = 12; index > 0; index--) {
  let option = `<option value = "${index}">${index} </option>`;
  selectdata[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let index = 59; index > 0; index--) {
  let option = `<option value = "${index}">${index} </option>`;
  selectdata[1].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let index = 2; index > 0; index--) {
  let ampm = "PM";

  if (index == 1) {
    ampm = "AM";
  }
  let option = `<option value = "${ampm}">${ampm} </option>`;
  selectdata[2].firstElementChild.insertAdjacentHTML("afterend", option);
}


function displayTime() {
  let time = new Date();

  let hr = (time.getHours());
  let min = (time.getMinutes());
  let sec = (time.getSeconds());
  let ampm = "AM";
  if (hr >= 12) {
    ampm = "PM"
  }
  hr = hr % 12;
  
  let hrRotation = 30 * hr + 0.5 * min;
  let minuteRotation = (6 * min);
  let secondRotation = (6 * sec);

  hour.style.transform = `rotate(${hrRotation}deg)`;
  minutes.style.transform = `rotate(${minuteRotation}deg)`;
  second.style.transform = `rotate(${secondRotation}deg)`;

  //Display time
  digital_clock.innerHTML = time.toLocaleTimeString()+"<br />"+ampm;

  
  //Alarm
  alarmsArray.forEach((alarm, index) => {
    alarm.alarmHour%=12;
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute} ${alarm.alarmAmPm}` === `${hr}:${min} ${ampm}`) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}

setInterval(displayTime);



set_alarm.addEventListener('click', () => {

  if(selectdata[0].value==="HOUR"||selectdata[1].value==="MINUTE"||selectdata[2].value==='AM/PM')
  {
    alert("Please enter a valid TIME");
    return;
  }
  alarmIndex += 1;

  

  //alarmObject
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${selectdata[0].value}_${selectdata[1].value} ${selectdata[2].value}`;
  alarmObj.alarmHour = selectdata[0].value;
  alarmObj.alarmMinute = selectdata[1].value;
  alarmObj.alarmAmPm=selectdata[2].value;
  alarmObj.isActive = false;
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
});

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

//Create alarm div

const createAlarm = (alarmObj) => {
  //Keys from object
  const { id, alarmHour, alarmMinute,alarmAmPm } = alarmObj;
  //Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute} ${alarmAmPm}</span>`;

  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exis, obj, ind] = searchObject("id", searchId);
  if (exis) {
    alarmsArray[ind].isActive = true;
  }
};


//Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = (e) => {
  alarmSound.pause();
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};
