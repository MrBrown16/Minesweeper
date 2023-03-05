let rowcol;
let mines;
let flags = 0;
let flaggedmines = 0;
let uncovered = 0;
let tapTimer;


window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

document.getElementById("input").onsubmit = function (e) {
    e.preventDefault();
    
    rowcol = Number(e.target.elements.rowcol.value);
    mines = Number(e.target.elements.mines.value);

    if (mines >= (rowcol * rowcol)) {
        document.querySelector("#setup h2").innerHTML = "Are you mentally challenged?";
        document.getElementById("mines").style.backgroundColor = "red";
        return false;
    }
    fieldCreate();
};

function begin(){
    document.getElementById("rowcol").value="9";
    document.getElementById("mines").value="10";
};

function inter(){
    document.getElementById("rowcol").value="16";
    document.getElementById("mines").value="40";
};

function exp(){
    document.getElementById("rowcol").value="22";
    document.getElementById("mines").value="98";
};

function fieldCreate() {
    document.getElementById("setup").style.display = "none";
    uncovered=0;
    flaggedmines=0;
    flags=0;
    let field = document.getElementById("field");
    field.style.marginTop="5%";
    field.innerHTML = "";
    let fieldwidth = field.clientWidth;
    let colwidth = ((fieldwidth/rowcol)+"px");

    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            col.style.width=colwidth;
            col.onmousedown = click;
            row.appendChild(col);
            col.dataset.row = i + 1;
            col.dataset.col = j + 1;
            col.dataset.ch=0;
        };
        field.appendChild(row);
    };
    minePlace();
};

function minePlace() {
    for (let i = 0; i < mines; i++) {
        let x = Math.round(Math.random() * (rowcol - 1));
        let y = Math.round(Math.random() * (rowcol - 1));
        let c = document.getElementById("field").children[x].children[y];
        if (c.dataset.mine == "1") i--;
        else {
            c.dataset.mine = "1";
            c.classList.add("mine");
        }
    }
}

function mineCount(cell){
    let mineNum = 0;


    if ((cell.previousElementSibling)
        && (cell.previousElementSibling.dataset.mine))
        mineNum++
    else if ((cell.nextElementSibling)
        && (cell.nextElementSibling.dataset.mine))
        mineNum++;


    let index = 0;
    let beforeindex = cell.previousElementSibling;

    while (beforeindex) {
        index++;
        beforeindex = beforeindex.previousElementSibling;
    }
    if (cell.parentNode.previousElementSibling) {
        let start = (index - 1 >= 0) ? index - 1 : 0;
        let end = (index + 1 < rowcol) ? index + 1 : index;

        for (let i = start; i <= end; i++) {
            if (cell.parentNode.previousElementSibling.children[i].dataset.mine) {
                mineNum++;
            }

        }
    }
    if (cell.parentNode.nextElementSibling) {
        let start = (index - 1 >= 0) ? index - 1 : 0;
        let end = (index + 1 < rowcol) ? index + 1 : index;

        for (let i = start; i <= end; i++) {
            if (cell.parentNode.nextElementSibling.children[i].dataset.mine) {
                mineNum++;
            }

        }
    }
    // cell.innerHTML = mineNum;
    return mineNum;
};

function checkAdjacentDivs(row, col) {
    const adjacentDivs = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col) continue; // skip the chosen div
            const divElem = document.querySelector(`#field [data-row='${r}'][data-col='${c}']`);
        
            if ((divElem)&&(!divElem.dataset.checked)) {
                adjacentDivs.push(divElem);
                
            }
        }
    }
    return adjacentDivs;
}

function click(e) {
    // if(/Mobi/.test(navigator.userAgent)) {console.log("mobil");}
    // else {console.log("desktop");}
    e.preventDefault();
    let ez = e.target;
    clearTimeout(tapTimer);
    if (e.button == 2) {
        if (ez.classList.contains("flag")) {
            if (ez.classList.contains("mine")) {
                flaggedmines--;
            }
            ez.classList.remove("flag");
            flags--;
        }
        else if (!ez.classList.contains("flag")) {
            if (ez.classList.contains("mine")) {
                flaggedmines++;
            }
            ez.classList.toggle("flag");
            flags++;
        }

    }
    else {
        if (!ez.classList.contains("flag")) {
            if ((e.target.dataset.mine) && (!uncovered == 0)) {
                let cells = document.getElementsByClassName("col");
                for (let i = 0; i < cells.length; i++) {
                    cells[i].onmousedown = null;

                }
                document.getElementById("field").style.marginTop = "1%";
                ez.classList.remove("mine");
                ez.classList.add("bumm");
                document.getElementById("setup").style.display = "block";
                document.querySelector("#setup h2").innerHTML = "You died";
                ez.style.backgroundColor = "orangered";

            } else if ((!e.target.dataset.mine) && (ez.style.backgroundColor != "green")) {
                if (ez.style.backgroundColor != "green") {
                    uncovered++;
                }
                ez.style.backgroundColor = "green";
                ez.innerHTML = mineCount(ez);
                if (mineCount(ez) === 0) {
                    hasNoMinesAround(ez);
                }
            } else if ((e.target.dataset.mine) && (uncovered == 0)) {
                fieldCreate();
            }
        }

    }
    if ((flags==flaggedmines)&&(flaggedmines==mines)&&(((rowcol*rowcol)-mines)<=uncovered)) {
        document.querySelector("#setup h2").innerHTML = "You Won</br>Congratulation!!!";
        document.getElementById("setup").style.display = "block";
        document.getElementById("field").style.marginTop=0;
    }
};

function hasNoMinesAround(cell) {


    if (cell.dataset.ch==="0") {

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const adj = checkAdjacentDivs(row,col);
        cell.dataset.ch=1;
        adj.forEach(cell => {
            if (cell.style.backgroundColor!="green") {
                uncovered++;
            }
            cell.style.backgroundColor = "green";

            mc = mineCount(cell);
            cell.innerHTML= mc;
            if (mc===0) {
                hasNoMinesAround(cell);
            }
        });
    }
};


document.addEventListener("touchstart", function(e){
    // Start a timeout to simulate a right-click after 500ms
    this.longPressTimeout = setTimeout(function() {
        simulateRightClick(e);
    }, 500);
});

document.addEventListener("touchend", function(e){
    // Clear the timeout to prevent the right-click from firing
    clearTimeout(this.longPressTimeout);
});

document.addEventListener("touchmove", function(e){
    // If the user moves their finger before the timer fires, cancel the timer
    clearTimeout(tapTimer);
});

// Simulate a right-click event
function simulateRightClick(e){
    // Prevent the default context menu from appearing
    if (e.cancelable) {
        e.preventDefault();
      }
    // Create a new mouse event with the right-click button pressed
    var rightClickEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2,
        // Set the coordinates of the mouse event to the touch location
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
    });
    // Dispatch the mouse event on the target element
    e.target.dispatchEvent(rightClickEvent);
    click(rightClickEvent);
}