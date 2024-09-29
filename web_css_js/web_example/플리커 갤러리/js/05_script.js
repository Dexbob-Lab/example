/*
flickr API를 활용한 이미지 검색 갤러리
사이트
    flickr 사이트: https://www.flickr.com/
    flickr API 가이드(App Garden) 사이트: https://www.flickr.com/services/api/
API키 얻기:    API키 > 다른 키 가져오기 > 비상업용 키 신청 > 입력창 입력후 등록
    api_key = "f0f68ae6f5595e0cdd664079c5d2e70a";
아이디:     flickr.com > 나 > 주소창 참조 https://www.flickr.com/photos/201500126@N03/
    myID = "201500126@N03";
호출 형식:      App Garden > 요청형식 > REST > REST 요청 형식
    baseURL = "https://www.flickr.com/services/rest/?method=";
매서드 선택:
    유저아이디 방식:    App Garden > people > flicker.people.getPhotos
        인수:  api_key (필수), user_id (필수), per_page (기본100개, 최대500개)
        method_mine = "flickr.people.getPhotos";
    인기목록 방식:    App Garden > people > flickr.interestingness.getList
        인수:  api_key (필수), per_page (기본100개, 최대500개)
        method_interest = "flickr.interestingness.getList";
    검색 방식:    App Garden > photos > flickr.photos.search
        인수:  api_key (필수), tags (태그 검색), text (텍스트 검색)
        method_search = "flickr.photos.search";
json 데이터 요청시 에러발생(...not valid JSON) 처리
    json데이터가 callback함수 안에 있기에 callback안의 데이터 직접 가져올때 옵션 추가
    options = "format=json&nojsoncallback=1";
json정보 추출 url:
    url = `${baseURL}${method_mime}&api_key=${api_key}&user_id=${myID}&${options}`;
    추출된 이미지 정보 리스트: json.photos.photo
    사용되는 키값:  id, owner, farm, server, secret, title
이미지:    App Garden > URL 
    예제: https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg
    옵션: 이미지 사이즈를 뒤에 small400(_w), medium640(_z), lange1024(_b) 등등 설정
    <img src="https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}_m.jpg" alt=${pic.title} /> 
유저프로필:    App Garden > 버디 아이콘
    대체이미지: https://www.flickr.com/images/buddyicon.gif 
    예제: http://farm{icon-farm}.staticflickr.com/{icon-server}/buddyicons/{nsid}.jpg
    <img src='http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}.jpg' alt=${pic.owner} /> <span>${pic.owner}</span>
*/

let optStr = "";
const [btnMine, btnPopular] = document.querySelectorAll("nav button");
const searchBox = document.querySelector(".searchBox");
const inputSearch = searchBox.querySelector("input");

// 초기 화면 (내 갤러리) 출력
fetchFlickr({ type: "mine" });

// 버튼 클릭시 이벤트 처리
btnMine.addEventListener("click", () => fetchFlickr({ type: "mine" }));
btnPopular.addEventListener("click", () => fetchFlickr({ type: "interest" }));
searchBox.addEventListener("submit", e => {
	e.preventDefault(); // 폼태그의 서버전송 기능을 막음
	if (!inputSearch.value.trim()) return;
	fetchFlickr({ type: "search", tags: inputSearch.value.trim() });
	inputSearch.value = "";
});

// Event Delegate (내부 클래스 속성에 따른 이벤트 처리)
document.body.addEventListener("click", e => {
	e.target.className === "thumb" && createModal(e);
	e.target.className === "btnClose" && removeModal();
	e.target.className === "userID" && fetchFlickr({ type: "user", userID: e.target.innerText });
});

// flickr 데이터 이미지 fetching
function fetchFlickr(opt) {
	// 같은 옵션인 경우 fetching처리 안함
	let stringifyOpt = JSON.stringify(opt);
	if (stringifyOpt === optStr) return;
	optStr = stringifyOpt;

	const api_key = "f0f68ae6f5595e0cdd664079c5d2e70a";
	const myID = "201500126@N03";
	const baseURL = `https://www.flickr.com/services/rest/?api_key=${api_key}&method=`;
	const method_mine = "flickr.people.getPhotos";
	const method_interest = "flickr.interestingness.getList";
	const method_search = "flickr.photos.search";
	const options = "format=json&nojsoncallback=1";

	const url_mine = `${baseURL}${method_mine}&user_id=${myID}&${options}`;
	const url_user = `${baseURL}${method_mine}&user_id=${opt.userID}&${options}`;
	const url_interest = `${baseURL}${method_interest}&${options}`;
	const url_search = `${baseURL}${method_search}&tags=${opt.tags}&${options}`;

	let url = "";
	if (opt.type === "mine") url = url_mine;
	if (opt.type === "user") url = url_user;
	if (opt.type === "interest") url = url_interest;
	if (opt.type === "search") url = url_search;
	console.log(opt);
	fetch(url)
		.then(data => data.json())
		.then(createList);
}

// 이미지 목록 생성
function createList(json) {
	const list = document.querySelector(".list");
	// 갤러리 목록 정보 화면에 출력
	let tag = "";
	json.photos.photo.forEach(pic => (tag += getInnerHTML(pic)));
	list.innerHTML = tag;

	// 프로파일 이미지가 깨지는 경우 대체 이미지 설정
	setDefProfileImg();
}

// 하나의 목록 태그 생성
function getInnerHTML(pic) {
	const picSrc = `https://live.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}`;
	const profileSrc = `http://farm${pic.farm}.staticflickr.com/${pic.server}/buddyicons/${pic.owner}`;
	return `
        <li>
          <figure class='pic'>
            <img class='thumb' src='${picSrc}_z.jpg' alt='${picSrc}_b.jpg' />
          </figure>
          <h2>${pic.title}</h2>

          <div class='profile'>
            <img src='${profileSrc}.jpg' alt='${pic.owner}' /> 
            <span class='userID'>${pic.owner}</span>
          </div>
        </li>
    `;
}

// 유저 프로파일 이미지가 깨지는 경우 대체 이미지 설정
function setDefProfileImg() {
	const buddyImg = "https://www.flickr.com/images/buddyicon.gif";
	const profileImg = document.querySelectorAll(".profile img");
	profileImg.forEach(imgEl => (imgEl.onerror = () => imgEl.setAttribute("src", buddyImg)));
}

// Modal 생성
function createModal(e) {
	const asideEl = document.createElement("aside");
	const imgSrc = e.target.getAttribute("alt");
	asideEl.innerHTML = `
        <div class='con'>
            <img src='${imgSrc}' />
        </div>
        <button class='btnClose'>CLOSE</button>
    `;
	document.body.append(asideEl);
}

// Modal 제거
function removeModal() {
	document.querySelector("aside").remove();
}
