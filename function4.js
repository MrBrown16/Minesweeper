let rowcol;
let mines;
const cellsArray = [];
const minesArray = [];
let checkedCells;
//id === index;
//{id : null, value : null}
//value-types: [1 = not_mine, 2 = mine, 3 = flagged_mine, 4 = flagged_not_mine, 5 = exposed ]

let counter = ((rowcol*rowcol)-mines)+3;
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
    // Initialize an array to keep track of the state of each cell
    checkedCells = new Array((rowcol * rowcol)-1).fill(false);
    let field = document.getElementById("field");
    field.style.marginTop="5%";
    field.innerHTML = "";
    let fieldwidth = field.clientWidth;
    let colwidth = ((fieldwidth/rowcol)+"px");
    let ezid = 0;
    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            col.id = ezid;
            ezid++;
            col.style.width=colwidth;
            col.onmousedown = click;
            cellsArray.push({ value : 1 });
            row.appendChild(col);
        };
        field.appendChild(row);
    };
    // console.log("cellsArray: ", cellsArray);
    // console.log("typeof(cellsArray[1].value): ", typeof(cellsArray[1].value));
    minePlace();
    console.log("cellsArray: ", cellsArray);

};

function minePlace() {
    for (let i = 0; i < mines; i++) {
        let x = (Math.round(Math.random() * ((rowcol * rowcol) - 1)));
        console.log("x: ", x);
        let c = cellsArray[x];
        console.log("cellsArray[x]: ", cellsArray[x]);

        if ( c.value == 2 ) i--;
        else {
            c.value = 2;
            minesArray.push(x);
        }
    }
}

function mineCount(id){ //needs the id of the div
    let mineNum = 0;
    // console.log("id: ", id);
    // console.log(cellsArray);
    const adjacent = checkAdjacentDivs(id);
    // console.log("adjacent: ", adjacent);
    adjacent.forEach(e => {
        // console.log("typeof(cellsArray[1].value): ", typeof(cellsArray[1].value));
        // console.log("forEach e: ",e,"id: ", id);
        if (cellsArray[e].value == 2) {
            // console.log("if value 2 e: ",e,"id: ", id);
            mineNum++;
            // console.log("mineCount,minenum++");
        }else if (cellsArray[e].value == 3) {
            mineNum++;
            // console.log("mineCount,minenum++");
            // console.log("elif value 3 e: ",e,"id: ", id);
        }
    });
    // console.log("minenum: ", mineNum);
    return mineNum;
};

function checkAdjacentDivs(id) {
    const adjacentDivs = [];
    const localid = Number(id);
    const col = localid % rowcol;
    const row = Math.floor(localid / rowcol);
    console.log("col",col,"row",row);

    // Top-left corner
    if (row === 0 && col === 0) {
        adjacentDivs.push(localid + 1, localid + rowcol, localid + rowcol + 1);
        console.log("Top-left corner");
    }
    // Top-right corner
    else if (row === 0 && col === rowcol - 1 && localid !== rowcol-1) {
        adjacentDivs.push(localid - 1, localid + rowcol, localid + rowcol - 1);
        console.log("Top-right corner");
    }
    // Bottom-left corner
    else if (row === rowcol - 1 && col === 0) {
        adjacentDivs.push(localid - rowcol, localid - rowcol + 1, localid + 1);
        console.log("Bottom-left corner");
    }
    // Bottom-right corner
    else if (localid === rowcol * rowcol - 1 || (row === rowcol - 1 && col === rowcol - 1)) {
        adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - 1);
        console.log("Bottom-right corner");
    }
    // Top edge
    else if (row === 0) {
        adjacentDivs.push(localid - 1, localid + 1, localid + rowcol - 1, localid + rowcol, localid + rowcol + 1);
        console.log("Top edge");
    }
    // Bottom edge
    else if (row === rowcol - 1) {
        adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - rowcol + 1, localid - 1, localid + 1);
        console.log("Bottom edge");
    }
    // Left edge
    else if (col === 0) {
        adjacentDivs.push(localid - rowcol, localid - rowcol + 1, localid + 1, localid + rowcol, localid + rowcol + 1);
        console.log("Left edge");

    }
    // Right edge
    else if (col === rowcol - 1) {
        adjacentDivs.push(localid - rowcol - 1, localid - rowcol, localid - 1, localid + rowcol - 1, localid + rowcol);
        console.log("Right edge");
    }
    // Inner cells
    else {
        adjacentDivs.push(
            localid - rowcol - 1, localid - rowcol, localid - rowcol + 1,
            localid - 1, localid + 1,
            localid + rowcol - 1, localid + rowcol, localid + rowcol + 1
        );
        console.log("Inner cells");
    }
    console.log("check end adjacentdivs: ", adjacentDivs);
    return adjacentDivs.filter(adjacentId => adjacentId >= 0 && adjacentId < rowcol * rowcol).map(adjacentId => Number(adjacentId));
    // return adjacentDivs.filter(adjacentId => {
    //     const row = Math.floor(adjacentId / rowcol);
    //     const col = adjacentId % rowcol;
    //     return adjacentId >= 0 && adjacentId < rowcol * rowcol && row >= 0 && row < rowcol && col >= 0 && col < rowcol;
    //   });
      
}

function click(e) {
    e.preventDefault();

    let id = Number(e.target.id);
    const value = cellsArray[id].value;
    if (value == 5) {
        return; //Absolutely Nothing
    } else {
        if (counter < 3) {
            won();
        }
        uncovered++;
        let ez = e.target;
        
        clearTimeout(tapTimer);
        
        // console.log("value", value);
        // console.log("clicked ", e, "id: ", id);
        // console.log("cellsArray.length ", len);

        if (e.button == 2) { //right-click
            // console.log("right-clicked ", e, "id: ", id);

            if (value == 3) { //type 3 flagged_mine  -->> type 2 mine
                
                ez.classList.remove("flag");
                cellsArray[id].value = 2;
            }
            else if (value == 2) { //type 2 mine  -->> type 3 flagged_mine

                ez.classList.toggle("flag");
                cellsArray[id].value = 3;
            }
            else if (value == 4) { //type 4 flagged_not_mine  -->> type 1 not_mine
                
                ez.classList.remove("flag"); 
                cellsArray[id].value = 1;
            }
            else if (value == 1) { //type 1 not_mine  -->> type 4 flagged_not_mine

                ez.classList.toggle("flag");
                cellsArray[id].value = 4;
            }

        }
        else { //left click

            if (value == 3) {
                return; //nothing
            } else if (value == 4) {
                return; //nothing
            } else if (value == 1) {
                checkCell(id); 
            } else if ((value == 2)&&(uncovered == 0)) {
                fieldCreate(); //TODO: better way for not leting user instantlose
            } else if (value == 2) {
                bumm(ez);
            }
        }  
    }

};

function bumm(ez) {
    document.getElementById("field").style.marginTop = "1%";
    document.getElementById("setup").style.display = "block";
    document.querySelector("#setup h2").innerHTML = "You died";
    
    minesArray.forEach(id => {
        if (cellsArray[id].value == 3) {
            document.getElementById(id).classList.remove("flag");
            document.getElementById(id).classList.add("mine");
            document.getElementById(id).classList.add("flaggedmine");
        }else if (cellsArray[id].value == 2) {
            document.getElementById(id).classList.add("mine");
        }
    });
    ez.classList.remove("mine");
    ez.classList.add("bumm");
}

function won() { 
    if ((!cellsArray.includes(2))&&(!cellsArray.includes(1))&&(!cellsArray.includes(4))) {
        document.querySelector("#setup h2").innerHTML = "You Won</br>Congratulation!!!";
        document.getElementById("setup").style.display = "block";
        document.getElementById("field").style.marginTop=0;
        minesArray.forEach(id => {
            document.getElementById(id).classList.add("flaggedmine");
        });
    }
}

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

function checkCell(id) { //id represents a not flagged cell called from the outside only when not mine
    // Check if the cell is a mine
    if (cellsArray[id].value == 2) {
        return;
    }   
    // Check if the cell has already been checked
    if (checkedCells[id]) {
        return;
    }

    // Mark the cell as checked
    checkedCells[id] = true;
    counter--;
    let mc = mineCount(id);

    if (mc == 0) {
        const adj = checkAdjacentDivs(id);
        adj.forEach(id => {
            document.getElementById(id).style.backgroundColor = "green";
            document.getElementById(id).innerHTML = mc;
            cellsArray[id].value = 5;
            checkCell(id);
        });
        document.getElementById(id).innerHTML = "";
    } else {
        document.getElementById(id).innerHTML = mc;
        document.getElementById(id).style.backgroundColor = "green";
        cellsArray[id].value = 5;
    }
}
