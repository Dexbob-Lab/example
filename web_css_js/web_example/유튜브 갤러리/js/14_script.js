/*
    절차지향 프로그래밍
    - 코드를 시간의 흐름에 따라 위에서부터 아래로 쭉 나열한 방식
    - 장점 : 코드가 복잡하지 않은 로직은 가독성 좋음
    - 단점 : 코드가 복잡할수록 가독성이 떨어짐, 코드 재활용 불가

    프로그래밍시 추상화의 필요성
    - 추상화 : 기능을 독립적으로 모듈화시켜 외부에 노출을 피하거나 코드의 재사용성을 높이는 방식
    
    추상화를 위한 대표적인 프로그래밍 기법
    - 객체지향 프로그래밍 (prototype)
    - 함수형 프로그래밍 (lexical scope의 Clouser환경을 기반)
    - 이벤트와 기능함수를 분리
*/

// Global Variables
const pid = "PLQZ4zrrwKYcVtZlplT8_HwY-UPFSJBECr";
const num = 10;

// Load Event Binding
fetchYoutube(pid, num);

// Event Delegate
document.body.addEventListener("click", e => {
	// class속성이 'vidTitle'인 요소에서 클릭 이벤트 발생시 처리
	e.target.className === "vidTitle" && createModal(e);
	// class속성이 'btnClose'인 요소에서 클릭 이벤트 발생시 처리
	e.target.className === "btnClose" && removeModal();
});

// youtube data fetching
function fetchYoutube(pid, num) {
	const api_key = "AIzaSyC8rken4rsvgg8pRlvXIqXBKSVT2R1aoGI";
	const baseUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
	const url = `${baseUrl}?part=snippet&playlistId=${pid}&key=${api_key}&maxResults=${num}`;

	// json데이터를 읽어와 화면에 출력
	fetch(url)
		.then(data => data.json())
		.then(json => json.items.forEach(setInnerText));
}

// 화면 출력 내용 설정
function setInnerText(item) {
	const frame = document.querySelector("section");
	const data = item.snippet;
	frame.innerHTML += `
        <article>
            <h2 class='vidTitle' data-id=${data.resourceId.videoId}>
                ${shortenText(data.title, 60)}
            </h2>
            <div class='txt'>
                <p>${shortenText(data.description, 120)}</p>
                <span>${changeDate(data.publishedAt)}</span>
            </div>
            <div class="pic">
                <img src="${data.thumbnails.standard.url}" alt="${data.title}">
            </div>
        </article>
    `;
}

// 말줄임표(...) 처리
const shortenText = (text, size) => (text.length > size ? text.slice(0, size) + "..." : text);
// 날짜 변환 (-)를 (/)로 변환
const changeDate = text => text.trim().slice(0, 10).replaceAll("-", ".");

// Modal 생성
function createModal(e) {
	const asideEl = document.createElement("aside");
	const vidId = e.target.dataset.id;
	asideEl.innerHTML = `
        <div class='con'>
            <iframe id="player" type="text/html" 
            src="http://www.youtube.com/embed/${vidId}" frameborder="0"></iframe>
        </div>
        <button class='btnClose'>CLOSE</button>
    `;
	document.body.append(asideEl);
}

// Modal 제거
function removeModal() {
	document.querySelector("aside").remove();
}
