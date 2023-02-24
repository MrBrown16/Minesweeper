let rowcol;
let mines;
console.log(document.getElementsByTagName("h2").value);

window.addEventListener('contextmenu', (event) => {

    event.preventDefault();
    
    });

document.getElementById("input").onsubmit=function(e){
    e.preventDefault();
    
    rowcol = Number(e.target.elements.rowcol.value);
    
    mines = Number(e.target.elements.mines.value);

    if (mines>(rowcol*rowcol)){
        document.querySelector("#setup h2").innerHTML="Are you mentally challanged?";
    }
   fieldCreate();
   minePlace();
   let cells = document.getElementsByClassName("col");
   console.log(cells);
   cells.forEach(function(element){
    mineCount(element);
   })
};
function fieldCreate(){
    let field = document.getElementById("field");
    field.innerHTML = "";
    document.getElementById("setup").style.display = "none";
    for (let i = 0; i < rowcol; i++) {
        let row = document.createElement("div");
        row.className = "row";
        for (let j = 0; j < rowcol; j++) {
            let col = document.createElement("div");
            col.className = "col";
            
            col.onmousedown = click;
            
            row.appendChild(col);
        };
        field.appendChild(row);
        
    };
    
};
 
function minePlace(){
    for (let i = 0; i < mines; i++) {
        let x = Math.round(Math.random()*(rowcol-1));
        let y = Math.round(Math.random()*(rowcol-1));
        console.log(document.getElementById("field"))
        console.log(x,y);
        let c = document.getElementById("field").children[x].children[y];
        if (c.dataset.mine == "1") i--;
        else{
            c.dataset.mine = "1";
            c.classList.add("mine");
        }
    }
}
function mineCount(cell){
    let mineNum = 0;

    if (!cell.dataset.mine){
        if(cell.previousElementSiblig()
        && (cell.previousElementSiblig.dataset.mine))
            mineNum++;

        if(cell.previousElementSiblig()
        && (cell.previousElementSiblig.dataset.mine))
            mineNum++;

        let index = 0;
        let beforeindex = cell.previousElementSiblig;

        while(beforeindex){
            hanyadik++;
            beforeindex = beforeindex.previousElementSiblig;
        }

        if(cell.parentNode.previousElementSiblig){
            let start = (index - 1 >= 0)?index - 1 : 0;
            let end = (index + 1 < col)?index + 1 : index;

            for (let i = start; i < end; i++) {
                if (cell.parentNode.nextElementSibling.children[i].dataset.mine) {
                    mineNum++;
                }
                
            }
        }
        cell.innerHTML = mineNum;
    }
};
function click(e){
    console.log(e);
    console.log(e.which);
    console.log("????",this);
    if (e.which == 1) {
        console.log("1");
        if (this.dataset.mine) {
            let cells = document.getElementsByClassName("col");
            for (let i = 0; i < cells.length; i++) {
                cells[i].onmousedown = null;
                
            }
        }
        this.classList.remove("mine");
        this.classList.add("bumm");
        document.getElementById
        document.querySelector("setup h2").innerHTML = "You died";
        this.style.backgroundColor = "orangered";

    }
    else if(e.which == 3){
        console.log("3");
        this.style.backgroundColor = "green";
    };
    

};