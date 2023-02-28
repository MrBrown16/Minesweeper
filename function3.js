let rowcol;
let mines;

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
    minePlace();
};

function fieldCreate() {
    document.getElementById("setup").style.display = "none";

    let field = document.getElementById("field");

    field.innerHTML = "";
    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";

        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            col.onmousedown = click;
            row.appendChild(col);
            col.dataset.row = i + 1;
            col.dataset.col = j + 1;
            col.dataset.ch=0;
        };
        field.appendChild(row);
    };
    let cells = document.getElementsByClassName("col");
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
        mineNum++;
    //console.log("prev.s",mineNum);

    if ((cell.nextElementSibling)
        && (cell.nextElementSibling.dataset.mine))
        mineNum++;
    //console.log("next.s",mineNum);


    let index = 0;
    let beforeindex = cell.previousElementSibling;

    while (beforeindex) {
        index++;
        beforeindex = beforeindex.previousElementSibling;
        //console.log("elem helye: ",beforeindex);
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
    e.preventDefault();

    if (e.button == 2) {
        console.log("right click");
        console.log("this",this);
        //console.log("e",e);
        this.classList.toggle("flag");
    }
    else {
        console.log("left click");
        //console.log(e.target.dataset.mine);
        if (e.target.dataset.mine) {
            console.log("BOOM!!!");
            let cells = document.getElementsByClassName("col");
            for (let i = 0; i < cells.length; i++) {
                cells[i].onmousedown = null;
                
            }
        
            this.classList.remove("mine");
            this.classList.add("bumm");
            document.getElementById("setup").style.display="block";
            document.querySelector("#setup h2").innerHTML = "You died";
            this.style.backgroundColor = "orangered";

        } else if (!e.target.dataset.mine) {
            console.log("zero mines");
            this.style.backgroundColor = "green";
            this.innerHTML= mineCount(this);
            if (mineCount(this)===0) {
                hasNoMinesAround(this);
            }
            

            
        }
        
    }
};

function hasNoMinesAround(cell) {


    if (cell.dataset.ch==="0") {
        // console.log(cell.dataset.ch);
        // console.log(typeof(cell.dataset.ch));
        // console.log(cell.dataset.ch);
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const adj = checkAdjacentDivs(row,col);
        cell.dataset.ch=1;
        adj.forEach(cell => {
            console.log("környező db szám",adj.length);
            cell.style.backgroundColor = "green";
            mc = mineCount(cell);
            cell.innerHTML= mc;
            if (mc===0) {
                console.log("hasNoMinesAround if");
                console.log(cell);
                // for (let i = 0; i < 2; i++) {
                //     hasNoMinesAround(cell);
                    
                // }
                hasNoMinesAround(cell);
            }
        });
    }
    
    
}
