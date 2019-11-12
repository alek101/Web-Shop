let pf={
    makeElement:function(type="div",settings={
        text: "",
        className:"",
        src:"",
        alt:"There is no Picture aveilable",
        width:0,
        height:0,
        href:"",
        })
        {

            settings.text=settings.text || "";
            settings.className=settings.className || "";
            settings.src=settings.src || "";
            settings.alt=settings.alt || "There is no Picture aveilable";
            settings.href=settings.href || "";
        let element=document.createElement(type);
            element.className=settings.className;
        switch(type){
            case "img":{
                    element=document.createElement('img');
                    element.className=settings.className;
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

    addBasket:function(korpa,proizvod,dodaj){
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
            let l={
                id:id,
                naziv:naziv,
                cena: c,
                kolicina: 1,
                vrednost: c,
            };
            console.log(korpa);
            korpa.push(l)
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
    formatBroja:function(num){
        return new Intl.NumberFormat('sr-RS',{minimumFractionDigits: 2}).format(num);
    },
    formatbroja2:function(num){
        let n=num.toString().split(sep);
        (n[1]==undefined)? n[1]=",00":(n[1].length>2)? n[1]=","+n[1].slice(0,2):(n[1].length==2)? n[1]=","+n[1]:n[1]=","+n[1]+"0";
        let l=n[0].length;
        return n[0].split("").reverse().reduce((s,c,i)=>(i%3==2 && i>0 && i!=l-1)? s+c+".":s+c,"").split("").reverse().join("")+n[1];
    },
    filterString:function(array_object,criterium,target,settings={sorter:1}){
        //array_object is array of object, criterium is part of object we are filtering, target is string we want to include.
        if(!Array.isArray(array_object)) throw new Error('First argument must be array!');
        if(typeof target!=="string") throw new Error('Argument is missing o it is not string!');
        if(typeof criterium!=="string") throw new Error('Argument is missing o it is not string!');
        if(settings.sorter!=1 && settings.sorter!=-1) throw new Error('Bad sorter!');
       return array_object.filter(object=>object[criterium].toLowerCase().includes(target.toLowerCase())).sort((a,b)=>(a[criterium]>b[criterium])? settings.sorter:-settings.sorter);
    },
    filterNumber:function(array_object,criterium,settings={
        sorter:1,
        min:-Infinity,
        max: Infinity}){
        //array_object is array of object, criterium is part of object we are filtering. 
        let min,max; 
        if(!Array.isArray(array_object)) throw new Error('First argument must be array!');
        if(typeof criterium!=="string") throw new Error('Argument is missing o it is not string!');
        if(settings.sorter!=1 && settings.sorter!=-1) throw new Error('Bad sorter!');
            (settings.min=="")? min=undefined:min=Number(settings.min);
            (settings.max=="")? max=undefined:max=Number(settings.max);
            if(isNaN(min)) min=-Infinity;
            if(isNaN(max)) max= Infinity;
       return array_object.filter(object=>object[criterium]>=min && object[criterium]<=max).sort((a,b)=>(a[criterium]>b[criterium])? settings.sorter:-settings.sorter);
    },
    validateEmail: function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    createDate: function (inputDate)
    {
        inputDate=inputDate.split('-');
        return new Date(inputDate[0],inputDate[1]-1,inputDate[2]);
    },
}