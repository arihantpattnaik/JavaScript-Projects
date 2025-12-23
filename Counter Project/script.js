let count=0;

const countelement=document.querySelector("#count");
const incBtn=document.querySelector("#increment-button");
const decBtn=document.querySelector("#decrement-button");
const resetBtn=document.querySelector("#reset-button");
const plusfive=document.querySelector("#plus5-button");

function calculate(){
    countelement.textContent=count;

    
    if(count==0)
    {
        decBtn.disabled=true;
        countelement.style.color="gray"
    }
    else {
        countelement.style.color = "green";
        decBtn.disabled = false;
    }
    if(count > 10)
    {
        countelement.style.color="red";
    }
}

incBtn.addEventListener("click",()=>
{
    count++;
    calculate();
});

decBtn.addEventListener("click", () => {
    if (count > 0) {
      count--;
      calculate();
    }
  });
  
resetBtn.addEventListener("click", () => {
    count = 0;
    calculate();
  });

plusfive.addEventListener("click",()=>
{
    count=count+5;
    calculate();
});