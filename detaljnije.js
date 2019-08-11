addEventListener('DOMContentLoaded',function(){
    strana.prodDet.innerHTML="";
    let id=pf.nadjiIDstrane();
    ws.napPrStranu(korpa,proizvodi,id,strana.prodDet);

    ws.upisVrKorpeDugme(korpa);

    strana.dugKorpa.addEventListener('click',function(){
        window.close();
         window.open('korpa.html');
     })

    strana.pocStranica.addEventListener('click',function(){
    window.close();
     window.open('index.html');
 })
})

