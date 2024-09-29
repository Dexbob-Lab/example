/*
폼메일 연동
사이트: https://www.emailjs.com/
서비스 생성:    Add New Service > Gmail > connect acount로 gmail 연동 > create service로 생성
API키:  본인아이디 클릭 > Account > API keys
    STldV9YuldMr707oO
서비스ID:  Email Services > 생성한 service 선택 > Service ID
    service_l46unrl
템플릿 설정:   Email Templates > Create New Template > Edit Content > Design Editor > 
    원하는 템플릿으로 수정 > Apply Changes > Save
템플릿ID:  Email Templates > 생성한 템플릿 > Settings > Template ID
    template_uy5ef06
EmailJS 메일 연동:  Docs > SDK > Installation > Browser script
    <script type="text/javascript"
            src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js">
    </script>
이용 방법:  Tutorial > Create a contact form > 초기화 / send 방식 / html의 form형식 이용

*/

const form = document.querySelector("#contact-form");
const user_name = document.querySelector("#uName");
const user_email = document.querySelector("#uEmail");
const message = document.querySelector("#msg");

emailjs.init({
	publicKey: "STldV9YuldMr707oO"
});

form.addEventListener("submit", e => {
	e.preventDefault();
	if (!user_name.value.trim() || !user_email.value.trim() || !message.value.trim())
		return alert("모든 입력 항목을 작성해주세요!");
	emailjs.sendForm("service_l46unrl", "template_uy5ef06", form).then(
		() => {
			user_name.value = "";
			user_email.value = "";
			message.value = "";
			alert("문의 내용이 성공적으로 전달되었습니다.");
		},
		error => {
			alert("문의내용 전송에 실패했습니다.\n" + error);
		}
	);
});
