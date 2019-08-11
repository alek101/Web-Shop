addEventListener('DOMContentLoaded',function(){
    ws.napSvePr(korpa,proizvodi,strana.prod);

    ws.upisVrKorpeDugme(korpa);

    strana.inputi[0].addEventListener('keyup',function(){
        ws.findName(korpa,proizvodi,strana.inputi[0].value,strana.prod);
    })

    strana.inputi[1].addEventListener('keyup',function(){
        filtriraj();
    })

    strana.inputi[2].addEventListener('keyup',function(){
        filtriraj();
    })

    strana.krit.addEventListener('change',function(){
        filtriraj();
    })

    strana.dugKorpa.addEventListener('click',function(){
        window.close();
         window.open('korpa.html');
     })
})

function filtriraj(){
    let max=strana.inputi[2].value;
    if(max=="") max=undefined;
    let min=strana.inputi[1].value;
    if(min=="") min=undefined;
    ws.filterCost(korpa,proizvodi,strana.prod,strana.krit.value,min,max);
}