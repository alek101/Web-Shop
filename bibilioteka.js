let pf={
    makeElement:function(type="div",settings={
        text:null,
        className:"",
        src:"",
        alt:"There is no Picture aveilable",
        width:0,
        height:0,
        href:"",
    }){
        let element=document.createElement(type);
            element.className=settings.className;
        switch(type){
            case "img":{
                    element=document.createElement('img');
                    element.src=settings.src;
                    element.alt=settings.alt;
                    if(settings.width>0 && !isNaN(Number(settings.width))) element.style.width=settings.width+"px";
                    if(settings.height>0 && !isNaN(Number(settings.height))) element.style.height=settings.height+"px";
            }; break;
            case "a":{
                    element.href=settings.href;
                    element.innerHTML=settings.text;
            };break;
            default:{
                    element.innerHTML=settings.text;
            }
        }       
        return element;
    },
    addBasket:function(korpa,proizvod,dodaj=1){
        let id=proizvod.id;
        if(korpa.length>0 && korpa.some(c=>c.id==id)){
            let i=korpa.findIndex(c=>c.id==id);
                korpa[i].kolicina+=dodaj;
                korpa[i].vrednost+=korpa[i].cena*dodaj;
                //procedura za brisanje
                if (korpa[i].kolicina<=0) korpa.splice(i,1);
        }
        else{
            let c=proizvod.cena;
            let naziv=proizvod.naziv;
            korpa.push({
                id:id,
                naziv:naziv,
                cena: c,
                kolicina: k,
                vrednost: c,
            })
        }
        return korpa;
    },
    nadjiIDstrane:function(){
        //nadji id strane
        return window.location.href.split('?').flatMap(c=>c.split('=')).flatMap(c=>c.split('&'))[2];
    },
    nadjiProizvodPoId:function(id,proizvodi){
        //nadji indeks proizvoda
        return proizvodi.findIndex(c=>c.id==id);
    },
    pretragaNiz:function(array,settings={
        string:"",
        min:"",
        max:"",
    }){
        let result={};
        result.string=array.filter(el=>el.toLowerCase().includes(settings.string.toLowerCase()));
        result.min=array.filter(el=>el>=settings.min);
        result.max=array.filter(el=>el<=settings.max);
        result.range=array.filter(el=>el>=settings.min && el<=settings.max);
        return result;
    },
    formatBroja:function(num){
        return new Intl.NumberFormat('sr-RS',{minimumFractionDigits: 2}).format(num);
    },
}