// Для начала определим переменные canvas и ctx, необходимые для рисования на «холсте», а также переменные width и height для хранения ширины и высоты элемента canvas.
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const width = canvas.width
const height = canvas.height
let animationTime = 100

const color = ['Lime', 'Crimson', 'OrangeRed', 'Gold', 'Yellow', 'Moccasin', 'MediumSpringGreen', 'LightCoral', 'Aqua', 'Aquamarine', 'MediumSlateBlue', 'Fuchsia', 'SaddleBrown', 'Indigo',]

// Находим кнопки для управления змейкой
const btnUp = document.querySelector('.button-up')
const btnLeft = document.querySelector('.button-left')
const btnDown = document.querySelector('.button-down')
const btnRight = document.querySelector('.button-right')

// Зададим размеры одной ячейки и запишем в переменные общие высоту и ширину
const blockSize = 10
const widthInBlock = width / blockSize
const heightInBlock = height / blockSize

// Начальное значение очков игрока
let score = 0

// Задаем border доске
function drawBorder() {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Функция, которая отображает на «холсте» строку с текущим счетом игры.
function drawScore() {
    // Изменяем позицию текста относительно опорной линии, шрифт и размер текса
    ctx.textAlign = "left"
    ctx.textBaseline = 'top'
    ctx.font = "20px Courier"
    // Отображение текущего счета
    ctx.fillText('Счет: ' + score, blockSize, blockSize)
    ctx.fillStyle = 'black'
}
// Конец игры
function gameOver() {
    playing = false;
    ctx.font = "60px Courier"
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Конец игры', width / 2, height / 2)
}
// Рисуем круг
function circle(x, y, radius, fillCircle) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2, false)
    if (fillCircle) {
        ctx.fill()
    } else ctx.stroke()
}
// Конструктор, который будет создвать объекты, представляющие собой отдельные ячейки невидимой сетки игрового поля. 
function Block(col, row) {
    this.col = col
    this.row = row
}
// Отрисовка квадратика и круга
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
};
// Проверка на совпадение координат ячеек разных объуктов
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row
}
// Создаем змейку
function Snake() {
    console.log()
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ]
    this.direction = "right";
    this.nextDirection = "right";
}
// рисуем ячейки змейки
Snake.prototype.draw = function () {
    this.segments[0].drawSquare("LimeGreen");
    let isEvenSegment = false;

    for (let i = 1; i < this.segments.length; i++) {
        if (isEvenSegment) {
            this.segments[i].drawSquare("LimeGreen");
        } else {
            this.segments[i].drawSquare("blue");
        }

        isEvenSegment = !isEvenSegment; // следующий сегмент будет нечетным
    }
}
// Перемещаем змейку
Snake.prototype.move = function () {
    let head = this.segments[0]
    let newHead

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
        animationTime -= 5;
    } else {
        this.segments.pop();
    }
};
Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthInBlock - 1);
    let bottomCollision = (head.row === heightInBlock - 1);
    let wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }
    return wallCollision || selfCollision;
};
// Задаем следующее направление движения змейки на основе
// нажатой клавиши
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};

function Apple() {
    this.position = new Block(10, 10)
}

Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlock - 2)) + 1;
    let randomRow = Math.floor(Math.random() * (heightInBlock - 2)) + 1;
    this.position = new Block(randomCol, randomRow);
};

let snake = new Snake(); let apple = new Apple();

let playing = true

function gameLoop() {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    // Устанавливается в false функцией gameOver
    if (playing) {
        setTimeout(gameLoop, animationTime);
    }
};

// Начинаем игровой цикл
gameLoop();

document.addEventListener('keydown', function (event) {
    // let newDirection = event.key
    // if (newDirection === 'ArrowDown' ||
    //     newDirection === 'ArrowLeft' ||
    //     newDirection === 'ArrowRight' ||
    //     newDirection === 'ArrowUp') {
    //     snake.setDirection(newDirection)
    // }
    let newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
})
// Преобразуем коды клавиш в направления
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};
btnUp.addEventListener('click', function () {
    let newDirection = this.textContent
    if (newDirection = 'up') {
        snake.setDirection(newDirection);
    }
})
btnLeft.addEventListener('click', function () {
    let newDirection = this.textContent
    if (newDirection = 'left') {
        snake.setDirection(newDirection);
    }
})
btnDown.addEventListener('click', function () {
    let newDirection = this.textContent
    if (newDirection = 'down') {
        snake.setDirection(newDirection);
    }
})
btnRight.addEventListener('click', function () {
    let newDirection = this.textContent
    if (newDirection = 'right') {
        snake.setDirection(newDirection);
    }
})


// Задаем обработчик события keydown (клавиши-стрелки)
// $("body").keydown(function (event) {
//     let newDirection = directions[event.keyCode];
//     if (newDirection !== undefined) {
//         snake.setDirection(newDirection);
//     }
// });


//----------------------------------- ПСЕВДОКОД -----------------------------------
//  Настроить «холст»
// Установить счет игры в 0
// Создать змейку
// Создать яблоко
// Каждые 100 миллисекунд {
//   Очистить «холст»
//   Напечатать текущий счет игры
//   Сдвинуть змейку в текущем направлении
//   Если змейка столкнулась со стеной или своим хвостом {
//     Закончить игру
//   } Иначе Если змейка съела яблоко {
//     Увеличить счет на 1
//     Переместить яблоко на новое место
//     Увеличить длину змейки
//   }
//   Для каждого сегмента тела змейки {
//     Нарисовать сегмент
//   }
//   Нарисовать яблоко
// 238 Часть III. Графика
// Нарисовать рамку
// }
// Когда игрок нажмет клавишу {
//   Если это клавиша-стрелка {
//     Обновить направление движения змейки
//   }
// }
