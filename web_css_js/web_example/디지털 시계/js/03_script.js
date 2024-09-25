// 데이터 가져오기
import { themeData } from "./03_data.js";
// console.log(themeData);

// 함수 설정하여 화면출력
const main = document.querySelector("main");
const numbers = document.querySelectorAll(".screen span");
const [am, pm] = document.querySelectorAll(".screen em");

// 1초단위 시간 출력
setInterval(() => {
	getTime().forEach((num, idx) => setTime(num, idx));
	changeTheme();
}, 1000);

// 시간값 반환
function getTime() {
	const now = new Date();
	// now.setHours(13);
	// now.setMinutes(0);
	// now.setSeconds(0);
	let hr = now.getHours();
	let min = now.getMinutes();
	let sec = now.getSeconds();
	if (hr < 12) {
		am.classList.add("on");
		pm.classList.remove("on");
	} else {
		am.classList.remove("on");
		pm.classList.add("on");
	}
	// if (hr in [0, 13] && min == 0 && sec == 0) {
	// 	am.classList.toggle("on");
	// 	pm.classList.toggle("on");
	// 	console.log(hr);
	// }
	return [hr, min, sec];
}

// 시간값을 DOM객체에 설정
function setTime(num, index) {
	num = index == 0 && num > 12 ? num - 12 : num;
	num = num < 10 ? "0" + num : num;
	numbers[index].innerText = num;
}

// 시간에 따른 테마 변경
function changeTheme() {
	const hr = new Date().getHours();

	themeData.forEach(theme => {
		if (hr >= theme.time[0] && hr < theme.time[1] && main.className !== theme.key) {
			main.className = "";
			main.classList.add(theme.key);
		}
	});
}
