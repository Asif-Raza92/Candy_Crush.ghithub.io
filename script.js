function createSprinkles(x, y) {
    const numSprinkles = 15;
    const container = document.querySelector('.candy-container');
    const colors = ['#FF1493', '#4ECDC4', '#FFE66D', '#FF6B6B', '#9B59B6'];
    
    for (let i = 0; i < numSprinkles; i++) {
      const sprinkle = document.createElement('div');
      sprinkle.className = 'sprinkle';
      sprinkle.style.left = x + 'px';
      sprinkle.style.top = y + 'px';
      sprinkle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = (i / numSprinkles) * 2 * Math.PI;
      const distance = 50 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rotation = Math.random() * 360;
      
      sprinkle.style.setProperty('--tx', `${tx}px`);
      sprinkle.style.setProperty('--ty', `${ty}px`);
      sprinkle.style.setProperty('--tr', `${rotation}deg`);
      sprinkle.style.animation = 'particle-spread 1s ease-out forwards';
      
      container.appendChild(sprinkle);
      setTimeout(() => sprinkle.remove(), 1000);
    }
  }

  function createParticles(x, y, color) {
    const numParticles = 12;
    const container = document.querySelector('.candy-container');
    
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = color;
      
      const angle = (i / numParticles) * 2 * Math.PI;
      const distance = 100 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rotation = Math.random() * 360;
      
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);
      particle.style.setProperty('--tr', `${rotation}deg`);
      particle.style.animation = 'particle-spread 0.8s ease-out forwards';
      
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }

  function createCandy() {
    const container = document.querySelector('.candy-container');
    const candy = document.createElement('div');
    
    const candyTypes = ['candy1', 'candy2', 'candy3', 'candy4', 'candy5', 'candy6'];
    const randomType = candyTypes[Math.floor(Math.random() * candyTypes.length)];
    const colors = {
      'candy1': '#FF6B6B',
      'candy2': '#4ECDC4',
      'candy3': '#FFE66D',
      'candy4': '#FF69B4',
      'candy5': '#9B59B6',
      'candy6': '#FF6B6B'
    };
    
    candy.className = `candy ${randomType}`;
    
    const leftPos = Math.random() * (window.innerWidth - 30);
    candy.style.left = leftPos + 'px';
    
    container.appendChild(candy);
    
    setTimeout(() => {
      const rect = candy.getBoundingClientRect();
      createParticles(rect.left, rect.top, colors[randomType]);
      createSprinkles(rect.left, rect.top);
    }, 2000);
    
    setTimeout(() => candy.remove(), 4000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Create candies more frequently
    setInterval(createCandy, 400);
  });

var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var specialCandies = ["Striped-H", "Striped-V", "Wrapped"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

function createSpecialCandy(type, color, tile) {
    switch(type) {
        case "Striped-H":
            tile.src = `./images/${color}-Striped-Horizontal.png`;
            tile.dataset.special = "striped-h";
            tile.dataset.color = color;
            break;
        case "Striped-V":
            tile.src = `./images/${color}-Striped-Vertical.png`;
            tile.dataset.special = "striped-v";
            tile.dataset.color = color;
            break;
        case "Wrapped":
            tile.src = `./images/${color}-Wrapped.png`;
            tile.dataset.special = "wrapped";
            tile.dataset.color = color;
            break;
    }
}

window.onload = function() {
    startGame();

    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)];
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        let currSpecial = currTile.dataset.special;
        let otherSpecial = otherTile.dataset.special;
        let currColor = currTile.dataset.color;
        let otherColor = otherTile.dataset.color;

        currTile.src = otherImg;
        otherTile.src = currImg;
        currTile.dataset.special = otherSpecial;
        otherTile.dataset.special = currSpecial;
        currTile.dataset.color = otherColor;
        otherTile.dataset.color = currColor;

        let validMove = checkValid();
        if (!validMove) {
            currTile.src = currImg;
            otherTile.src = otherImg;
            currTile.dataset.special = currSpecial;
            otherTile.dataset.special = otherSpecial;
            currTile.dataset.color = currColor;
            otherTile.dataset.color = otherColor;
        }
    }
}

function crushFive() {
    let crushed = false;
    
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-4; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            let candy5 = board[r][c+4];
            if (candy1.src == candy2.src && candy2.src == candy3.src && 
                candy3.src == candy4.src && candy4.src == candy5.src && !candy1.src.includes("blank")) {
                
                let candyColor = candy1.src.split("/").pop().split(".")[0];
                createSpecialCandy("Wrapped", candyColor, candy3);
                
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                candy5.src = "./images/blank.png";
                score += 50;
                crushed = true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-4; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            let candy5 = board[r+4][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && 
                candy3.src == candy4.src && candy4.src == candy5.src && !candy1.src.includes("blank")) {
                
                let candyColor = candy1.src.split("/").pop().split(".")[0];
                createSpecialCandy("Wrapped", candyColor, candy3);
                
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                candy5.src = "./images/blank.png";
                score += 50;
                crushed = true;
            }
        }
    }
    return crushed;
}

function crushFour() {
    let crushed = false;
    
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-3; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            let candy4 = board[r][c+3];
            if (candy1.src == candy2.src && candy2.src == candy3.src && 
                candy3.src == candy4.src && !candy1.src.includes("blank")) {
                
                let candyColor = candy1.src.split("/").pop().split(".")[0];
                createSpecialCandy("Striped-H", candyColor, candy2);
                
                candy1.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                score += 40;
                crushed = true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-3; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            let candy4 = board[r+3][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && 
                candy3.src == candy4.src && !candy1.src.includes("blank")) {
                
                let candyColor = candy1.src.split("/").pop().split(".")[0];
                createSpecialCandy("Striped-V", candyColor, candy2);
                
                candy1.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                candy4.src = "./images/blank.png";
                score += 40;
                crushed = true;
            }
        }
    }
    return crushed;
}

function crushThree() {
    let crushed = false;
    
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
                crushed = true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
                crushed = true;
            }
        }
    }
    return crushed;
}

function crushCandy() {
    crushFive();
    crushFour();
    crushThree();
    document.getElementById("score").innerText = score;
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }
    return false;
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = rows-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                board[ind][c].dataset.special = board[r][c].dataset.special;
                board[ind][c].dataset.color = board[r][c].dataset.color;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
            board[r][c].dataset.special = "";
            board[r][c].dataset.color = "";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            let candyColor = randomCandy();
            board[0][c].src = `./images/${candyColor}.png`;
            board[0][c].dataset.special = "";
            board[0][c].dataset.color = candyColor;
        }
    }
}
