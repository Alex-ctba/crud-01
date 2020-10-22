const { TIMEOUT } = require("dns")

(function ready(win, doc){
    if(doc.querySelectorAll('.delete')){
        for(let i = 0;i< doc.querySelectorAll('.delete').length;i++){
            doc.querySelectorAll('.delete')[i].addEventListener('click', function(event){
                if(confirm('Deseja mesmo apagar este item?')){
                    return true
                }else{
                    event.preventDefault()
                }
            })
        }
    }
})(window,document)



