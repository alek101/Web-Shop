addEventListener('DOMContentLoaded',function(){
    ws.napraviTabelu(korpa,proizvodi,strana.tabela,strana.klasTD,strana.malDug);
    ws.upisiVrednostKorpe(korpa,strana.rezKor);

    strana.naruci.addEventListener('click',function(){
        ws.naruci();
        window.close();
        window.open('index.html');
    })
});