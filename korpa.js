let korpa;

let k=sessionStorage.getItem('korpa');

if(k){
    korpa=JSON.parse(k);
}
else{
    korpa=[];
}