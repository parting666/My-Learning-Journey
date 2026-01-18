好的，这里有50个针对JavaScript初学者精心编写的例子，全面覆盖了JavaScript的核心概念，并且避免了重复。每个例子都有详细的中文注释，力求让初学者能够轻松理解每一行代码的含义。

### **第一部分：基础语法 (1-10)**

#### **1. Hello, World! - 你的第一个JavaScript程序**
这个例子将展示如何在浏览器的控制台中输出一条消息，这是学习任何编程语言的第一步。

```javascript
// 在浏览器的控制台中打印 "Hello, World!"
// console.log() 是一个非常有用的工具，用于在开发过程中调试代码。
console.log("Hello, World!");
```

#### **2. 变量声明与使用**
变量是用于存储数据的容器。这个例子将演示如何声明变量并赋予不同类型的值。

```javascript
// 使用 let 关键字声明一个变量，变量名是 message
// let 声明的变量是块级作用域的，意味着它只在声明它的代码块（例如，一个函数或一个循环）内有效。
let message;

// 给变量 message 赋值一个字符串
message = "你好, JavaScript!";

// 在控制台输出变量的值
console.log(message); // 输出: 你好, JavaScript!

// 声明并同时初始化一个变量
let name = "小明";
console.log(name); // 输出: 小明
```

#### **3. 数据类型：字符串 (String)**
字符串是用于表示文本的数据类型。

```javascript
// 声明一个字符串变量
let greeting = "你好, ";

// 声明另一个字符串变量
let person = "世界";

// 使用 + 操作符连接两个字符串
let completeGreeting = greeting + person + "!";

// 输出连接后的字符串
console.log(completeGreeting); // 输出: 你好, 世界!

// 使用模板字符串 (template literals) 拼接字符串，这是一种更现代、更易读的方式
let templateString = `${greeting}${person}!`;
console.log(templateString); // 输出: 你好, 世界!
```

#### **4. 数据类型：数字 (Number)**
数字类型用于表示整数和浮点数。

```javascript
// 声明一个整型变量
let integerNumber = 10;

// 声明一个浮点型变量
let floatNumber = 3.14;

// 进行基本的数学运算
let sum = integerNumber + 5; // 加法
let product = integerNumber * floatNumber; // 乘法
let division = integerNumber / 2; // 除法

// 输出运算结果
console.log("整数:", integerNumber);
console.log("浮点数:", floatNumber);
console.log("和:", sum); // 输出: 和: 15
console.log("积:", product); // 输出: 积: 31.400000000000002
console.log("商:", division); // 输出: 商: 5
```

#### **5. 数据类型：布尔 (Boolean)**
布尔类型只有两个值：`true` (真) 和 `false` (假)，常用于条件判断。

```javascript
// 声明一个布尔变量
let isLearning = true;

// 另一个布尔变量
let isTired = false;

// 在控制台输出布尔值
console.log("正在学习吗?", isLearning); // 输出: 正在学习吗? true
console.log("累了吗?", isTired); // 输出: 累了吗? false

// 在 if 语句中使用布尔值
if (isLearning) {
  console.log("继续努力！"); // 这行代码会被执行
}
 isLearning = false;
if (isLearning==false) {
  console.log("继续努力！"); // 这行代码不会被执行
}
 isLearning = true;
if (isLearning==true) {
  console.log("继续努力！"); // 这行代码会被执行
}
// isTired = true;
if (isTired) {
  console.log("休息一下吧。"); // 这行代码不会被执行
}
if (!isTired) {
  console.log("休息一下吧。"); // 这行代码不会被执行
}


```

#### **6. 数据类型：数组 (Array)**
数组是一个有序的集合，可以存储任何类型的数据。

```javascript
// 声明一个包含字符串的数组
let fruits = ["苹果", "香蕉", "橙子"];

// 访问数组中的元素，索引从 0 开始
console.log(fruits[0]); // 输出: 苹果
console.log(fruits[1]); // 输出: 香蕉

// 修改数组中的元素
fruits[1] = "蓝莓";
console.log(fruits); // 输出: ["苹果", "蓝莓", "橙子"]

// 获取数组的长度
console.log("水果的数量:", fruits.length); // 输出: 水果的数量: 3
```

#### **7. 数据类型：对象 (Object)**
对象是键值对的集合，用于表示更复杂的数据结构。

```javascript
// 声明一个表示“人”的对象
let person = {
  // "name" 是键（key），"张三" 是值（value）
  name: "张三",
  age: 25,
  isStudent: false,

  // 对象中可以包含函数，我们称之为“方法”
  sayHello: function() {
    console.log("你好，我是 " + this.name); // this 关键字指向当前对象
  }
};

// 访问对象的属性
console.log(person.name); // 输出: 张三
console.log(person.age); // 输出: 25

// 调用对象的方法
person.sayHello(); // 输出: 你好，我是 张三
```

#### **8. 基本运算符**
这个例子涵盖了算术运算符、赋值运算符和比较运算符。

```javascript
// 算术运算符
let a = 10;
let b = 5;
console.log("a + b =", a + b); // 加法: 15
console.log("a - b =", a - b); // 减法: 5
console.log("a * b =", a * b); // 乘法: 50
console.log("a / b =", a / b); // 除法: 2
console.log("a % b =", a % b); // 取模 (余数): 0

// 赋值运算符
let x = 10;
x += 5; // 等同于 x = x + 5;
console.log("x 的值:", x); // 输出: 15

// 比较运算符
let num1 = 10;
let num2 = "10";
console.log("num1 == num2:", num1 == num2);   // 等于 (值相等即可): true
console.log("num1 === num2:", num1 === num2); // 严格等于 (值和类型都必须相等): false
console.log("num1 != num2:", num1 != num2);   // 不等于: false
console.log("num1 > 5:", num1 > 5);          // 大于: true
```

#### **9. 函数声明与调用**
函数是一段可重复使用的代码块，可以通过名字来调用。

```javascript
// 声明一个名为 greet 的函数，它接受一个参数 name
function greet(name) {
  // 函数体内的代码
  let greeting = "你好, " + name + "!";

  // 使用 return 关键字返回一个值
  return greeting;
}

// 调用 greet 函数，并传入参数 "世界"
let result = greet("世界");

// 输出函数返回的结果
console.log(result); // 输出: 你好, 世界!
```

#### **10. `null` 与 `undefined`**
这两个特殊的值都表示“没有值”，但有细微的区别。

```javascript
// 声明一个变量但没有给它赋值，它的默认值就是 undefined
let notDefined;
console.log("未赋值的变量:", notDefined); // 输出: undefined

// 访问对象中不存在的属性，也会得到 undefined
let myObject = { a: 1 };
console.log("对象不存在的属性:", myObject.b); // 输出: undefined

// null 是一个表示“空值”或“无对象”的赋值
// 开发者可以显式地将一个变量的值设置为 null
let emptyValue = null;
console.log("空值:", emptyValue); // 输出: null
```

### **第二部分：控制流 (11-20)**

#### **11. `if-else` 条件语句**
根据条件的真假来执行不同的代码块。

```javascript
// 声明一个变量来表示年龄
let age = 18;

// if 语句检查条件是否为真
if (age >= 18) {
  // 如果条件为真，执行这里的代码
  console.log("你已经是成年人了。");
} else {
  // 如果条件为假，执行这里的代码
  console.log("你还未成年。");
}
```

#### **12. `if-else if-else` 链式条件语句**
用于处理多个条件分支的情况。

```javascript
// 声明一个变量表示分数
let score = 85;

// 使用 if-else if-else 链来判断分数的等级
if (score >= 90) {
  console.log("优秀");
} else if (score >= 80) {
  console.log("良好"); // 这个条件满足，输出 "良好"
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}
```

#### **13. `switch` 语句**
当有多个固定的值需要比较时，`switch` 是 `if-else if` 的一个更清晰的替代方案。

```javascript
// 声明一个变量表示星期几
let day = "星期三";

// 使用 switch 语句根据 day 的值执行不同的代码
switch (day) {
  case "星期一":
    console.log("开始新的一周！");
    break; // break 语句用于跳出 switch 语句
  case "星期三":
    console.log("周中加油！"); // 匹配成功，执行这里的代码
    break;
  case "星期五":
    console.log("周末要到了！");
    break;
  default: // 如果没有任何一个 case 匹配，则执行 default 里的代码
    console.log("享受每一天！");
    break;
}
```

#### **14. `for` 循环**
`for` 循环用于重复执行一段代码，直到指定的条件不再满足。

```javascript
// 使用 for 循环打印从 1 到 5 的数字
// 1. 初始化: let i = 1; (循环开始前执行)
// 2. 条件判断: i <= 5; (每次循环前检查)
// 3. 增量: i++ (每次循环后执行)
for (let i = 1; i <= 5; i++) {
  console.log("循环次数:", i);
}
```

#### **15. `while` 循环**
`while` 循环在指定条件为真时，会一直重复执行代码块。

```javascript
// 声明一个计数器变量
let count = 0;

// while 循环，当 count 小于 5 时持续执行
while (count < 5) {
  console.log("while 循环计数:", count);
  count++; // 每次循环后增加 count 的值，防止无限循环
}
```

#### **16. `do...while` 循环**
与 `while` 循环类似，但 `do...while` 循环至少会执行一次代码块，即使条件为假。

```javascript
// 声明一个变量
let number = 10;

// do...while 循环
do {
  // 这里的代码块会先执行一次
  console.log("do...while 执行了一次。数字是:", number);
  number++;
} while (number < 5); // 然后再判断条件，此时条件为 false，循环结束
```

#### **17. `break` 语句**
`break` 语句用于跳出循环。

```javascript
// 使用 for 循环，当找到特定数字时跳出
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    console.log("找到了数字 5，跳出循环！");
    break; // 当 i 等于 5 时，跳出整个 for 循环
  }
  console.log("当前数字是:", i);
}
```

#### **18. `continue` 语句**
`continue` 语句用于跳过当前循环的剩余部分，并直接开始下一次迭代。

```javascript
// 使用 for 循环，跳过所有偶数
for (let i = 1; i <= 10; i++) {
  // 如果 i 是偶数 (i % 2 === 0)
  if (i % 2 === 0) {
    continue; // 跳过本次循环的剩余代码，直接进入下一次循环
  }
  // 只会打印奇数
  console.log("奇数:", i);
}
```

#### **19. 逻辑运算符 `&&` (AND) 和 `||` (OR)**
逻辑运算符用于组合多个条件。

```javascript
// 声明两个布尔变量
let hasTicket = true;
let isAdult = false;

// && (AND): 只有当所有条件都为 true 时，结果才为 true
if (hasTicket && isAdult) {
  console.log("可以进入会场。"); // 不会被执行
} else {
  console.log("不满足所有条件，无法进入。");
}

let isMember = true;
let hasCoupon = false;
// || (OR): 只要有一个条件为 true，结果就为 true
if (isMember || hasCoupon) {
  console.log("可以享受折扣。"); // 会被执行
}
```

#### **20. 三元运算符**
三元运算符是 `if-else` 语句的简洁写法。

```javascript
// 声明一个变量表示温度
let temperature = 25;

// 使用三元运算符判断天气
// 条件 ? 如果为真执行的表达式 : 如果为假执行的表达式
let weather = temperature > 30 ? "炎热" : "舒适";

// 输出结果
console.log("今天的天气:", weather); // 输出: 舒适
```

### **第三部分：函数进阶 (21-25)**

#### **21. 函数表达式**
将一个函数赋值给一个变量。

```javascript
// 这是一个函数表达式
// 将一个匿名函数 (没有名字的函数) 赋值给变量 multiply
const multiply = function(a, b) {
  return a * b;
};

// 通过变量名调用函数
let product = multiply(4, 5);
console.log("4 和 5 的乘积是:", product); // 输出: 20
```

#### **22. 箭头函数 (Arrow Functions)**
ES6 引入的更简洁的函数写法。

```javascript
// 传统的函数表达式
const add_traditional = function(a, b) {
  return a + b;
};

// 使用箭头函数
// (参数) => { 函数体 }
const add_arrow = (a, b) => {
  return a + b;
};

// 如果函数体只有一行 return 语句，可以省略 {} 和 return
const subtract = (a, b) => a - b;

console.log("传统函数求和:", add_traditional(2, 3)); // 输出: 5
console.log("箭头函数求和:", add_arrow(2, 3)); // 输出: 5
console.log("箭头函数求差:", subtract(5, 2)); // 输出: 3
```

#### **23. 函数的默认参数**
在定义函数时为参数指定默认值。

```javascript
// 为参数 'name' 设置默认值为 "朋友"
function sayHi(name = "朋友") {
  console.log(`你好- ${name}!`);
}

// 不传递参数，使用默认值
sayHi(); // 输出: 你好, 朋友!

// 传递参数，覆盖默认值
sayHi("小红"); // 输出: 你好, 小红!
```

#### **24. 作用域 (Scope)**
变量的可访问范围。JavaScript 有全局作用域和局部（函数）作用域。

```javascript
// 全局变量，在脚本的任何地方都可以访问
let globalVar = "我是一个全局变量";

function testScope() {
  // 局部变量，只在 testScope 函数内部有效
  let localVar = "我是一个局部变量";
  console.log(localVar); // 输出: 我是一个局部变量
  console.log(globalVar); // 函数内部可以访问全局变量
}

testScope();

console.log(globalVar); // 输出: 我是一个全局变量
// console.log(localVar); // 这里会报错，因为在函数外部无法访问局部变量
```

#### **25. 闭包 (Closure)**
一个函数和对其周围状态（词法环境）的引用捆绑在一起构成的组合。

```javascript
// 这是一个返回函数的函数
function createCounter() {
  // count 是一个局部变量，但它被下面的匿名函数“记住”了
  let count = 0;

  // 返回一个函数
  return function() {
    count++;
    return count;
  };
}

// counter1 和 counter2 是两个独立的闭包
// 它们各自拥有自己的 count 变量
const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 输出: 1
console.log(counter1()); // 输出: 2
console.log(counter2()); // 输出: 1
```

### **第四部分：数组和对象操作 (26-35)**

#### **26. 数组方法：`push` 和 `pop`**
在数组末尾添加或删除元素。

```javascript
let numbers = [1, 2, 3];

// push() 在数组末尾添加一个或多个元素，并返回新的长度
numbers.push(4);
console.log("push 后的数组:", numbers); // 输出: [1, 2, 3, 4]

// pop() 删除并返回数组的最后一个元素
let lastElement = numbers.pop();
console.log("被 pop 的元素:", lastElement); // 输出: 4
console.log("pop 后的数组:", numbers); // 输出: [1, 2, 3]
```

#### **27. 数组方法：`forEach`**
遍历数组的每个元素。

```javascript
let colors = ["红色", "绿色", "蓝色"];                 

// forEach 方法为数组中的每个元素执行一次提供的函数
// 它接受一个回调函数作为参数，该函数可以接收三个参数：当前元素、当前索引、原数组
colors.forEach(function(color, index) {
  console.log(`索引 ${index}： ${color}`);
});
```

#### **28. 数组方法：`map`**
创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

```javascript
let originalNumbers = [1, 2, 3, 4];

// map 方法创建一个新数组，新数组的每个元素都是原数组元素的两倍
let doubledNumbers = originalNumbers.map(function(num) {
  return num * 2;
});

console.log("原数组:", originalNumbers); // 输出: [1, 2, 3, 4]
console.log("新数组:", doubledNumbers); // 输出: [2, 4, 6, 8]
```

#### **29. 数组方法：`filter`**
创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

```javascript
let mixedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// filter 方法创建一个新数组，只包含原数组中的偶数
let evenNumbers = mixedNumbers.filter(function(num) {
  // 如果返回 true，则该元素被保留
  return num % 2 === 0;
});

console.log("所有数字:", mixedNumbers);
console.log("偶数:", evenNumbers); // 输出: [2, 4, 6, 8, 10]
```

#### **30. 数组方法：`find`**
返回数组中满足提供的测试函数的第一个元素的值。否则返回 `undefined`。

```javascript
let students = [
  { name: "小明", score: 85 },
  { name: "小红", score: 92 },
  { name: "小刚", score: 78 }
];

// find 方法找到第一个分数大于 90 的学生
let topStudent = students.find(function(student) {
  return student.score > 90;
});

console.log("第一个高分学生:", topStudent); // 输出: { name: "小红", score: 92 }
```

#### **31. 数组方法：`reduce`**
对数组中的每个元素执行一个 “reducer” 函数（升序执行），将其结果汇总为单个返回值。

```javascript
let prices = [10, 20, 30, 40];

// reduce 方法计算数组所有元素的总和
// accumulator: 累加器，保存上一次回调的返回值
// currentValue: 当前处理的元素
// 0 是 accumulator 的初始值
let total = prices.reduce(function(accumulator, currentValue) {
  return accumulator + currentValue;
}, 0);

console.log("总价:", total); // 输出: 100```

#### **32. 对象的属性访问**
演示两种访问对象属性的方式：点表示法和方括号表示法。

```javascript
let car = {
  brand: "Tesla",
  "model-name": "Model S", // 属性名包含特殊字符，需要用引号括起来
  year: 2025
};

// 1. 点表示法 (Dot Notation)
// 当属性名是有效的 JavaScript 标识符时使用
console.log("品牌:", car.brand); // 输出: Tesla

// 2. 方括号表示法 (Bracket Notation)
// 当属性名是动态的（变量），或者包含特殊字符时使用
console.log("型号:", car["model-name"]); // 输出: Model S

let propertyToAccess = "year";
console.log("年份:", car[propertyToAccess]); // 输出: 2025
```

#### **33. `for...in` 循环遍历对象**
`for...in` 语句用于遍历一个对象的所有可枚举属性。

```javascript
let book = {
  title: "JavaScript 从入门到精通",
  author: "匿名",
  pages: 500
};

// 使用 for...in 循环遍历 book 对象的所有属性
for (let key in book) {
  // key 是对象的属性名 (例如 "title", "author", "pages")
  // book[key] 是对应属性的值
  console.log(`${key}: ${book[key]}`);
}
```

#### **34. `Object.keys()` 和 `Object.values()`**
获取一个对象的所有键或所有值。

```javascript
let computer = {
  cpu: "Intel i9",
  ram: "32GB",
  storage: "1TB SSD"
};

// Object.keys() 返回一个包含所有键名的数组
let keys = Object.keys(computer);
console.log("所有键:", keys); // 输出: ["cpu", "ram", "storage"]

// Object.values() 返回一个包含所有值的数组
let values = Object.values(computer);
console.log("所有值:", values); // 输出: ["Intel i9", "32GB", "1TB SSD"]
```

#### **35. 展开运算符 (Spread Operator) `...`**
在数组或对象字面量中展开可迭代对象。

```javascript
// 用于数组
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combinedArray = [...arr1, ...arr2]; // 合并数组
console.log("合并后的数组:", combinedArray); // 输出: [1, 2, 3, 4, 5, 6]

// 用于对象
let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3, d: 4 };
let combinedObject = { ...obj1, ...obj2 }; // 合并对象
console.log("合并后的对象:", combinedObject); // 输出: { a: 1, b: 2, c: 3, d: 4 }

// 创建对象的浅拷贝
let originalObject = { name: "苹果", color: "红色" };
let copiedObject = { ...originalObject };
console.log("拷贝的对象:", copiedObject);
```

### **第五部分：DOM 操作 (36-45)**

*注意：以下示例需要在 HTML 文件中运行才能看到效果。*

#### **36. 通过 ID 获取元素**
`getElementById` 是最常用的获取单个 DOM 元素的方法。

**HTML:**
```html
<p id="my-paragraph">这是一个段落。</p>
```**JavaScript:**
```javascript
// 通过元素的 id 获取 DOM 对象
const paragraph = document.getElementById("my-paragraph");

// 修改元素的文本内容
paragraph.textContent = "这段文字被 JavaScript 修改了！";

// 修改元素的样式
paragraph.style.color = "blue";
paragraph.style.fontSize = "20px";
```

#### **37. 通过类名或标签名获取元素**
获取一组 DOM 元素。

**HTML:**
```html
<ul>
  <li class="list-item">项目 1</li>
  <li class="list-item">项目 2</li>
  <li>项目 3</li>
</ul>
```
**JavaScript:**
```javascript
// getElementsByClassName 返回一个 HTMLCollection (类似数组的对象)
const listItems = document.getElementsByClassName("list-item");

// 遍历这个集合，并修改每个元素的样式
for (let i = 0; i < listItems.length; i++) {
  listItems[i].style.fontWeight = "bold";
}

// getElementsByTagName 同样返回一个 HTMLCollection
const allListItems = document.getElementsByTagName("li");
console.log("总共有", allListItems.length, "个列表项。");
```

#### **38. 使用 `querySelector` 和 `querySelectorAll`**
更现代、更强大的元素选择方法，使用 CSS 选择器语法。

**HTML:**
```html
<div id="container">
  <p class="intro">这是一个简介。</p>
  <p>这是另一个段落。</p>
</div>
```
**JavaScript:**
```javascript
// querySelector 返回匹配的第一个元素
const introParagraph = document.querySelector("#container .intro");
introParagraph.style.fontStyle = "italic";

// querySelectorAll 返回一个 NodeList，包含所有匹配的元素
const allParagraphs = document.querySelectorAll("#container p");

// 使用 forEach 遍历 NodeList
allParagraphs.forEach(function(p) {
  p.style.border = "1px solid #ccc";
  p.style.padding = "5px";
});
```

#### **39. 修改元素内容：`textContent` vs `innerHTML`**
`textContent` 只处理文本，而 `innerHTML` 可以解析 HTML 标签。

**HTML:**
```html
<div id="content-box"></div>
```
**JavaScript:**
```javascript
const contentBox = document.getElementById("content-box");

// 使用 textContent 设置内容 (HTML 标签会作为纯文本显示)
// contentBox.textContent = "<strong>这是粗体文字吗？</strong>";

// 使用 innerHTML 设置内容 (HTML 标签会被浏览器解析)
contentBox.innerHTML = "<strong>这是真正的粗体文字！</strong>";
```

#### **40. 创建和添加元素**
动态地在页面上创建新的 HTML 元素。

**HTML:**
```html
<div id="main-content"></div>
```
**JavaScript:**
```javascript
const mainContent = document.getElementById("main-content");

// 1. 创建一个新的 <h2> 元素
const newHeading = document.createElement("h2");

// 2. 设置新元素的内容
newHeading.textContent = "这是动态添加的标题";

// 3. 将新元素添加到 main-content 内部的末尾
mainContent.appendChild(newHeading);

// 创建另一个元素
const newParagraph = document.createElement("p");
newParagraph.textContent = "这是动态添加的段落内容。";
mainContent.appendChild(newParagraph);
```

#### **41. 事件监听：`addEventListener`**
为元素添加事件处理函数，响应用户的操作。

**HTML:**
```html
<button id="my-button">点我</button>
```
**JavaScript:**
```javascript
const button = document.getElementById("my-button");

// 添加一个 'click' 事件的监听器
// 当按钮被点击时，会执行提供的函数
button.addEventListener("click", function() {
  alert("按钮被点击了！");
});
```

#### **42. 事件对象**
当事件发生时，浏览器会创建一个事件对象，其中包含了事件的详细信息。

**HTML:**
```html
<div id="mouse-area" style="width: 200px; height: 100px; border: 1px solid black;"></div>
<p id="coords"></p>
```
**JavaScript:**
```javascript
const mouseArea = document.getElementById("mouse-area");
const coordsDisplay = document.getElementById("coords"); 

// 'mousemove' 事件在鼠标指针在元素上移动时触发
mouseArea.addEventListener("mousemove", function(event) {
  // event 是事件对象
  // event.clientX 和 event.clientY 是鼠标相对于浏览器窗口的坐标
  coordsDisplay.textContent = `鼠标坐标: X=${event.clientX}, Y=${event.clientY}`;
});
```

#### **43. 表单事件：获取输入框的值**
监听表单元素的 `input` 或 `change` 事件来获取用户输入。

**HTML:**
```html
<label for="username">用户名:</label>
<input type="text" id="username">
<p>你输入的是: <span id="output"></span></p>
```
**JavaScript:**
```javascript
const usernameInput = document.getElementById("username");
const outputSpan = document.getElementById("output");

// 'input' 事件在输入框的值每次发生变化时都会触发
usernameInput.addEventListener("input", function(event) {
  // event.target 指向触发事件的元素，也就是这个 input
  outputSpan.textContent = event.target.value;
});
```

#### **44. 阻止默认行为 `preventDefault`**
阻止元素的默认行为，例如阻止链接跳转或表单提交。

**HTML:**
```html
<form id="my-form">
  <input type="text" placeholder="输入一些内容">
  <button type="submit">提交</button>
</form>
```
**JavaScript:**
```javascript
const form = document.getElementById("my-form");

// 监听表单的 'submit' 事件
form.addEventListener("submit", function(event) {
  // 阻止表单的默认提交行为（页面刷新）
  event.preventDefault();
  alert("表单提交被 JavaScript 阻止了！");
});
```

#### **45. 修改 CSS 类名**
通过操作 `classList` 属性来动态添加、删除或切换 CSS 类。

**HTML:**
```html
<style>
  .box { width: 100px; height: 100px; border: 1px solid black; }
  .active { background-color: yellow; }
</style>
<div id="toggle-box" class="box"></div>
<button id="toggle-button">切换高亮</button>
```
**JavaScript:**
```javascript
const toggleBox = document.getElementById("toggle-box");
const toggleButton = document.getElementById("toggle-button");

toggleButton.addEventListener("click", function() {
  // classList.toggle() 方法：如果类名存在则删除，不存在则添加
  toggleBox.classList.toggle("active");
});
```

### **第六部分：异步编程 (46-50)**

#### **46. `setTimeout` - 延迟执行**
在指定的延迟时间后执行一次函数。

```javascript
console.log("程序开始");

// setTimeout 接受一个回调函数和延迟的毫秒数 (3000ms = 3s)
// 这段代码不会阻塞后面的代码执行
setTimeout(function() {
  console.log("3秒后执行的代码！");
}, 3000);

console.log("程序继续执行...");
// 输出顺序:
// 1. "程序开始"
// 2. "程序继续执行..."
// 3. (大约3秒后) "3秒后执行的代码！"
```

#### **47. `setInterval` - 定时执行**
每隔指定的延迟时间重复执行一个函数。

**HTML:**
```html
<p>计时器: <span id="timer">0</span></p>
<button id="stop-button">停止</button>
```
**JavaScript:**
```javascript
let count = 0;
const timerSpan = document.getElementById("timer");
const stopButton = document.getElementById("stop-button");

// 每隔 1000 毫秒 (1秒) 执行一次函数
const intervalId = setInterval(function() {
  count++;
  timerSpan.textContent = count;
}, 1000);

// 点击按钮时停止计时器
stopButton.addEventListener("click", function() {
  // clearInterval 用于停止由 setInterval 创建的定时器
  clearInterval(intervalId);
  console.log("计时器已停止。");
});
```

#### **48. 回调函数 (Callback) 处理异步**
将一个函数作为参数传递给另一个函数，在异步操作完成后调用它。

```javascript
// 模拟一个需要时间的异步操作（例如，从服务器获取数据）
function fetchData(callback) {
  console.log("开始获取数据...");
  // 使用 setTimeout 模拟网络延迟
  setTimeout(function() {
    const data = { name: "服务器数据", value: 123 };
    console.log("数据获取成功！");
    // 数据准备好后，调用回调函数并传入数据
    callback(data);
  }, 2000);
}

// 定义一个回调函数来处理获取到的数据
function processData(data) {
  console.log("正在处理数据:", data);
}

// 调用 fetchData，并将 processData 作为回调函数传入
fetchData(processData);
```

#### **49. Promise 基础**
Promise 是一个表示异步操作最终完成或失败的对象。

```javascript
// 创建一个 Promise 对象
const myPromise = new Promise((resolve, reject) => {
  // 模拟一个异步操作
  let operationSuccessful = true; // 切换这个值来看不同结果
  console.log("Promise 开始执行...");

  setTimeout(() => {
    if (operationSuccessful) {
      // 如果操作成功，调用 resolve 并传递结果
      resolve("操作成功！这是结果数据。");
    } else {
      // 如果操作失败，调用 reject 并传递错误信息
      reject("操作失败！出了点问题。");
    }
  }, 2000);
});

// 使用 .then() 处理成功的情况
// 使用 .catch() 处理失败的情况
myPromise
  .then((successMessage) => {
    // successMessage 是从 resolve 传递过来的值
    console.log("Promise 成功:", successMessage);
  })
  .catch((errorMessage) => {
    // errorMessage 是从 reject 传递过来的值
    console.error("Promise 失败:", errorMessage);
  });
```

#### **50. `async/await` - 更优雅的异步编程**
`async/await` 是建立在 Promise 之上的语法糖，让异步代码看起来更像同步代码。

```javascript
// 这是一个返回 Promise 的函数，模拟从 API 获取用户信息
function fetchUser() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: 1, username: "AsyncUser" });
    }, 2000);
  });
}

// 必须在 async 函数内部使用 await
async function displayUser() {
  try {
    console.log("开始获取用户...");
    // await 会暂停函数的执行，直到 Promise 完成
    // 并返回 Promise 的结果
    const user = await fetchUser();
    
    // 这行代码会在 fetchUser 完成后执行
    console.log(`用户名: ${user.username}`);
  } catch (error) {
    // 如果 Promise 被 reject，错误会被 catch 捕获
    console.error("获取用户失败:", error);
  }
}

// 调用 async 函数
displayUser();
console.log("displayUser 函数已调用，但会等待 await 完成。");
```