// 클로저 (Closure)
// 반환된 내부함수가 자신이 선언됐을 떄의 환경 (Lexical 환경)인 스코프를 기억하여, 만일 자신이 선언됐을 때의 스코프의 밖에서 호출되어도 스코프에 접근할 수 있는 함수를 말한다.

// function outerFunc() {
//   var x = 10;
//   var innerFunc = function() {
//     console.log(x);
//   }
//   innerFunc();
// }

// outerFunc();
/*
1. 함수 outerFunc 내에서 내부함수 innerFunc()가 선언되고 호출되었다.
2. 이 때 내부함수 innerFunc()는 자신을 포함하고 있는 외부함수 outerFunc()의 변수 x 에 접근할 수 있다.
3. 이는 함수 innerFunc가 함수 outerFunc 의 내부에서 선언되었기 때문이다.

스코프는 함수를 호출할 때가 아니라 함수를 어디서 선언하였는지에 따라 결졍된다.
이를 렉시컬 스코핑 이라 한다.

- 만일 함수 innerFunc가 전역에 선언되었다면 함수 innerFunc 의 상위 스코프는 전역 스코프가 된다.

* 실행 컨텍스트의 관점에서 보면,
1. innerFunc 함수 스포크 내에서 변수 x를 찾는다. 없으므로 실패한다.
2. innerFunc 함수를 포함하는 외부 함수 outerFunc 의 스코프에서 변수 x를 찾는다. 검색이 성공한다.
*/

// 이번에는 내부함수를 외부함수 내에서 호출하는 것이 아닌, 반환하도록 변경해보자
function outerFunc() {
  var x = 10;
  var innerFunc = function() {
    console.log(x);
  }
  return innerFunc;
}
// 함수 outerFunc를 호출하면 내부 함수 innerFunc 가 반환된다.
// 그리고 함수 outerFunc 의 실행컨텍스트는 소멸된다.
// 즉, outerFunc 의 변수 x 또한 유효하지 않게 되어 변수 x 에 접근할 수 있는 방법은 달리 없어보인다. 
var inner = outerFunc();
inner(); // 10
// 하지만 실행 결과는 변수 x 의 값인 10 이다.
// 이미 life-cycle 이 종료되어 실행 컨텍스트 스택에서 제거된 함수 outerFunc의 지역변수 x가 다시 부활이라도 한 듯 동작하고 있다. 
// 📍이처럼 자신을 포함하고 있는 외부함수보다 내부함수가 더 오래 유지되는 경우, 외부함수 밖에서 내부함수가 호출되더라도 외부함수의 지역 변수에 접근할 수 있는데 이러한 함수를 "클로저" 라고 부르는 것이다.

var increase = function() {
  var counter = 0;
  return function() { // 클로저
    return counter++;
  }
}

var inc = increase(); // 클로저 생성
console.log(inc());
console.log(inc());
console.log(inc());

// console.log(increase()); 가 아닌 이유
// increase 함수는 함수 자체를 반환하고 있기 떄문에 바로 출력시 
// [Function (anonymous)] 가 출력됨

/************************
 * 문제 1. 클로저 기본
 */

function outer() {
  let a = 10;

  return function inner() {
    console.log(a);
  }
}

const f = outer();
f();
// Q. outer() 함수는 이미 끝났는데 a를 어떻게 사용할 수 있을까 ?
// A. inner함수가 outer 함수의 렉시컬 환경을 참조하는 클로저이기 때문에   외부함수의 실행이 끝나더라도 a 변수에 계속 접근할 수 있다.
/******************************
outer 실행
└ a = 10
└ inner 생성 (a를 참조)

outer 종료

하지만
inner가 a를 참조하고 있어서
a는 메모리에서 사라지지 않음
 */

/************************
 * 문제2. 클로저 상태 유지
 */
function counter() {
  let count = 0;

  return function() {
    count++;
    console.log(count);
  }
}

const c1 = counter();
c1();
c1();
c1();

const c2 = counter();
c2(); // 1

/*****************************
 * 문제 3. 많이 틀리는 문제
 */
function counter2() {
  let count = 0;

  return function() {
    return ++count;
  }
}
console.log('===counter2 호출===');
console.log(counter2()()); 
console.log(counter2()()); 
console.log(counter2()());
// Q. 왜 증가하지 않고 값이 동일할까?
// counter2() 가 매번 새로 실행되기 때문이다. 만약 증가하게 하려면 클로저를 "저장"해야한다. ex) const c = counter2(); 
// Q. 함수 반환인데 왜 Function 이 출력되는게 아니라 숫자가 출력되나?
// console.log(counter2()); - 이 경우면 [Function] 이 호출된다. 하지만 counter2()()는 그 함수를 실행하기 때문에 숫자가 반환된다.
/********************
counter2() → 함수 반환
() → 그 함수 실행
 */

/**************************
 * 문제4. 클로저의 진짜 목적
 */
function makeCounter() {
  let count = 0;

  return {
    increase: function() {
      return ++count;
    },
    decrease: function() {
      return --count;
    }
  }
}

const counter3 = makeCounter();

console.log(counter3.increase()); // 1
console.log(counter3.increase()); // 2
console.log(counter3.decrease()); // 1


/**************
 * 문제 5
 */
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// 0, 1초후 1, 1초후 2 ❌❌

// 1. for 문 먼저 끝남. 이 과정은 1초를 기다리지 않음
// i = 0 -> setTimeout 등록
// i = 1 -> setTimeout 등록
// i = 2 -> setTimeout 등록
// i = 3 -> for 문 종료
// 즉, 1초 기다리면서 for 문을 도는게 아님. 

// 2. for 문 끝났을 때 i = 3 

// 3. 1초뒤 예약된 함수들이 실행됨 
// 실행시점의 i = 3

// var & let 의 차이
// for (let i = 0; i < 3; i++) {
//   setTimeout(function() {
//     console.log(i);
//   }, 1000);
// }

for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, i * 1000);
}
// 즉시 0, 1초후 1, 2초후 2