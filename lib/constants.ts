export type CodeTemplate = {
  name: string;
  code: string;
  stdin: string;
};

export const DEFAULT_TEMPLATE = "hello-world";

export const CODE_TEMPLATES: Record<string, Record<string, CodeTemplate>> = {
  javascript: {
    "hello-world": { name: "Hello World", code: `console.log("Hello, World!");`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `const limit = 100;
let count = 0;

for (let n = 2; n <= limit; n++) {
  let prime = true;
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (n % divisor === 0) prime = false;
  }
  if (prime) count++;
}

console.log(count);`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `const count = 10;
let a = 0;
let b = 1;
const values = [];

for (let i = 0; i < count; i++) {
  values.push(a);
  [a, b] = [b, a + b];
}

console.log(values.join(" "));`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `for (let n = 1; n <= 30; n++) {
  if (n % 15 === 0) console.log("FizzBuzz");
  else if (n % 3 === 0) console.log("Fizz");
  else if (n % 5 === 0) console.log("Buzz");
  else console.log(n);
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `const fs = require("fs");
const stdin = fs.readFileSync(0, "utf-8");
console.log(stdin);`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `const fs = require("fs");
const stdin = fs.readFileSync(0, "utf-8");
const numbers = stdin.trim().split(/\\s+/).map(Number);
console.log(numbers.reduce((sum, number) => sum + number, 0));`, stdin: "10 20 30" },
  },
  typescript: {
    "hello-world": { name: "Hello World", code: `const greeting: string = "Hello, World!";
console.log(greeting);`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `const limit: number = 100;
let count: number = 0;

for (let n = 2; n <= limit; n++) {
  let prime: boolean = true;
  for (let divisor = 2; divisor * divisor <= n; divisor++) {
    if (n % divisor === 0) prime = false;
  }
  if (prime) count++;
}

console.log(\`Prime count up to \${limit}: \${count}\`);`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `const count: number = 10;
let a: number = 0;
let b: number = 1;
const values: number[] = [];

for (let i = 0; i < count; i++) {
  values.push(a);
  [a, b] = [b, a + b];
}

console.log(values.join(" "));`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `for (let n = 1; n <= 30; n++) {
  if (n % 15 === 0) console.log("FizzBuzz");
  else if (n % 3 === 0) console.log("Fizz");
  else if (n % 5 === 0) console.log("Buzz");
  else console.log(n);
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `import * as fs from "fs";
const stdin: string = fs.readFileSync(0, "utf-8");
console.log(stdin);`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `import * as fs from "fs";
const stdin: string = fs.readFileSync(0, "utf-8");
const numbers: number[] = stdin.trim().split(/\\s+/).map(Number);
console.log(numbers.reduce((sum: number, number: number) => sum + number, 0));`, stdin: "10 20 30" },
  },
  python: {
    "hello-world": { name: "Hello World", code: `print("Hello, World!")`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `limit = 100
count = 0

for number in range(2, limit + 1):
    prime = True
    divisor = 2
    while divisor * divisor <= number:
        if number % divisor == 0:
            prime = False
            break
        divisor += 1
    if prime:
        count += 1

print(count)`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `count = 10
a, b = 0, 1
values = []

for _ in range(count):
    values.append(a)
    a, b = b, a + b

print(*values)`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `for number in range(1, 31):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `import sys

print(sys.stdin.read(), end="")`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `import sys

numbers = map(int, sys.stdin.read().split())
print(sum(numbers))`, stdin: "10 20 30" },
  },
  c: {
    "hello-world": { name: "Hello World", code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    int limit = 100;
    int count = 0;

    for (int number = 2; number <= limit; number++) {
        bool prime = true;
        for (int divisor = 2; divisor * divisor <= number; divisor++) {
            if (number % divisor == 0) {
                prime = false;
                break;
            }
        }
        if (prime) count++;
    }

    printf("%d\\n", count);
    return 0;
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `#include <stdio.h>

int main() {
    int count = 10;
    long long a = 0, b = 1;

    for (int i = 0; i < count; i++) {
        printf("%lld%s", a, i + 1 == count ? "\\n" : " ");
        long long next = a + b;
        a = b;
        b = next;
    }
    return 0;
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `#include <stdio.h>

int main() {
    for (int number = 1; number <= 30; number++) {
        if (number % 15 == 0) printf("FizzBuzz\\n");
        else if (number % 3 == 0) printf("Fizz\\n");
        else if (number % 5 == 0) printf("Buzz\\n");
        else printf("%d\\n", number);
    }
    return 0;
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `#include <stdio.h>

int main() {
    char ch;
    while ((ch = getchar()) != EOF) {
        putchar(ch);
    }
    return 0;
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `#include <stdio.h>

int main() {
    long long number = 0, sum = 0;
    while (scanf("%lld", &number) == 1) {
        sum += number;
    }
    printf("%lld\\n", sum);
    return 0;
}`, stdin: "10 20 30" },
  },
  cpp: {
    "hello-world": { name: "Hello World", code: `#include <iostream>

int main() {
    std::cout << "Hello, World!\\n";
    return 0;
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `#include <iostream>

int main() {
    int limit = 100;
    int count = 0;

    for (int number = 2; number <= limit; number++) {
        bool prime = true;
        for (int divisor = 2; divisor * divisor <= number; divisor++) {
            if (number % divisor == 0) prime = false;
        }
        if (prime) count++;
    }

    std::cout << count << '\\n';
    return 0;
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `#include <iostream>

int main() {
    int count = 10;
    long long a = 0;
    long long b = 1;

    for (int i = 0; i < count; i++) {
        std::cout << a << (i + 1 == count ? "\\n" : " ");
        long long next = a + b;
        a = b;
        b = next;
    }
    return 0;
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `#include <iostream>

int main() {
    for (int number = 1; number <= 30; number++) {
        if (number % 15 == 0) std::cout << "FizzBuzz\\n";
        else if (number % 3 == 0) std::cout << "Fizz\\n";
        else if (number % 5 == 0) std::cout << "Buzz\\n";
        else std::cout << number << '\\n';
    }
    return 0;
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `#include <iostream>
#include <iterator>
#include <string>

int main() {
    std::string input((std::istreambuf_iterator<char>(std::cin)), std::istreambuf_iterator<char>());
    std::cout << input;
    return 0;
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `#include <iostream>

int main() {
    long long number = 0;
    long long sum = 0;
    while (std::cin >> number) sum += number;
    std::cout << sum << '\\n';
    return 0;
}`, stdin: "10 20 30" },
  },
  go: {
    "hello-world": { name: "Hello World", code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `package main

import "fmt"

func main() {
    limit := 100
    count := 0

    for number := 2; number <= limit; number++ {
        prime := true
        for divisor := 2; divisor*divisor <= number; divisor++ {
            if number%divisor == 0 {
                prime = false;
                break;
            }
        }
        if prime {
            count++
        }
    }

    fmt.Println(count)
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `package main

import "fmt"

func main() {
    count := 10
    a, b := 0, 1

    for i := 0; i < count; i++ {
        if i > 0 {
            fmt.Print(" ")
        }
        fmt.Print(a)
        a, b = b, a+b
    }
    fmt.Println()
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `package main

import "fmt"

func main() {
    for number := 1; number <= 30; number++ {
        if number%15 == 0 {
            fmt.Println("FizzBuzz")
        } else if number%3 == 0 {
            fmt.Println("Fizz")
        } else if number%5 == 0 {
            fmt.Println("Buzz")
        } else {
            fmt.Println(number)
        }
    }
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `package main

import (
    "io"
    "os"
)

func main() {
    io.Copy(os.Stdout, os.Stdin)
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `package main

import (
    "fmt"
    "io"
)

func main() {
    var number, sum int64
    for {
        _, err := fmt.Scan(&number)
        if err == io.EOF {
            break
        }
        sum += number
    }
    fmt.Println(sum)
}`, stdin: "10 20 30" },
  },
  rust: {
    "hello-world": { name: "Hello World", code: `fn main() {
    println!("Hello, World!");
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `fn main() {
    let limit = 100;
    let mut count = 0;

    for number in 2..=limit {
        let mut prime = true;
        let mut divisor = 2;
        while divisor * divisor <= number {
            if number % divisor == 0 {
                prime = false;
                break;
            }
            divisor += 1;
        }
        if prime {
            count += 1;
        }
    }

    println!("{}", count);
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `fn main() {
    let count = 10;
    let mut a: u64 = 0;
    let mut b: u64 = 1;

    for i in 0..count {
        print!("{}{}", a, if i + 1 == count { "\n" } else { " " });
        let next = a + b;
        a = b;
        b = next;
    }
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `fn main() {
    for number in 1..=30 {
        if number % 15 == 0 {
            println!("FizzBuzz");
        } else if number % 3 == 0 {
            println!("Fizz");
        } else if number % 5 == 0 {
            println!("Buzz");
        } else {
            println!("{}", number);
        }
    }
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `use std::io::{self, Read};

fn main() {
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer).unwrap();
    print!("{}", buffer);
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `use std::io::{self, Read};

fn main() {
    let mut buffer = String::new();
    io::stdin().read_to_string(&mut buffer).unwrap();
    let sum: i64 = buffer
        .split_whitespace()
        .filter_map(|s| s.parse::<i64>().ok())
        .sum();
    println!("{}", sum);
}`, stdin: "10 20 30" },
  },
  java: {
    "hello-world": { name: "Hello World", code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `public class Main {
    public static void main(String[] args) {
        int limit = 100;
        int count = 0;

        for (int number = 2; number <= limit; number++) {
            boolean prime = true;
            for (int divisor = 2; divisor * divisor <= number; divisor++) {
                if (number % divisor == 0) prime = false;
            }
            if (prime) count++;
        }

        System.out.println(count);
    }
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `public class Main {
    public static void main(String[] args) {
        int count = 10;
        long a = 0;
        long b = 1;

        for (int i = 0; i < count; i++) {
            System.out.print(a + (i + 1 == count ? "\\n" : " "));
            long next = a + b;
            a = b;
            b = next;
        }
    }
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `public class Main {
    public static void main(String[] args) {
        for (int number = 1; number <= 30; number++) {
            if (number % 15 == 0) System.out.println("FizzBuzz");
            else if (number % 3 == 0) System.out.println("Fizz");
            else if (number % 5 == 0) System.out.println("Buzz");
            else System.out.println(number);
        }
    }
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in).useDelimiter("\\A");
        System.out.print(scanner.hasNext() ? scanner.next() : "");
    }
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long sum = 0;
        while (scanner.hasNextLong()) sum += scanner.nextLong();
        System.out.println(sum);
    }
}`, stdin: "10 20 30" },
  },
  csharp: {
    "hello-world": { name: "Hello World", code: `using System;

public class Program {
    public static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `using System;

public class Program {
    public static void Main() {
        int limit = 100;
        int count = 0;

        for (int number = 2; number <= limit; number++) {
            bool prime = true;
            for (int divisor = 2; divisor * divisor <= number; divisor++) {
                if (number % divisor == 0) prime = false;
            }
            if (prime) count++;
        }

        Console.WriteLine(count);
    }
}`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `using System;
using System.Collections.Generic;

public class Program {
    public static void Main() {
        int count = 10;
        long a = 0;
        long b = 1;
        var values = new List<long>();

        for (int i = 0; i < count; i++) {
            values.Add(a);
            long next = a + b;
            a = b;
            b = next;
        }

        Console.WriteLine(string.Join(" ", values));
    }
}`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `using System;

public class Program {
    public static void Main() {
        for (int number = 1; number <= 30; number++) {
            if (number % 15 == 0) Console.WriteLine("FizzBuzz");
            else if (number % 3 == 0) Console.WriteLine("Fizz");
            else if (number % 5 == 0) Console.WriteLine("Buzz");
            else Console.WriteLine(number);
        }
    }
}`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `using System;

public class Program {
    public static void Main() {
        Console.Write(Console.In.ReadToEnd());
    }
}`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `using System;
using System.Linq;

public class Program {
    public static void Main() {
        long sum = Console.In.ReadToEnd()
            .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
            .Select(long.Parse)
            .Sum();
        Console.WriteLine(sum);
    }
}`, stdin: "10 20 30" },
  },
  html: {
    "hello-world": { name: "Hello World", code: `<h1>Hello, World!</h1>`, stdin: "" },
    "count-primes": { name: "Count Primes", code: `<pre id="output"></pre>
<script>
let count = 0;
for (let n = 2; n <= 100; n++) {
  let prime = true;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) prime = false;
  if (prime) count++;
}
document.querySelector("#output").textContent = count;
</script>`, stdin: "" },
    fibonacci: { name: "Fibonacci", code: `<pre id="output"></pre>
<script>
let a = 0, b = 1;
const values = [];
for (let i = 0; i < 10; i++) {
  values.push(a);
  [a, b] = [b, a + b];
}
document.querySelector("#output").textContent = values.join(" ");
</script>`, stdin: "" },
    fizzbuzz: { name: "FizzBuzz", code: `<pre id="output"></pre>
<script>
const values = [];
for (let n = 1; n <= 30; n++) {
  values.push(n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : n);
}
document.querySelector("#output").textContent = values.join("\\n");
</script>`, stdin: "" },
    "echo-stdin": { name: "Echo stdin", code: `<pre id="output"></pre>
<script>
document.querySelector("#output").textContent = window.STDIN;
</script>`, stdin: "Hello from stdin" },
    "sum-stdin": { name: "Sum stdin", code: `<pre id="output"></pre>
<script>
const sum = window.STDIN.trim().split(/\\s+/).map(Number).reduce((total, number) => total + number, 0);
document.querySelector("#output").textContent = sum;
</script>`, stdin: "10 20 30" },
  },
};

export const CODE_SNIPPETS: Record<string, string> = Object.fromEntries(
  Object.entries(CODE_TEMPLATES).map(([language, templates]) => [language, templates[DEFAULT_TEMPLATE].code])
);

export const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "rustbox",
  typescript: "rustbox",
  python: "rustbox",
  c: "rustbox",
  cpp: "rustbox",
  go: "rustbox",
  rust: "rustbox",
  java: "rustbox",
  csharp: "rustbox",
  html: "preview",
};

export const STUDY_CASE_TEMPLATES: Record<number, Record<string, { code: string; stdin: string; instruction: string }>> = {
  0: {
    javascript: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
const a = 12;
const b = 8;
const result = a * 2 + b;

console.log("Calculated Result:", result);`,
    },
    typescript: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
const a: number = 12;
const b: number = 8;
const result: number = a * 2 + b;

console.log("Calculated Result:", result);`,
    },
    python: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `# CH 01: Predict & Verify
# STEP 1: Predict what 'result' will be out loud BEFORE running.
a = 12
b = 8
result = a * 2 + b

print("Calculated Result:", result)`,
    },
    c: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
#include <stdio.h>

int main() {
    int a = 12;
    int b = 8;
    int result = a * 2 + b;
    printf("Calculated Result: %d\\n", result);
    return 0;
}`,
    },
    cpp: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
#include <iostream>

int main() {
    int a = 12;
    int b = 8;
    int result = a * 2 + b;
    std::cout << "Calculated Result: " << result << std::endl;
    return 0;
}`,
    },
    go: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
package main

import "fmt"

func main() {
    a := 12
    b := 8
    result := a*2 + b
    fmt.Println("Calculated Result:", result)
}`,
    },
    rust: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
fn main() {
    let a = 12;
    let b = 8;
    let result = a * 2 + b;
    println!("Calculated Result: {}", result);
}`,
    },
    java: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
public class Main {
    public static void main(String[] args) {
        int a = 12;
        int b = 8;
        int result = a * 2 + b;
        System.out.println("Calculated Result: " + result);
    }
}`,
    },
    csharp: {
      instruction: "Predict the calculated result in your head before pressing Run Code!",
      stdin: "",
      code: `// CH 01: Predict & Verify
// STEP 1: Predict what 'result' will be out loud BEFORE running.
using System;

public class Program {
    public static void Main() {
        int a = 12;
        int b = 8;
        int result = a * 2 + b;
        Console.WriteLine("Calculated Result: " + result);
    }
}`,
    },
    html: {
      instruction: "Predict the DOM output before pressing Run Code!",
      stdin: "",
      code: `<!-- CH 01: Predict & Verify -->
<h2 id="heading">Predicting DOM output...</h2>
<script>
  const a = 12, b = 8;
  document.getElementById("heading").textContent = "Calculated Result: " + (a * 2 + b);
</script>`,
    },
  },
  1: {
    javascript: {
      instruction: "Replace 'Student' with your own name in line 3!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
const name = "Student";
const favoriteLanguage = "JavaScript";

console.log(\`Hello, my name is \${name} and I am mastering \${favoriteLanguage}!\`);`,
    },
    typescript: {
      instruction: "Replace 'Student' with your own name in line 3!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
const name: string = "Student";
const favoriteLanguage: string = "TypeScript";

console.log(\`Hello, my name is \${name} and I am mastering \${favoriteLanguage}!\`);`,
    },
    python: {
      instruction: "Replace 'Student' with your own name in line 3!",
      stdin: "",
      code: `# CH 02: Personalize Output
# STEP 1: Replace 'Student' with your name!
name = "Student"
favorite_language = "Python"

print(f"Hello, my name is {name} and I am mastering {favorite_language}!")`,
    },
    c: {
      instruction: "Replace 'Student' with your own name in line 6!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
#include <stdio.h>

int main() {
    char name[] = "Student";
    char language[] = "C";
    printf("Hello, my name is %s and I am mastering %s!\\n", name, language);
    return 0;
}`,
    },
    cpp: {
      instruction: "Replace 'Student' with your own name in line 7!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
#include <iostream>
#include <string>

int main() {
    std::string name = "Student";
    std::string language = "C++";
    std::cout << "Hello, my name is " << name << " and I am mastering " << language << "!" << std::endl;
    return 0;
}`,
    },
    go: {
      instruction: "Replace 'Student' with your own name in line 8!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
package main

import "fmt"

func main() {
    name := "Student"
    language := "Go"
    fmt.Printf("Hello, my name is %s and I am mastering %s!\\n", name, language)
}`,
    },
    rust: {
      instruction: "Replace 'Student' with your own name in line 4!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
fn main() {
    let name = "Student";
    let language = "Rust";
    println!("Hello, my name is {} and I am mastering {}!", name, language);
}`,
    },
    java: {
      instruction: "Replace 'Student' with your own name in line 5!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
public class Main {
    public static void main(String[] args) {
        String name = "Student";
        String language = "Java";
        System.out.println("Hello, my name is " + name + " and I am mastering " + language + "!");
    }
}`,
    },
    csharp: {
      instruction: "Replace 'Student' with your own name in line 6!",
      stdin: "",
      code: `// CH 02: Personalize Output
// STEP 1: Replace 'Student' with your name!
using System;

public class Program {
    public static void Main() {
        string name = "Student";
        string language = "C#";
        Console.WriteLine($"Hello, my name is {name} and I am mastering {language}!");
    }
}`,
    },
    html: {
      instruction: "Replace 'Student' with your name inside span!",
      stdin: "",
      code: `<!-- CH 02: Personalize Output -->
<h1 style="color: #10b981;">Hello, my name is <span id="student-name">Student</span>!</h1>
<p>I am building interactive web applications.</p>`,
    },
  },
  2: {
    javascript: {
      instruction: "Run code, inspect terminal STDERR error message, and fix the method typo!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see the error.
// STEP 2: Fix the typo in line 5 (.toUPPERCase is wrong!).
const message = "debugging is fun!";
console.log(message.toUPPERCase());`,
    },
    typescript: {
      instruction: "Run code, inspect terminal STDERR error message, and fix the method typo!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see the error.
// STEP 2: Fix the typo in line 5 (.toUPPERCase is wrong!).
const message: string = "debugging is fun!";
console.log(message.toUPPERCase());`,
    },
    python: {
      instruction: "Run code, inspect terminal STDERR error message, and fix the method typo!",
      stdin: "",
      code: `# CH 03: Diagnose Faults
# STEP 1: Run Code to see the error.
# STEP 2: Fix the typo in line 5 (.toUPPERcase is wrong, use .upper()).
message = "debugging is fun!"
print(message.toUPPERcase())`,
    },
    c: {
      instruction: "Run code, inspect compiler error, and fix the function name in line 7!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see compiler error.
// STEP 2: Fix the typo in line 7 (print -> printf).
#include <stdio.h>

int main() {
    int count = 42;
    print("Count is: %d\\n", count);
    return 0;
}`,
    },
    cpp: {
      instruction: "Run code, inspect compiler error, and fix std::endll typo in line 7!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see compiler error.
// STEP 2: Fix typo in line 7 (std::endll -> std::endl).
#include <iostream>

int main() {
    int count = 42;
    std::cout << "Count is: " << count << std::endll;
    return 0;
}`,
    },
    go: {
      instruction: "Run code, inspect compiler error, and fix missing closing parenthesis in line 8!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see syntax error.
// STEP 2: Add missing closing parenthesis in line 8.
package main

import "fmt"

func main() {
    count := 42
    fmt.Println("Count is:", count
}`,
    },
    rust: {
      instruction: "Run code, inspect compiler error, and fix missing closing parenthesis in line 5!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see syntax error.
// STEP 2: Add missing closing parenthesis in line 5.
fn main() {
    let count = 42;
    println!("Count is: {}", count
}`,
    },
    java: {
      instruction: "Run code, inspect compiler error, and fix printline typo in line 5!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see compiler error.
// STEP 2: Fix printline typo in line 5 (printline -> println).
public class Main {
    public static void main(String[] args) {
        int count = 42;
        System.out.printline("Count is: " + count);
    }
}`,
    },
    csharp: {
      instruction: "Run code, inspect compiler error, and fix WriteLines typo in line 6!",
      stdin: "",
      code: `// CH 03: Diagnose Faults
// STEP 1: Run Code to see compiler error.
// STEP 2: Fix WriteLines typo in line 6 (WriteLines -> WriteLine).
using System;

public class Program {
    public static void Main() {
        int count = 42;
        Console.WriteLines("Count is: " + count);
    }
}`,
    },
    html: {
      instruction: "Run code, open console or script, and fix getElementByID typo!",
      stdin: "",
      code: `<!-- CH 03: Diagnose Faults -->
<h1 id="box">Waiting for fix...</h1>
<script>
  // STEP 1: Fix typo in line 5 (getElementByID -> getElementById)
  document.getElementByID("box").textContent = "Error fixed successfully!";
</script>`,
    },
  },
};
