// TypeScript核心特性示例集合
// 这个文件包含20个TypeScript的核心特性示例，从基础到高级，循序渐进

// ==================================================
// 1. 基础类型 (Basic Types)
// TypeScript提供了JavaScript的所有基本类型，并添加了类型注解
// ==================================================
console.log("=== 1. 基础类型示例 ===");

// 数字类型 (number) - 包括整数、浮点数和ES6新增的二进制/八进制表示
let age: number = 25;
let height: number = 1.75;
let binaryNumber: number = 0b1010; // 二进制
let octalNumber: number = 0o744;   // 八进制
console.log("数字类型示例:", age, height, binaryNumber, octalNumber);

// 字符串类型 (string) - 可以使用单引号、双引号或反引号
let userName: string = "Alice";
let greeting: string = `Hello, my name is ${userName}`; // 模板字符串
console.log("字符串类型示例:", userName, greeting);

// 布尔类型 (boolean) - 只有true和false两个值
let isStudent: boolean = true;
let hasGraduated: boolean = false;
console.log("布尔类型示例:", isStudent, hasGraduated);

// 空类型 (void) - 表示没有任何返回值的函数
function logMessage(message: string): void {
    console.log("日志信息:", message);
    // 没有return语句，或者return undefined
}
logMessage("这是一个void类型函数的示例");

// Null和Undefined类型
let emptyValue: null = null;
let undefinedValue: undefined = undefined;
console.log("Null和Undefined示例:", emptyValue, undefinedValue);


// ==================================================
// 2. 数组类型 (Array Types)
// TypeScript提供了两种方式来定义数组
// ==================================================
console.log("\n=== 2. 数组类型示例 ===");

// 方式1: 类型后面跟[]
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// 方式2: 使用泛型 Array<类型>
let booleans: Array<boolean> = [true, false, true];

console.log("数字数组:", numbers);
console.log("字符串数组:", names);
console.log("布尔数组:", booleans);

// 数组操作示例
numbers.push(6); // 正确，添加number类型元素
// numbers.push("7"); // 错误，不能添加string类型元素到number数组
console.log("添加元素后的数字数组:", numbers);


// ==================================================
// 3. 元组类型 (Tuple Types)
// 元组允许表示一个已知元素数量和类型的数组，各元素的类型不必相同
// ==================================================
console.log("\n=== 3. 元组类型示例 ===");

// 定义一个元组类型，第一个元素是string，第二个是number，第三个是boolean
let person: [string, number, boolean] = ["Alice", 30, true];
console.log("元组示例:", person);

// 访问元组元素
console.log("元组第一个元素:", person[0]); // string类型
console.log("元组第二个元素:", person[1]); // number类型

// 元组赋值
person[0] = "Bob";
person[1] = 35;
console.log("修改后的元组:", person);

// 元组越界元素 - 会被赋予联合类型 (string | number | boolean)
person.push("extra"); // 允许，因为string是联合类型的一部分
person.push(100);    // 允许，number是联合类型的一部分
// person.push({});    // 错误，对象不是联合类型的一部分
console.log("添加越界元素后的元组:", person);


// ==================================================
// 4. 枚举类型 (Enum Types)
// 枚举用于定义数值集合，使代码更易读和维护
// ==================================================
console.log("\n=== 4. 枚举类型示例 ===");

// 数字枚举 - 默认从0开始编号
enum Direction {
    Up,    // 0
    Down,  // 1
    Left,  // 2
    Right  // 3
}
console.log("Direction.Up =", Direction.Up);
console.log("Direction.Right =", Direction.Right);

// 手动设置枚举值
enum StatusCode {
    Success = 200,
    NotFound = 404,
    Error = 500
}
console.log("成功状态码:", StatusCode.Success);
console.log("未找到状态码:", StatusCode.NotFound);

// 字符串枚举
enum MessageType {
    Info = "INFO",
    Warning = "WARNING",
    Error = "ERROR"
}
console.log("错误消息类型:", MessageType.Error);

// 使用枚举
function handleResponse(code: StatusCode) {
    if (code === StatusCode.Success) {
        console.log("请求成功");
    } else if (code === StatusCode.NotFound) {
        console.log("资源未找到");
    }
}
handleResponse(StatusCode.Success);


// ==================================================
// 5. 任意类型 (Any Type)
// any类型允许赋值为任意类型，会关闭类型检查
// ==================================================
console.log("\n=== 5. 任意类型示例 ===");

// 声明any类型变量
let dynamicValue: any = "Hello";
console.log("any类型初始值:", dynamicValue, "类型:", typeof dynamicValue);

// 可以随意改变类型
dynamicValue = 42;
console.log("改为数字:", dynamicValue, "类型:", typeof dynamicValue);

dynamicValue = true;
console.log("改为布尔值:", dynamicValue, "类型:", typeof dynamicValue);

dynamicValue = { name: "Test" };
console.log("改为对象:", dynamicValue, "类型:", typeof dynamicValue);

// any类型的数组
let mixedArray: any[] = [1, "two", true, { key: "value" }];
console.log("any类型数组:", mixedArray);

// 使用提示: 谨慎使用any类型，它会失去TypeScript类型检查的优势
// 当不确定类型时，考虑使用unknown类型替代


// ==================================================
// 6. 未知类型 (Unknown Type)
// unknown类型与any类似，但更安全，在使用前需要进行类型检查
// ==================================================
console.log("\n=== 6. 未知类型示例 ===");

let unknownValue: unknown = "Hello, unknown";
console.log("unknown类型初始值:", unknownValue);

// unknown类型可以被赋值给any类型
let anyValue: any = unknownValue;

// unknown类型不能直接赋值给其他类型，需要类型检查
// let strValue: string = unknownValue; // 错误，不能直接赋值

// 正确用法: 先进行类型检查
if (typeof unknownValue === "string") {
    let strValue: string = unknownValue; // 现在可以安全赋值
    console.log("经过类型检查后赋值:", strValue);
}

// 函数参数使用unknown类型
function processUnknownInput(input: unknown) {
    if (typeof input === "string") {
        console.log("处理字符串:", input.toUpperCase());
    } else if (typeof input === "number") {
        console.log("处理数字:", input * 2);
    } else {
        console.log("无法处理的类型");
    }
}

processUnknownInput("test");
processUnknownInput(10);
processUnknownInput(true);


// ==================================================
// 7. 函数类型 (Function Types)
// TypeScript可以为函数参数和返回值指定类型
// ==================================================
console.log("\n=== 7. 函数类型示例 ===");

// 完整的函数类型注解
function add(a: number, b: number): number {
    return a + b;
}
console.log("3 + 5 =", add(3, 5));

// 无返回值的函数
function log(message: string): void {
    console.log("日志:", message);
}
log("这是一个日志消息");

// 函数表达式
const multiply: (x: number, y: number) => number = function (x, y) {
    return x * y;
};
console.log("4 * 6 =", multiply(4, 6));

// 箭头函数
const divide = (x: number, y: number): number => {
    if (y === 0) throw new Error("除数不能为0");
    return x / y;
};
console.log("10 / 2 =", divide(10, 2));


// ==================================================
// 8. 可选参数和默认参数 (Optional and Default Parameters)
// TypeScript允许函数参数是可选的，或指定默认值
// ==================================================
console.log("\n=== 8. 可选参数和默认参数示例 ===");

// 可选参数 - 使用?标记，必须放在必选参数后面
function greet(name: string, title?: string): string {
    if (title) {
        return `Hello, ${title} ${name}!`;
    } else {
        return `Hello, ${name}!`;
    }
}
console.log(greet("Smith"));          // 不提供可选参数
console.log(greet("Smith", "Mr."));   // 提供可选参数

// 默认参数 - 当参数未被提供时使用默认值
function calculateTotal(price: number, taxRate: number = 0.08): number {
    return price * (1 + taxRate);
}
console.log("总价(使用默认税率):", calculateTotal(100));    // 使用默认值
console.log("总价(自定义税率):", calculateTotal(100, 0.1)); // 提供自定义值

// 可选参数和默认参数结合
function createUser(name: string, age?: number, role: string = "user"): { name: string, age?: number, role: string } {
    return { name, age, role };
}
console.log("用户1:", createUser("Alice"));
console.log("用户2:", createUser("Bob", 30));
console.log("用户3:", createUser("Charlie", 35, "admin"));


// ==================================================
// 9. 剩余参数 (Rest Parameters)
// 剩余参数允许函数接受任意数量的参数，并将它们放入一个数组中
// ==================================================
console.log("\n=== 9. 剩余参数示例 ===");

// 剩余参数语法: ...参数名: 类型[]
function sumNumbers(first: number, ...rest: number[]): number {
    let total = first;
    for (const num of rest) {
        total += num;
    }
    return total;
}
console.log("sumNumbers(1, 2, 3) =", sumNumbers(1, 2, 3));
console.log("sumNumbers(10, 20, 30, 40) =", sumNumbers(10, 20, 30, 40));

// 剩余参数在函数类型中的表示
type StringJoiner = (separator: string, ...parts: string[]) => string;

const joinStrings: StringJoiner = (separator, ...parts) => {
    return parts.join(separator);
};
console.log("joinStrings('-', 'a', 'b', 'c') =", joinStrings('-', 'a', 'b', 'c'));
console.log("joinStrings(' ', 'Hello', 'world') =", joinStrings(' ', 'Hello', 'world'));


// ==================================================
// 10. 联合类型 (Union Types)
// 联合类型表示一个值可以是几种类型之一，使用|分隔
// ==================================================
console.log("\n=== 10. 联合类型示例 ===");

// 基本联合类型
let id: string | number;
id = "123";    // 有效
console.log("字符串ID:", id);
id = 456;      // 有效
console.log("数字ID:", id);
// id = true;   // 错误，布尔值不在联合类型中

// 函数参数使用联合类型
function printId(id: string | number) {
    console.log("ID:", id);

    // 对联合类型进行类型检查（类型收窄）
    if (typeof id === "string") {
        console.log("字符串ID长度:", id.length);
    } else {
        console.log("数字ID加倍:", id * 2);
    }
}
printId("abc123");
printId(789);

// 数组中的联合类型
let mixedValues: (string | number | boolean)[] = ["hello", 42, true, "world", 99];
console.log("联合类型数组:", mixedValues);


// ==================================================
// 11. 类型别名 (Type Aliases)
// 类型别名为类型创建新名称，有助于简化复杂类型
// ==================================================
console.log("\n=== 11. 类型别名示例 ===");

// 基本类型别名
type UserID = string | number;
let userId1: UserID = "user-123";
let userId2: UserID = 456;
console.log("用户ID示例:", userId1, userId2);

// 对象类型别名
type User = {
    id: UserID;
    name: string;
    email: string;
    age?: number; // 可选属性
};

// 使用类型别名定义变量
const user1: User = {
    id: "user-789",
    name: "Alice",
    email: "alice@example.com"
};

const user2: User = {
    id: 1001,
    name: "Bob",
    email: "bob@example.com",
    age: 30
};
console.log("用户对象1:", user1);
console.log("用户对象2:", user2);

// 函数类型别名
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (a, b) => a - b;
const power: MathOperation = (a, b) => Math.pow(a, b);
console.log("5 - 3 =", subtract(5, 3));
console.log("2^3 =", power(2, 3));


// ==================================================
// 12. 接口 (Interfaces)
// 接口用于定义对象的结构，指定对象必须包含的属性和方法
// ==================================================
console.log("\n=== 12. 接口示例 ===");

// 基本接口定义
interface Person {
    name: string;
    age: number;
    gender?: string; // 可选属性
    readonly id: string; // 只读属性
}

// 使用接口
const person1: Person = {
    id: "p1",
    name: "Alice",
    age: 28
};

const person2: Person = {
    id: "p2",
    name: "Bob",
    age: 32,
    gender: "male"
};
console.log("Person 1:", person1);
console.log("Person 2:", person2);

// 尝试修改只读属性会报错
// person1.id = "new-id"; // 错误，id是只读的

// 接口描述函数类型
interface GreetFunction {
    (name: string): string;
}

const greetPerson: GreetFunction = (name) => {
    return `Hello, ${name}!`;
};
console.log(greetPerson("Charlie"));

// 接口继承
interface Employee extends Person {
    employeeId: number;
    department: string;
}

const employee: Employee = {
    id: "e1",
    name: "David",
    age: 35,
    employeeId: 1001,
    department: "Engineering"
};
console.log("Employee:", employee);


// ==================================================
// 13. 类 (Classes)
// TypeScript增强了JavaScript类，添加了类型注解、访问修饰符等
// ==================================================
console.log("\n=== 13. 类示例 ===");

// 基本类定义
class Animal {
    // 属性类型注解
    name: string;
    age: number;

    // 构造函数
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    // 方法
    makeSound(): void {
        console.log(`${this.name} makes a sound`);
    }

    // 方法带返回值
    getDescription(): string {
        return `${this.name} is ${this.age} years old`;
    }
}

// 创建类实例
const dog = new Animal("Buddy", 3);
console.log("Animal实例:", dog);
dog.makeSound();
console.log(dog.getDescription());

// 继承
class Dog extends Animal {
    breed: string;

    constructor(name: string, age: number, breed: string) {
        super(name, age); // 调用父类构造函数
        this.breed = breed;
    }

    // 重写父类方法
    makeSound(): void {
        console.log(`${this.name} barks: Woof! Woof!`);
    }

    // 子类特有方法
    fetch(): void {
        console.log(`${this.name} fetches the ball`);
    }
}

const labrador = new Dog("Max", 2, "Labrador");
console.log("Dog实例:", labrador);
labrador.makeSound();
labrador.fetch();


// ==================================================
// 14. 访问修饰符 (Access Modifiers)
// TypeScript提供了public、private和protected三种访问修饰符
// ==================================================
console.log("\n=== 14. 访问修饰符示例 ===");

class Car {
    // public: 公开的，默认修饰符，任何地方都可访问
    public brand: string;

    // private: 私有的，只能在类内部访问
    private mileage: number;

    // protected: 受保护的，只能在类内部和子类中访问
    protected color: string;

    constructor(brand: string, color: string) {
        this.brand = brand;
        this.color = color;
        this.mileage = 0;
    }

    // 公共方法可以访问私有和受保护的属性
    drive(distance: number): void {
        this.mileage += distance;
        console.log(`${this.brand} drove ${distance} km`);
    }

    // 获取私有属性的方法
    getMileage(): number {
        return this.mileage;
    }
}

const myCar = new Car("Toyota", "red");
console.log("Car品牌:", myCar.brand); // 可以访问public属性
myCar.drive(100);
console.log("Car里程:", myCar.getMileage());
// console.log(myCar.mileage); // 错误，不能访问private属性

// 子类可以访问protected属性
class ElectricCar extends Car {
    batteryLevel: number;

    constructor(brand: string, color: string) {
        super(brand, color);
        this.batteryLevel = 100;
    }

    getDetails(): string {
        // 可以访问protected属性
        return `${this.brand} (${this.color}) - Battery: ${this.batteryLevel}%`;
    }
}

const tesla = new ElectricCar("Tesla", "white");
console.log(tesla.getDetails());


// ==================================================
// 15. 泛型 (Generics)
// 泛型允许创建可重用的组件，能够支持多种类型而不丢失类型信息
// ==================================================
console.log("\n=== 15. 泛型示例 ===");

// 泛型函数
function identity<T>(arg: T): T {
    return arg;
}

// 使用泛型函数，TypeScript会自动推断类型
const stringResult = identity("Hello, Generics!");
const numberResult = identity(42);
const booleanResult = identity(true);
console.log("泛型函数结果:", stringResult, numberResult, booleanResult);

// 显式指定泛型类型
const arrayResult = identity<number[]>([1, 2, 3]);
console.log("显式指定类型:", arrayResult);

// 泛型数组函数
function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}
console.log("数组第一个元素(数字):", getFirstElement([10, 20, 30]));
console.log("数组第一个元素(字符串):", getFirstElement(["a", "b", "c"]));

// 多个类型参数的泛型函数
function pairValues<T, U>(first: T, second: U): [T, U] {
    return [first, second];
}
const pair1 = pairValues("age", 30);
const pair2 = pairValues(100, true);
console.log("成对的值:", pair1, pair2);


// ==================================================
// 16. 泛型接口和类 (Generic Interfaces and Classes)
// 泛型可以应用于接口和类，使它们能够处理多种类型
// ==================================================
console.log("\n=== 16. 泛型接口和类示例 ===");

// 泛型接口
interface Box<T> {
    content: T;
    getContent: () => T;
    setContent: (newContent: T) => void;
}

// 实现泛型接口
const stringBox: Box<string> = {
    content: "Hello",
    getContent: function () {
        return this.content;
    },
    setContent: function (newContent) {
        this.content = newContent;
    }
};
console.log("字符串盒子内容:", stringBox.getContent());
stringBox.setContent("World");
console.log("更新后字符串盒子内容:", stringBox.getContent());

// 泛型类
class Container<T> {
    private items: T[] = [];

    addItem(item: T): void {
        this.items.push(item);
    }

    getItem(index: number): T | undefined {
        return this.items[index];
    }

    getAllItems(): T[] {
        return this.items;
    }
}

// 使用泛型类存储数字
const numberContainer = new Container<number>();
numberContainer.addItem(10);
numberContainer.addItem(20);
console.log("数字容器内容:", numberContainer.getAllItems());

// 使用泛型类存储对象
interface Product {
    id: number;
    name: string;
}
const productContainer = new Container<Product>();
productContainer.addItem({ id: 1, name: "Laptop" });
productContainer.addItem({ id: 2, name: "Phone" });
console.log("产品容器内容:", productContainer.getAllItems());


// ==================================================
// 17. 类型断言 (Type Assertions)
// 类型断言允许开发者告诉编译器"我知道这个变量的类型是什么"
// ==================================================
console.log("\n=== 17. 类型断言示例 ===");

// 基本类型断言
let someValue: unknown = "this is a string";

// 方式1: 使用as语法
let strLength1: number = (someValue as string).length;

// 方式2: 使用尖括号语法
let strLength2: number = (<string>someValue).length;
console.log("字符串长度:", strLength1, strLength2);

// 对DOM元素使用类型断言
// 在实际环境中，这会操作真实DOM，这里仅作示例
type MockElement = {
    id: string;
    innerHTML: string;
    value?: string;
};

// 模拟document.getElementById
const mockGetElementById = (id: string): MockElement | null => {
    return { id, innerHTML: "" };
};

// 获取元素并断言类型
const inputElement = mockGetElementById("username") as {
    id: string;
    innerHTML: string;
    value: string
};
inputElement.value = "John Doe";
console.log("输入框值:", inputElement.value);

// 非空断言 - 使用!表示变量不会为null或undefined
function getElementText(element: HTMLElement | null): string {
    // 断言element不会为null
    return element!.innerHTML;
}


// ==================================================
// 18. 类型守卫 (Type Guards)
// 类型守卫用于在运行时检查类型，帮助TypeScript在编译时进行类型推断
// ==================================================
console.log("\n=== 18. 类型守卫示例 ===");

// 定义两种不同的接口
interface Cat {
    type: "cat";
    meow: () => void;
}

interface Dog {
    type: "dog";
    bark: () => void;
}

type Pet = Cat | Dog;

// 使用typeof进行类型守卫
function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

function processValue(value: unknown) {
    if (isNumber(value)) {
        // TypeScript现在知道value是number类型
        console.log("处理数字:", value * 2);
    } else if (typeof value === "string") {
        // TypeScript知道value是string类型
        console.log("处理字符串:", value.toUpperCase());
    } else {
        console.log("未知类型");
    }
}
processValue(42);
processValue("hello");
processValue(true);

// 使用instanceof进行类型守卫
class Bird {
    fly() {
        console.log("Bird is flying");
    }
}

class Fish {
    swim() {
        console.log("Fish is swimming");
    }
}

function moveAnimal(animal: Bird | Fish) {
    if (animal instanceof Bird) {
        animal.fly(); // 正确，TypeScript知道是Bird类型
    } else {
        animal.swim(); // 正确，TypeScript知道是Fish类型
    }
}
moveAnimal(new Bird());
moveAnimal(new Fish());

// 使用自定义类型守卫区分联合类型
function isCat(pet: Pet): pet is Cat {
    return pet.type === "cat";
}

function makePetSound(pet: Pet) {
    if (isCat(pet)) {
        pet.meow(); // TypeScript知道是Cat类型
    } else {
        pet.bark(); // TypeScript知道是Dog类型
    }
}

const myCat: Cat = {
    type: "cat",
    meow: () => console.log("Meow!")
};
const myDog: Dog = {
    type: "dog",
    bark: () => console.log("Woof!")
};

makePetSound(myCat);
makePetSound(myDog);


// ==================================================
// 19. 高级类型 (Advanced Types)
// TypeScript提供了一些高级类型工具，用于处理复杂的类型转换
// ==================================================
console.log("\n=== 19. 高级类型示例 ===");

interface Book {
    id: number;
    title: string;
    author: string;
    published: boolean;
}

// Partial<T> - 将T的所有属性变为可选
type PartialBook = Partial<Book>;

// 可以只提供部分属性
const bookDraft: PartialBook = {
    title: "TypeScript Guide",
    author: "John Smith"
};
console.log("Partial Book:", bookDraft);

// Readonly<T> - 将T的所有属性变为只读
type ReadonlyBook = Readonly<Book>;

const publishedBook: ReadonlyBook = {
    id: 1,
    title: "TypeScript Guide",
    author: "John Smith",
    published: true
};
console.log("Readonly Book:", publishedBook);
// publishedBook.title = "New Title"; // 错误，属性是只读的

// Pick<T, K> - 从T中选取一组属性K
type BookInfo = Pick<Book, "title" | "author">;
const bookInfo: BookInfo = {
    title: "TypeScript Guide",
    author: "John Smith"
};
console.log("Picked Book Info:", bookInfo);

// Omit<T, K> - 从T中排除一组属性K
type BookStatus = Omit<Book, "title" | "author">;
const bookStatus: BookStatus = {
    id: 1,
    published: true
};
console.log("Omitted Book Status:", bookStatus);

// Record<K, T> - 定义一个对象类型，键为K类型，值为T类型
type Dictionary<T> = Record<string, T>;
const numberDict: Dictionary<number> = {
    "one": 1,
    "two": 2,
    "three": 3
};
console.log("Number Dictionary:", numberDict);


// ==================================================
// 20. 异步操作与Promise
// TypeScript提供了对Promise和async/await的类型支持
// ==================================================
console.log("\n=== 20. 异步操作与Promise示例 ===");

// 定义数据类型
type UserData = {
    id: number;
    name: string;
    email: string;
};

// 模拟API调用，返回Promise
function fetchUser(userId: number): Promise<UserData> {
    return new Promise((resolve, reject) => {
        // 模拟网络延迟
        setTimeout(() => {
            if (userId > 0) {
                // 成功时返回用户数据
                resolve({
                    id: userId,
                    name: `User ${userId}`,
                    email: `user${userId}@example.com`
                });
            } else {
                // 失败时返回错误
                reject(new Error("Invalid user ID"));
            }
        }, 1000); // 1秒延迟
    });
}

// 使用.then()和.catch()处理Promise
console.log("使用.then()获取用户数据...");
fetchUser(1)
    .then(user => console.log("获取到的用户数据:", user))
    .catch(error => console.error("获取用户数据失败:", error.message));

// 使用async/await处理Promise（更简洁的语法）
async function getUserData(userId: number): Promise<void> {
    try {
        console.log(`使用async/await获取用户${userId}的数据...`);
        const user = await fetchUser(userId); // 等待Promise完成
        console.log("获取到的用户数据:", user);
    } catch (error) {
        // 处理错误
        if (error instanceof Error) {
            console.error("获取用户数据失败:", error.message);
        }
    }
}

// 调用异步函数
getUserData(2);
getUserData(-1); // 会触发错误

// 注意: 实际运行时，这些异步操作会在1秒后输出结果
