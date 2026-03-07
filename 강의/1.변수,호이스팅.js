// 복습

// var, let 차이
// 1-1) var: 한 번 선언된 변수를 다시 선언할 수 있다.
// 2-2) var는 선언하기 전에 사용할 수 있다. 호이스팅이 이루어짐. 스코프내에서 변수 선언을 최상단부로 끌어올리는 효과. (할당은 호이스팅 X)
console.log(name);  // undefined
var name = 'Mike';
console.log(name);

var name = 'Jane';
console.log(name);

// 1-2) let은 재선언불가능
// 2-2) let 은 선언하기 전에 사용 불가능
// 그런데 let 도 호이스팅이 이루어지긴하나, TDZ(Temporal Dead Zone)의 영향을 받기 때문에 TDZ 내의 변수들은 사용할 수 없다.
// console.log(name2); ReferenceError: Cannot access 'name2' before initialization
let name2 = 'Mike';
// let name2 = 'Jane'; // Cannot redeclare block-scoped variable 'name2'

let age = 30;
function showAge() {
  // console.log(age);
  let age = 20;
}
showAge();

// <변수의 생성 과정>
// var - 1. 선언과 초기화(undefined할당) 동시에, 2. 할당단계
// let - 1. 선언 단계, 2. 초기화 단계, 3. 할당단계
// const - 1. 선언 + 초기화 + 할당 동시에

// <스코프>
// 1) var - 함수 스코프 ("함수" 스코프내에서 선언된 변수만 지역변수로 취급)
const age2 = 30;
if(age2 > 19) {
  var txt = '성인';
}
console.log(txt); // 성인
// 함수가 아닌 if 조건문에서 사용되었기 때문에 전역변수 취급

function isAdult() {
  var text = '성인인가요';
}
// console.log(text); // ReferenceError: text is not defined

// 2) let, const - 함수, if문, for 문, while문, try~catch 문 등